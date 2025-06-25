import { BaseStrategyAdjuster } from '../../core/strategyAdjuster/baseStrategyAdjuster';
import { Repository } from '../entity/repository';

export class OpenSourceStrategyAdjuster extends BaseStrategyAdjuster {

  constructor() {
    super('Open Source Strategy Adjuster');
  }

  public async adjustStrategy(_arena: Repository, _round: number): Promise<boolean> {
    // const developers = arena.getPlayers().map(d => ({
    //   developer: d,
    //   performance: d.performance.get(round) ?? 0,
    // })).filter(d => d.performance > 0);

    // let changeCount = 0;
    // developers.forEach(d => {
    //   const outperformers = developers.filter(dev => dev != d && dev.performance > d.performance);
    //   if (outperformers.length === 0) return;
    //   const randomStrategy = outperformers[Math.round(Math.random() * (outperformers.length - 1))];
    //   if (d.developer.strategy.getName() === randomStrategy.developer.strategy.getName()) return;
    //   d.developer.strategy = randomStrategy.developer.strategy;
    //   changeCount += 1;
    // });

    // return changeCount === 0;
    return false;
  }

}
