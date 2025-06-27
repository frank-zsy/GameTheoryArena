import { BasePlayer } from '../../core/entity/basePlayer';
import { BaseStrategy } from '../../core/strategy/baseStrategy';
import { Capability, capabilityValueMap, Collaborativity, Motivation } from './types';

const ACTION_QUOTA_RATIO = 5;

export class Developer extends BasePlayer {

  public actionQuota: number;
  public capability: Capability;
  public collaborativity: Collaborativity;
  public relationships: Map<number, number>;
  public motivation: Motivation;

  constructor(
    public id: number,
    public name: string,
    public strategy: BaseStrategy
  ) {
    super(id, name, strategy);
    this.setCapability('NORMAL');
    this.relationships = new Map<number, number>();
    this.collaborativity = 'NORMAL';
    this.motivation = 'NORMAL';
  }

  public setCapability(c: Capability) {
    this.capability = c;
    this.actionQuota = capabilityValueMap.get(this.capability)! * ACTION_QUOTA_RATIO;
  }

  public getLLMDescription(): string {
    return `  - Capability: ${this.capability}
  - Motivation: ${this.motivation}
  - Relationship with Authors: Strong with 2, Weak with 3, Moderate with 1
  - Collaborativity: ${this.collaborativity}
    `;
  }

}
