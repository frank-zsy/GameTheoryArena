import { Developer } from './developer';
import { Comment } from './comment';
import { BaseEntity } from './baseEntity';
import { EntityValue } from './types';

const DISSCUSION_RATIO = 1;

export class Thread extends BaseEntity {
  public isClosed: boolean = false;
  public disscusionQuota: number;
  private comments: Comment[] = [];

  constructor(
    public id: number,
    author: Developer, createdAt: number, value: EntityValue,
  ) {
    super(author, createdAt, value);
    this.disscusionQuota = this.getCost() * DISSCUSION_RATIO;
  }

  public close(): void {
    this.isClosed = true;
  }

  public addComment(comment: Comment): void {
    this.comments.push(comment);
    this.disscusionQuota -= comment.getCost();
    if (this.disscusionQuota <= 0) {
      this.isClosed = true;
    }
  }

  public getComments(): Comment[] {
    return this.comments;
  }

  public getValue() {
    return super.getValue() * 2;
  }

  public getCost() {
    return Math.abs(this.getValue());
  }

}
