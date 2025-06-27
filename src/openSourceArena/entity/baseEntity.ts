import { Developer } from "./developer";
import { Reaction } from "./reaction";
import { capabilityValueMap, EntityValue } from "./types";

export class BaseEntity {

  private reactions: Reaction[] = [];

  constructor(
    public author: Developer,
    public createdAt: number,
    public value: EntityValue
  ) { }

  public addReaction(author: Developer, createdAt: number, value: EntityValue) {
    const reaction = new Reaction(author, createdAt, value);
    this.reactions.push(reaction);
  }

  public getReactions() {
    return this.reactions;
  }

  public getValue() {
    return capabilityValueMap.get(this.value)!;
  }

  public getCost() {
    return Math.abs(this.getValue());
  }
}
