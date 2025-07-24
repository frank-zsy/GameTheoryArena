import { Logger } from "../../utils/utils";
import { BaseArena } from "../entity/baseArena";
import { BasePlayer } from "../entity/basePlayer";
import { BaseEvaluator } from "../evaluator/baseEvaluator";
import { BaseStrategyAdjuster } from "../strategyAdjuster/baseStrategyAdjuster";

interface SimulatorConfig {
  // How many rounds will the arena last
  maxRounds: number;
  // How many steps in a single round
  steps: number;
}

export abstract class BaseSimulator<TPlayer extends BasePlayer, TArena extends BaseArena<TPlayer>> {

  protected arena: TArena;
  protected strategyAdjuster: BaseStrategyAdjuster;
  protected evaluator: BaseEvaluator;
  protected initialized: boolean;

  constructor(
    public name: string,
    protected config: SimulatorConfig
  ) {
    this.initialized = false;
  }

  public setArena(arena: TArena): this {
    this.arena = arena;
    return this;
  }

  public setStrategyAdjuster(sa: BaseStrategyAdjuster): this {
    this.strategyAdjuster = sa;
    return this;
  }

  public setEvaluator(evl: BaseEvaluator): this {
    this.evaluator = evl;
    return this;
  }

  abstract initialize(): Promise<void>;
  abstract preRound(r: number): Promise<void>;
  abstract postRound(r: number): Promise<void>;

  public async start() {
    if (!this.arena || !this.evaluator || !this.strategyAdjuster) {
      Logger.error('Please set arena, evalutor and strategy adjuster.');
      return;
    }
    await this.initialize();
    this.initialized = true;
    for (let r = 1; r <= this.config.maxRounds; r++) {
      // await this.stats(r);
      await this.preRound(r);
      for (let s = 1; s <= this.config.steps; s++) {
        for (const p of this.arena.getPlayers()) {
          await p.performAction(this.arena, r, s);
        }
      }
      await this.evaluator.evaluate(this.arena, r);
      const converged = await this.strategyAdjuster.adjustStrategy(this.arena, r);
      await this.postRound(r);
      if (converged) break;
    }
  }

  protected async stats(round: number) {
    const strategyCountMap = new Map<string, number>();
    this.arena.getPlayers().forEach(p => {
      strategyCountMap.set(p.strategy.getName(), (strategyCountMap.get(p.strategy.getName()) ?? 0) + 1);
    });
    const arr = Array.from(strategyCountMap.entries())
      .map(s => ({ name: s[0], count: s[1] }))
      .sort((a, b) => b.count - a.count);
    Logger.info(`Stats results for round ${round}`);
    console.table(arr);
  }

}
