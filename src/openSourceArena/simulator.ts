import { BaseSimulator } from "../core/simulator/baseSimulator";
import { OpenSourceStrategyAdjuster } from "./strategyAdjuster/openSourceStrategyAdjuster";
import { Repository } from "./entity/repository";
import { SimpleCountEvaluator } from "./evaluator/simpleCountEvaluator";
import { Developer } from "./entity/developer";
import { OpenSourceStrategy } from "./strategy/openSourceStrategy";

import { writeFileSync } from "fs";
import { join } from "path";
import { Collaborativity, getRandomCapability, getRandomCollaborativity, getRandomMotivation } from "./entity/types";
import { Logger } from "../utils";

const strategiesArr: any[] = [];

export class Simulator extends BaseSimulator<Developer, Repository> {

  constructor() {
    super('Open Source Arena', {
      maxRounds: 6,
      steps: 4,
    });
  }

  public async initialize(): Promise<void> {
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
    strategiesArr.push((this.arena as Repository).getPlayers().map(p => p.strategy.getName()));
  }

  public async postRound(_r: number): Promise<void> {
    Logger.info(this.arena.getDescription());
  }

}

(async () => {

  const simulator = new Simulator();

  simulator
    .setArena(new Repository('Open Source Repo'))
    .setEvaluator(new SimpleCountEvaluator())
    .setStrategyAdjuster(new OpenSourceStrategyAdjuster());

  await simulator.start();

  writeFileSync(join(__dirname, 'data.js'), 'const data = ' + JSON.stringify(strategiesArr));

})();
