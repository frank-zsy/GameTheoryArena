import { BaseEvaluator } from "../core/evaluator/baseEvaluator";
import { Arena } from "./arena";
import { Step } from "./strategies";

export class Evaluator extends BaseEvaluator {

  public async evaluate(arena: Arena, round: number): Promise<void> {
    const players = arena.getPlayers();

    for (const p of players) {
      let score = 0;
      for (const s of p.steps) {
        if (s.self === Step.COOPERATE && s.op === Step.COOPERATE) {
          score += 3;
        } else if (s.self === Step.BETRAY && s.op === Step.COOPERATE) {
          score += 5;
        } else if (s.self === Step.BETRAY && s.op === Step.BETRAY) {
          score += 1;
        }
      }
      p.performance.set(round, score / p.steps.length);
    }
  }

}
