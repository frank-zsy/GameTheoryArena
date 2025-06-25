import { BaseStrategy } from "../strategy/baseStrategy";
import { BaseArena } from "./baseArena";

export class BasePlayer {

  // performance for each round
  public performance: Map<number, number> = new Map();

  constructor(
    public id: number,
    public name: string,
    public strategy: BaseStrategy
  ) { }

  public async performAction(arena: BaseArena<BasePlayer>, round: number, step: number): Promise<void> {
    await this.strategy.execute(this, arena, round, step);
  }

}
