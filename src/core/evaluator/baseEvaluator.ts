import { BaseArena } from '../entity/baseArena';
import { BasePlayer } from '../entity/basePlayer';

export abstract class BaseEvaluator {

  abstract evaluate(arena: BaseArena<BasePlayer>, round: number): Promise<void>;

}
