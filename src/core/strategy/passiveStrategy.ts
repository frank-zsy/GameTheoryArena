import { BaseStrategy } from './baseStrategy';
import { BaseArena } from '../entity/baseArena';
import { BasePlayer } from '../entity/basePlayer';

export class PassiveStrategy extends BaseStrategy {

  public getName(): string {
    return 'Passive Strategy';
  }

  public getId(): number {
    return 0;
  }

  public async execute(player: BasePlayer, arena: BaseArena<BasePlayer>): Promise<void> {
    this.logAction(player, arena, 'is passive and does nothing');
  }

}
