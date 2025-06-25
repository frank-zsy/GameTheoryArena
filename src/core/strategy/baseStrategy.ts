import { BaseArena } from '../entity/baseArena';
import { BasePlayer } from '../entity/basePlayer';

export abstract class BaseStrategy {
  abstract execute(player: BasePlayer, arena: BaseArena<BasePlayer>, round: number, step: number): Promise<void>;
  abstract getName(): string;
  abstract getId(): number;

  protected logAction(player: BasePlayer, arena: BaseArena<BasePlayer>, action: string): void {
    console.log(`[${player.name}][${arena.name}] ${action}.`);
  }
}
