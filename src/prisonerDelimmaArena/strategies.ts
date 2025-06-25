import { BaseStrategy } from "../core/strategy/baseStrategy";
import { Arena } from "./arena";
import { Player } from "./player";

export enum Step {
  COOPERATE,
  BETRAY,
};

export abstract class PrisonerDelimmaStrategy extends BaseStrategy {

  constructor(
    protected playRandomRatio: number = 0.1,
    protected playCountEachTime: number = 30,
  ) {
    super();
  }

  // Return the step to take according to other player's last step
  abstract getStep(s: Step | null, lastStep: boolean): Promise<Step>;

  public async execute(player: Player, arena: Arena): Promise<void> {
    const players = arena.getPlayers();

    const play = async (p1: Player, p2: Player) => {
      let step1: Step | null = null;
      let step2: Step | null = null;
      for (let s = 0; s < this.playCountEachTime; s++) {
        step1 = await (p1.strategy as PrisonerDelimmaStrategy).getStep(step2, s === this.playCountEachTime - 1);
        step2 = await (p2.strategy as PrisonerDelimmaStrategy).getStep(step1, s === this.playCountEachTime - 1);
        p1.steps.push({ self: step1, op: step2 });
        p2.steps.push({ self: step2, op: step1 });
      }
    };

    for (const p of players) {
      if (p.id === player.id) continue;
      if (Math.random() < this.playRandomRatio) {
        await play(player, p);
      }
    }
  }
}

export class AlwaysCooperate extends PrisonerDelimmaStrategy {

  public getName(): string {
    return 'Always Cooperate';
  }

  public getId(): number {
    return 0;
  }

  public async getStep(): Promise<Step> {
    return Step.COOPERATE;
  }

}

export class AlwaysBetray extends PrisonerDelimmaStrategy {

  public getName(): string {
    return 'Always Betray';
  }

  public getId(): number {
    return 1;
  }

  public async getStep(): Promise<Step> {
    return Step.BETRAY;
  }

}

export class Random extends PrisonerDelimmaStrategy {

  public getName(): string {
    return 'Random';
  }

  public getId(): number {
    return 2;
  }

  public async getStep(): Promise<Step> {
    if (Math.random() < 0.5) return Step.COOPERATE;
    return Step.BETRAY;
  }

}

export class TitForTat extends PrisonerDelimmaStrategy {

  public getName(): string {
    return 'TitForTat';
  }

  public getId(): number {
    return 3;
  }

  public async getStep(s: Step | null): Promise<Step> {
    if (!s) return Step.COOPERATE;
    return s;
  }

}

export class TitForTatWithLastBetray extends PrisonerDelimmaStrategy {

  public getName(): string {
    return 'TitForTat With Last Betray';
  }

  public getId(): number {
    return 4;
  }

  public async getStep(s: Step | null, lastStep: boolean): Promise<Step> {
    if (lastStep) return Step.BETRAY;
    if (!s) return Step.COOPERATE;
    return s;
  }

}
