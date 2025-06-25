import { Developer } from "./developer";
import { EntityValue } from "./types";

export class Reaction {
  constructor(
    public author: Developer,
    public createdAt: number,
    public value: EntityValue
  ) { }
}
