import { BaseEntity } from './baseEntity';
import { Developer } from './developer';
import { EntityValue } from './types';

export class Comment extends BaseEntity {
  constructor(
    public id: number,
    author: Developer, createdAt: number, value: EntityValue
  ) {
    super(author, createdAt, value);
  }
}
