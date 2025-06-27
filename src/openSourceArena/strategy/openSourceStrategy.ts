import { BaseStrategy } from "../../core/strategy/baseStrategy";
import { randomPick } from "../../utils";
import { Comment } from "../entity/comment";
import { Developer } from "../entity/developer";
import { Repository } from "../entity/repository";
import { Thread } from "../entity/thread";
import { collaborativityRatio, getRandomValue } from "../entity/types";

export class OpenSourceStrategy extends BaseStrategy {

  public developer: Developer;

  public getName(): string {
    return `${this.developer.collaborativity} ${this.developer.motivation}`;
  }

  public getId(): number {
    return 0;
  }

  public async execute(developer: Developer, repository: Repository, round: number, _step: number): Promise<void> {
    let quota = developer.actionQuota;
    const threadsSet = new Set(repository.getOpenThreads());
    do {
      if (threadsSet.size === 0) {
        // no open threads, need to open a new one
        const thread = new Thread(
          repository.getThreads().length,
          developer,
          round,
          getRandomValue(developer.capability, developer.motivation)
        );
        repository.addThread(thread);
        quota -= thread.getCost();
      } else {
        // has open threads, need to determine to participant into a thread or open a new one
        const collaborateRatio = collaborativityRatio.get(developer.collaborativity)!;
        randomPick([
          {
            ratio: collaborateRatio,
            value: () => {
              // collaborate, comment a thread
              const thread = randomPick(Array.from(threadsSet).map(t => ({
                ratio: 1,
                value: t,
              })));
              const comment = new Comment(
                1,
                developer,
                round,
                getRandomValue(developer.capability, developer.motivation)
              );
              thread.addComment(comment);
              quota -= comment.getCost();
            }
          },
          {
            ratio: 100 - collaborateRatio,
            value: () => {
              // no collaborate, open a new thread
              const thread = new Thread(
                repository.getThreads().length,
                developer,
                round,
                getRandomValue(developer.capability, developer.motivation)
              );
              repository.addThread(thread);
              quota -= thread.getCost();
            }
          },
        ]);
      }
    } while (quota >= 0)
  }

}
