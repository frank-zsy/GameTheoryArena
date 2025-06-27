import { Developer } from './developer';
import { Comment } from './comment';
import { BaseEntity } from './baseEntity';
import { capabilityValueMap, EntityValue } from './types';

const DISSCUSION_RATIO = 3;

export class Thread extends BaseEntity {
  public isClosed: boolean = false;
  public disscusionQuota: number;
  private comments: Comment[] = [];

  constructor(
    public id: number,
    author: Developer, createdAt: number, value: EntityValue,
  ) {
    super(author, createdAt, value);
    this.disscusionQuota = capabilityValueMap.get(this.value)! * DISSCUSION_RATIO;
  }

  public close(): void {
    this.isClosed = true;
  }

  public addComment(comment: Comment): void {
    this.comments.push(comment);
    this.disscusionQuota -= capabilityValueMap.get(comment.value)!;
    if (this.disscusionQuota <= 0) {
      this.isClosed = true;
    }
  }

  public getComments(): Comment[] {
    return this.comments;
  }

  public getCost() {
    return Math.abs(this.getValue() * 2);
  }

}
