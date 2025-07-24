import { BaseSimulator } from "../core/simulator/baseSimulator";
import { OpenSourceStrategyAdjuster } from "./strategyAdjuster/openSourceStrategyAdjuster";
import { Repository } from "./entity/repository";
import { Developer } from "./entity/developer";
import { OpenSourceStrategy } from "./strategy/openSourceStrategy";

import { writeFileSync } from "fs";
import { join } from "path";
import { Collaborativity, getRandomCapability, getRandomCollaborativity, getRandomMotivation, Motivation } from "./entity/types";
import { Logger } from "../utils/utils";
import { OpenRankEvaluator } from "./evaluator/openrankEvaluator";

const strategiesArr: any[] = [];

export class Simulator extends BaseSimulator<Developer, Repository> {

  constructor() {
    super('Open Source Arena', {
      maxRounds: 24,
      steps: 4,
    });
  }

  public async initialize(): Promise<void> {
    if (this.initialized === true) return;
    const collaborativity: Collaborativity[] = ['VERY_LOW', 'LOW', 'NORMAL', 'HIGH', 'VERY_HIGH'];
    // add 5 core maintainers
    for (let i = 0; i < 5; i++) {
      const dev = this.generateRandomDeveloper();
      dev.setCapability('VERY_HIGH');
      dev.collaborativity = collaborativity[i];
      dev.motivation = 'NORMAL';
      this.arena.addPlayer(dev);
    }
    // add 95 other developers
    for (let i = 0; i < 95; i++) {
      const dev = this.generateRandomDeveloper();
      this.arena.addPlayer(dev);
    }
    this.initialized = true;
  }

  private generateRandomDeveloper(): Developer {
    const developerId = this.arena.getPlayers().length;
    const s = new OpenSourceStrategy();
    const developer = new Developer(developerId, `Developer ${developerId}`, s);
    s.developer = developer;
    developer.setCapability(getRandomCapability());
    developer.collaborativity = getRandomCollaborativity();
    developer.motivation = getRandomMotivation();
    return developer;
  }

  public async preRound(_r: number): Promise<void> {
    // strategiesArr.push((this.arena as Repository).getPlayers().map(p => p.strategy.getName()));
  }

  public async postRound(_r: number): Promise<void> {
    // Logger.info(this.arena.getDescription());
  }

  public getRepository(): Repository {
    return this.arena;
  }

}

(async () => {

  const initialStrategyMap = new Map<Collaborativity, number>();
  const strategyMap = new Map<Collaborativity, number>();
  const motivationMap = new Map<Motivation, number>();
  let totalThreads = 0, totalClosedThreads = 0;

  for (let i = 0; i < 100; i++) {
    const simulator = new Simulator();

    simulator
      .setArena(new Repository('Open Source Repo'))
      .setEvaluator(new OpenRankEvaluator({
        useEntityValue: false,
        useReaction: true,
      }))
      .setStrategyAdjuster(new OpenSourceStrategyAdjuster());

    await simulator.initialize();

    simulator.getRepository().getPlayers().forEach(d => {
      initialStrategyMap.set(d.collaborativity, (initialStrategyMap.get(d.collaborativity) ?? 0) + 1);
    });

    await simulator.start();

    simulator.getRepository().getPlayers().forEach(d => {
      strategyMap.set(d.collaborativity, (strategyMap.get(d.collaborativity) ?? 0) + 1);
      motivationMap.set(d.motivation, (motivationMap.get(d.motivation) ?? 0) + 1);
    });
    const threads = simulator.getRepository().getThreads();
    totalThreads += threads.length;
    totalClosedThreads += threads.filter(t => t.isClosed).length;
    Logger.info(`Round ${i} finished.`);
  }
  writeFileSync(join(__dirname, 'data.js'), 'const data = ' + JSON.stringify(strategiesArr));

  console.table(Array.from(initialStrategyMap));
  console.table(Array.from(strategyMap));
  console.table(Array.from(motivationMap));
  console.log(`${totalClosedThreads}/${totalThreads} = ${(totalClosedThreads * 100 / totalThreads).toFixed(2)}%`);

})();
