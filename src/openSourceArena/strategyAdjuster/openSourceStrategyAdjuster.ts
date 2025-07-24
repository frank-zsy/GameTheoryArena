import { BaseStrategyAdjuster } from '../../core/strategyAdjuster/baseStrategyAdjuster';
import { Repository } from '../entity/repository';
import { collaborativityCompatible } from '../entity/types';

export class OpenSourceStrategyAdjuster extends BaseStrategyAdjuster {

  constructor() {
    super('Open Source Strategy Adjuster');
  }

  public async adjustStrategy(arena: Repository, round: number): Promise<boolean> {
    const developers = arena.getPlayers().filter(d => d.performance.has(round)).map(d => ({
      developer: d,
      performance: d.performance.get(round)!,
      strategy: d.strategy,
    }));

    let changeCount = 0;
    developers.forEach(d => {
      const outperformers = developers.filter(dev =>
        dev.performance > d.performance * (d.performance > 0 ? 1.2 : 0.8) && // outperform with 1.2x
        collaborativityCompatible(dev.developer.collaborativity, d.developer.collaborativity) && // compatibility
        d.developer.strategy.getName() !== dev.strategy.getName() // not same strategy
      );
      if (outperformers.length === 0) return;
      const randomStrategy = outperformers[Math.round(Math.random() * (outperformers.length - 1))];
      d.developer.collaborativity = randomStrategy.developer.collaborativity;
      d.developer.motivation = randomStrategy.developer.motivation;
      changeCount++;
    });

    return changeCount === 0;
  }

}
