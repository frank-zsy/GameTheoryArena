import { Thread } from './thread';
import { Developer } from './developer';
import { BaseArena } from '../../core/entity/baseArena';

export class Repository extends BaseArena<Developer> {
  private threads: Thread[] = [];

  constructor(
    public name: string
  ) {
    super(name);
  }

  public addThread(issue: Thread): void {
    this.threads.push(issue);
  }


  public getThreads(): Thread[] {
    return this.threads;
  }

  public getOpenThreads(): Thread[] {
    return this.threads.filter(i => !i.isClosed);
  }

  public getDescription(): string {
    return `
- Threads: ${this.threads.filter(i => !i.isClosed).length} / ${this.threads.length}
    `;
  }

}
