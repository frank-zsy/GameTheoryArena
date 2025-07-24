import { Repository } from '../entity/repository';
import { BaseEvaluator } from '../../core/evaluator/baseEvaluator';
import { Developer } from '../entity/developer';
import { Thread } from '../entity/thread';
import { close, query as queryNeo4j, queryStream as queryStreamNeo4j } from '../../utils/neo4j';
// import { Logger } from '../../utils/utils';

interface OpenRankEvaluatorConfig {
  useEntityValue: boolean;
  useReaction: boolean;
}

/**
 * OpenRank evaluator for open source repository
 */
export class OpenRankEvaluator extends BaseEvaluator {

  private retentionFactor = 0.15;
  private backgroundRatio = 0.05;
  private OpenrankValueMap = new Map<string, number>();

  constructor(private config: OpenRankEvaluatorConfig) {
    super();
  }

  public async evaluate(repository: Repository, round: number): Promise<void> {

    const nodes = new Set<string>(), rels: { s: string; t: string; w: number }[] = [];
    const developerMap = new Map<number, Developer>();

    const developerThreadRelationship = new Map<number, Map<number, number>>();
    const threadValueMap = new Map<string, number>();
    const costMap = new Map<string, number>();
    const developerAddCost = (developer: Developer, thread: Thread, cost: number) => {
      developerMap.set(developer.id, developer);
      if (!developerThreadRelationship.has(developer.id)) {
        developerThreadRelationship.set(developer.id, new Map<number, number>());
      }
      developerThreadRelationship.get(developer.id)!.set(thread.id,
        (developerThreadRelationship.get(developer.id)!.get(thread.id) ?? 0) + cost);
      const uId = `u${developer.id}`;
      const tId = `t${thread.id}`;
      nodes.add(uId);
      nodes.add(tId);
      costMap.set(uId, (costMap.get(uId) ?? 0) + cost);
      costMap.set(tId, (costMap.get(tId) ?? 0) + cost);
    };
    const threads = repository.getThreads();
    threads.forEach(thread => {
      if (thread.createdAt === round) {
        developerAddCost(thread.author, thread, thread.getCost());
        threadValueMap.set(`t${thread.id}`, thread.getValue());
      }
      thread.getComments().forEach(c => {
        if (c.createdAt === round) {
          developerAddCost(c.author, thread, c.getCost());
          threadValueMap.set(`t${thread.id}`, (threadValueMap.get(`t${thread.id}`) ?? 0) + c.getValue());
        }
      });
    });

    for (const [d, i] of developerThreadRelationship.entries()) {
      nodes.add(`u${d}`);
      const uId = `u${d}`;
      for (const [t, v] of i) {
        const tId = `t${t}`;
        rels.push({ s: uId, t: tId, w: +((1 - this.backgroundRatio) * v / costMap.get(uId)!).toFixed(3) });
        rels.push({ s: tId, t: uId, w: +((1 - this.backgroundRatio) * v / costMap.get(tId)!).toFixed(3) });
      }
    }
    const averagePartial = 1 / nodes.size;
    for (const i of nodes) {
      rels.push({ s: i, t: 'r0', w: this.backgroundRatio });
      rels.push({ s: 'r0', t: i, w: averagePartial });
    }
    nodes.add('r0');

    const nodesArr = Array.from(nodes);
    const nodeIndexMap = new Map<string, number>(nodesArr.map((v, i) => [v, i]));

    const initialValueMap = new Map<string, number>();
    nodesArr.forEach(n => initialValueMap.set(n, 1.0));

    // Logger.info(`Calculate network of ${nodesArr.length} nodes and ${rels.length} rels.`);
    const nodesParam = nodesArr.map((n, index) => {
      let initialValue = this.OpenrankValueMap.get(`${n}_${round - 1}`) ?? 1.0;
      if (n.startsWith('t') && this.config.useEntityValue) {
        initialValue += threadValueMap.get(n) ?? 0;
      }
      if (n.startsWith('t') && this.config.useReaction) {
        initialValue += (threadValueMap.get(n) ?? 0) * 0.5;
      }
      return {
        id: index,
        i: initialValue,
        r: this.retentionFactor
      };
    });
    const relsParam = rels.map(r => ({ s: nodeIndexMap.get(r.s), t: nodeIndexMap.get(r.t), w: r.w }));

    const graphName = `OpenRank_graph_${round}`;
    await queryNeo4j('CALL gds.graph.drop($graphName, false)', { graphName });
    const cypher = 'CALL gds.graph.project.cypher($graphName, $nodesQuery, $relsQuery, { parameters: { nodes: $nodes, rels: $rels}});';
    await queryNeo4j(cypher, {
      graphName,
      nodesQuery: 'UNWIND $nodes AS n RETURN n.id AS id, n.i AS initValue, n.r AS retentionFactor',
      relsQuery: 'UNWIND $rels AS r RETURN r.s AS source, r.t AS target, r.w AS weight',
      nodes: nodesParam,
      rels: relsParam,
    });
    const result = new Map<string, number>();
    await queryStreamNeo4j(`CALL xlab.pregel.openrank.stream('${graphName}',{initValueProperty:'initValue',retentionFactorProperty:'retentionFactor',relationshipWeightProperty:'weight',tolerance:0.01,maxIterations:40,writeProperty:''}) YIELD nodeId AS i, values AS v RETURN *`,
      async row => {
        const { i, v } = row;
        result.set(nodesArr[i], v.open_rank);
      });
    await queryNeo4j('CALL gds.graph.drop($graphName, false)', { graphName });
    await close();

    for (const [id, value] of result) {
      this.OpenrankValueMap.set(`${id}_${round}`, value);
    }

    repository.getPlayers().forEach(p => {
      if (result.has(`u${p.id}`))
        p.performance.set(round, result.get(`u${p.id}`)! / p.costMap.get(round)!);
    });

  }

}
