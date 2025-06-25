import { Repository } from '../entity/repository';
import { BaseEvaluator } from '../../core/evaluator/baseEvaluator';

/**
 * Simple count evaluator for open source repository
 * Just use event count as the performance of developers
 * Save the value in developers' performance property for every developer
 */
export class CodeValueEvaluator extends BaseEvaluator {

  public async evaluate(_repository: Repository, _round: number): Promise<void> {
    // const developerAddCount = (developer: Developer) => {
    //   developer.performance.set(startTime, (developer.performance.get(startTime) ?? 0) + 1);
    // };
    // const issues = repository.getIssues();
    // issues.forEach(issue => {
    //   if (this.inTimeRange(issue.createdAt, startTime, endTime)) developerAddCount(issue.author);
    //   issue.getComments().forEach(c => {
    //     if (this.inTimeRange(c.createdAt, startTime, endTime)) developerAddCount(c.author);
    //   });
    // });
    // const prs = repository.getPullRequests();
    // prs.forEach(pr => {
    //   if (this.inTimeRange(pr.createdAt, startTime, endTime)) developerAddCount(pr.author);
    //   pr.getComments().forEach(c => {
    //     if (this.inTimeRange(c.createdAt, startTime, endTime)) developerAddCount(c.author);
    //   });
    //   pr.getReviewComments().forEach(r => {
    //     if (this.inTimeRange(r.createdAt, startTime, endTime)) developerAddCount(r.author);
    //   });
    // });
  }

}
