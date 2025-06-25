import { writeFileSync } from "fs";
import { BaseSimulator } from "../core/simulator/baseSimulator";
import { DefaultStrategyAdjuster } from "../core/strategyAdjuster/defaultStrategyAdjuster";
import { Arena } from "./arena";
import { Evaluator } from "./evaluator";
import { Player } from "./player";
import { AlwaysBetray, AlwaysCooperate, Random, TitForTat, TitForTatWithLastBetray } from "./strategies";
import { join } from "path";

const strategiesArr: any[] = [];
const PLAY_RATIO = 0.05;

export class Simulator extends BaseSimulator {

  constructor() {
    super('Prisoner\'s delimma arena', {
      maxRounds: 50,
      steps: 1,
    });
  }

  public async initialize(): Promise<void> {
    const strategies = new Map([
      [new AlwaysCooperate(PLAY_RATIO), 20],
      [new AlwaysBetray(PLAY_RATIO), 20],
      [new Random(PLAY_RATIO), 20],
      [new TitForTat(PLAY_RATIO), 20],
      [new TitForTatWithLastBetray(PLAY_RATIO), 20],
    ]);
    let i = 0;
    for (const [s, count] of strategies.entries()) {
      for (let j = 0; j < count; j++) {
        this.arena.addPlayer(new Player(i++, '', s));
      }
    }
  }

  public async preRound(_r: number): Promise<void> {
    (this.arena as Arena).getPlayers().forEach(p => p.clearSteps());
    strategiesArr.push((this.arena as Arena).getPlayers().map(p => p.strategy.getId()));
  }

  public async postRound(_r: number): Promise<void> { }

}

(async () => {

  while (1) {
    const simulator = new Simulator();
    strategiesArr.length = 0;

    simulator
      .setArena(new Arena("Prisoner's Delimma"))
      .setEvaluator(new Evaluator())
      .setStrategyAdjuster(new DefaultStrategyAdjuster());

    await simulator.start();

    writeFileSync(join(__dirname, 'data.js'), 'const data = ' + JSON.stringify(strategiesArr));

    // if (strategiesArr[strategiesArr.length - 1].includes(0))
    break;
  }

})();
