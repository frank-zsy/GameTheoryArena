import { Repository } from '../entity/repository';
import { BaseEvaluator } from '../../core/evaluator/baseEvaluator';
import { Developer } from '../entity/developer';

/**
 * Simple count evaluator for open source repository
 * Just use event count as the performance of developers
 */
export class SimpleCountEvaluator extends BaseEvaluator {

  public async evaluate(repository: Repository, round: number): Promise<void> {
    const developerAddCount = (developer: Developer) => {
      developer.performance.set(round, (developer.performance.get(round) ?? 0) + 1);
    };
    const issues = repository.getThreads();
    issues.forEach(issue => {
      if (issue.createdAt === round) developerAddCount(issue.author);
      issue.getComments().forEach(c => {
        if (c.createdAt === round) developerAddCount(c.author);
      });
    });
    repository.getPlayers().forEach(p => {
      p.performance.set(round, p.performance.get(round)! / p.costMap.get(round)!);
    });
  }

}
