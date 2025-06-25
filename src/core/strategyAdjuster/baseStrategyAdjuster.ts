import { BaseArena } from "../entity/baseArena";
import { BasePlayer } from "../entity/basePlayer";

export abstract class BaseStrategyAdjuster {

  constructor(
    public name: string
  ) { }

  abstract adjustStrategy(arena: BaseArena<BasePlayer>, round: number): Promise<boolean>;
}
