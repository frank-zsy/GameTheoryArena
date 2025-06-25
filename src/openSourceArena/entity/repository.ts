import { Issue } from './issue';
import { PullRequest } from './pullRequest';
import { Developer } from './developer';
import { BaseArena } from '../../core/entity/baseArena';
import { EOL } from 'os';

export class Repository extends BaseArena<Developer> {
  private issues: Issue[] = [];
  private pullRequests: PullRequest[] = [];

  constructor(
    public name: string
  ) {
    super(name);
  }

  public addIssue(issue: Issue): void {
    this.issues.push(issue);
  }

  public addPullRequest(pullRequest: PullRequest): void {
    this.pullRequests.push(pullRequest);
  }

  public getIssues(): Issue[] {
    return this.issues;
  }

  public getOpenIssues(): Issue[] {
    return this.issues.filter(i => !i.isClosed);
  }

  public getPullRequests(): PullRequest[] {
    return this.pullRequests;
  }

  public getOpenPullRequest(): PullRequest[] {
    return this.pullRequests.filter(p => !p.isClosed);
  }

  public getLLMDescription(): string {
    return `
- Issues:
${this.issues.filter(i => !i.isClosed).map(i => i.getLLMDescription()).join(EOL)}
- PRs:
${this.pullRequests.filter(i => !i.isClosed).map(i => i.getLLMDescription()).join(EOL)}
    `;
  }

}
