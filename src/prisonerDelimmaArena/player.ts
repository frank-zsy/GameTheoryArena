import { BasePlayer } from "../core/entity/basePlayer";
import { Step } from "./strategies";

export class Player extends BasePlayer {

  public steps: { self: Step, op: Step }[] = [];

  public clearSteps() {
    this.steps.length = 0;
  }

}
