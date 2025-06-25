import { Developer } from './developer';
import { Issue } from './issue';
import { Comment } from './comment';
import { EntityValue } from './types';

export class PullRequest extends Issue {
  public isMerged: boolean = false;
  private reviewComments: Comment[] = [];

  constructor(id: number, author: Developer, createtAt: number, value: EntityValue) {
    super(id, author, createtAt, value, 'NORMAL');
  }

  public close(isMerged: boolean = true): void {
    this.isMerged = isMerged;
    super.close();
  }

  public addReviewComment(reviewComment: Comment): void {
    this.reviewComments.push(reviewComment);
  }

  public getReviewComments(): Comment[] {
    return this.reviewComments;
  }

  public getLLMDescription(): string {
    return `  - PR #${this.id}: Author: ${this.author.id}`;
  }
}
