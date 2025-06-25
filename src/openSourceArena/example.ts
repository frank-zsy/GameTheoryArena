import { Repository } from './entity/repository';
import { Developer } from './entity/developer';
import { Issue } from './entity/issue';
import { Comment } from './entity/comment';
import { PassiveStrategy } from '../core/strategy/passiveStrategy';
import { PullRequest } from './entity/pullRequest';

// create repo
const repo = new Repository('GameTheoryArena');

// create developers
const dev1 = new Developer(repo.getPlayers().length, 'Alice', new PassiveStrategy());
const dev2 = new Developer(repo.getPlayers().length, 'Bob', new PassiveStrategy());

// add developers to repo
repo.addPlayer(dev1);
repo.addPlayer(dev2);

// open issue
const issue = new Issue(1, dev1, 0, 'HIGH', 'NORMAL');
repo.addIssue(issue);

// add comment
issue.addComment(new Comment(1, dev2, 0, 'LOW'));

// open pr
const pr = new PullRequest(2, dev1, 1, 'VERY_HIGH');
repo.addPullRequest(pr);

// add review comment
pr.addReviewComment(new Comment(2, dev2, 1, 'HIGH'));

// check repo status
console.log('Open Issues:', repo.getIssues().length);
console.log('Developers:', repo.getPlayers().length);
console.log('Issue Comments:', issue.getComments().length);
console.log('PR Review Comments:', pr.getReviewComments().length);
