import { BaseSimulator } from "../core/simulator/baseSimulator";
import { OpenSourceStrategyAdjuster } from "./strategyAdjuster/openSourceStrategyAdjuster";
import { Repository } from "./entity/repository";
import { SimpleCountEvaluator } from "./evaluator/simpleCountEvaluator";
import { Developer } from "./entity/developer";
import { OpenSourceStrategy } from "./strategy/openSourceStrategy";

import { writeFileSync } from "fs";
import { join } from "path";
import { Logger } from "../utils";
import { getRandomCapability, getRandomCollaborativity } from "./entity/types";

const strategiesArr: any[] = [];

export class Simulator extends BaseSimulator {

  constructor() {
    super('Open Source Arena', {
      maxRounds: 3,
      steps: 2,
    });
  }

  public async initialize(): Promise<void> {
    const dev1 = this.generateRandomDeveloper();
    dev1.setCapability('VERY_HIGH');
    dev1.motivation = 'NORMAL';
    dev1.baseCollaborativity = 'LOW';
    dev1.currentCollaborativity = 'LOW';
    this.arena.addPlayer(dev1);

    const dev2 = this.generateRandomDeveloper();
    dev2.setCapability('VERY_HIGH');
    dev1.motivation = 'NORMAL';
    dev2.baseCollaborativity = 'HIGH';
    dev2.currentCollaborativity = 'HIGH';
    this.arena.addPlayer(dev2);
  }

  private generateRandomDeveloper(): Developer {
    const developerId = this.arena.getPlayers().length;
    const s = new OpenSourceStrategy();
    const developer = new Developer(developerId, `Developer ${developerId}`, s);
    s.developer = developer;
    developer.setCapability(getRandomCapability());
    if (Math.random() < 0.1) {
      developer.motivation = 'SPECULATIVE';
    }
    developer.baseCollaborativity = getRandomCollaborativity();
    developer.currentCollaborativity = developer.baseCollaborativity;
    return developer;
  }

  public async preRound(_r: number): Promise<void> {
    strategiesArr.push((this.arena as Repository).getPlayers().map(p => p.strategy.getName()));
  }

  public async postRound(r: number): Promise<void> {
    Logger.info(`Repository stats after round ${r}:
      ${(this.arena as Repository).getLLMDescription()}`);
    this.arena.addPlayer(this.generateRandomDeveloper());
    if (Math.random() < 0.5) {
      this.arena.addPlayer(this.generateRandomDeveloper());
    }
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
