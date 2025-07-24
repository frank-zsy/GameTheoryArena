import { Repository } from '../entity/repository';
import { BaseEvaluator } from '../../core/evaluator/baseEvaluator';
import { Developer } from '../entity/developer';

/**
 * Simple value evaluator for open source repository
 */
export class ValueEvaluator extends BaseEvaluator {

  public async evaluate(repository: Repository, round: number): Promise<void> {
    const developerAddValue = (developer: Developer, value: number) => {
      developer.performance.set(round, (developer.performance.get(round) ?? 0) + value);
    };
    const threads = repository.getThreads();
    threads.forEach(thread => {
      if (thread.createdAt === round) developerAddValue(thread.author, thread.getValue());
      thread.getComments().forEach(c => {
        if (c.createdAt === round) developerAddValue(c.author, c.getValue());
      });
    });
    repository.getPlayers().forEach(p => {
      p.performance.set(round, p.performance.get(round)! / p.costMap.get(round)!);
    });
  }

}
