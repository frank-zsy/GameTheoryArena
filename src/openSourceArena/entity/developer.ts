import { BasePlayer } from '../../core/entity/basePlayer';
import { BaseStrategy } from '../../core/strategy/baseStrategy';
import { Logger } from '../../utils';
import { Issue } from './issue';
import { Comment } from './comment';
import { Repository } from './repository';
import { Capability, capabilityValueMap, Collaborativity, Difficulty, EntityValue, getRandomValue, Motivation } from './types';
import { PullRequest } from './pullRequest';

const ACTION_QUOTA_RATIO = 5;

export class Developer extends BasePlayer {

  public actionQuota: number;
  public capability: Capability;
  public baseCollaborativity: Collaborativity;
  public currentCollaborativity: Collaborativity;
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
    this.baseCollaborativity = 'NORMAL';
    this.currentCollaborativity = 'NORMAL';
    this.motivation = 'NORMAL';
  }

  public setCapability(c: Capability) {
    this.capability = c;
    this.actionQuota = capabilityValueMap.get(c)! * ACTION_QUOTA_RATIO;
  }

  public getLLMDescription(): string {
    return `  - Capability: ${this.capability}
  - Motivation: ${this.motivation}
  - Relationship with Authors: Strong with 2, Weak with 3, Moderate with 1
  - Collaborativity: ${this.currentCollaborativity}
    `;
  }

  public resetActionQuota() {
    this.actionQuota = capabilityValueMap.get(this.capability)! * 10;
  }

  public takeActions(actions: {
    action: string,
    difficulty: Difficulty,
    issue?: string,
    PR?: string,
  }[], repository: Repository, round: number) {
    for (const a of actions) {
      const action = a.action;
      if (!action) {
        throw new Error('Action not exist');
      }

      let value: EntityValue = 'NORMAL';
      if (action === 'open issue') {
        value = a.difficulty as EntityValue;
        repository.addIssue(new Issue(
          repository.getIssues().length,
          this,
          round,
          value,
          a.difficulty,
        ));
      } else if (action === 'issue comment') {
        const issue = repository.getIssues().find(i => i.id === +a.issue!.substring(1));
        if (!issue) {
          Logger.error(`Comment issue not found, issue id: ${a.issue}`);
          return;
        }
        value = getRandomValue(this.capability);
        issue.addComment(new Comment(0, this, round, value));
      } else if (action === 'open PR') {
        const issue = repository.getIssues().find(i => i.id === +a.issue!.substring(1));
        if (!issue) {
          Logger.error(`Resolve issue not found, issue id: ${a.issue}`);
          return;
        }
        issue.isClosed = true;
        value = issue.value;
        repository.addPullRequest(new PullRequest(
          repository.getPullRequests().length,
          this,
          round,
          issue.value,
        ));
      } else if (action === 'PR review') {
        const pr = repository.getIssues().find(i => i.id === +a.PR!.substring(1));
        if (!pr) {
          Logger.error(`Review PR not found, PR id: ${a.PR}`);
          return;
        }
        value = getRandomValue(this.capability);
        pr.addComment(new Comment(0, this, round, value));
      } else {
        Logger.error(`Action can not be recognized, action=${a.action}`);
      }
      this.actionQuota -= capabilityValueMap.get(value)!;
      if (this.actionQuota <= 0) {
        Logger.info('Break');
        break;
      }
    }
    this.resetActionQuota();
  }

}
