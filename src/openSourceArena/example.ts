import { Repository } from './entity/repository';
import { Developer } from './entity/developer';
import { Thread } from './entity/thread';
import { Comment } from './entity/comment';
import { PassiveStrategy } from '../core/strategy/passiveStrategy';

// create repo
const repo = new Repository('GameTheoryArena');

// create developers
const dev1 = new Developer(repo.getPlayers().length, 'Alice', new PassiveStrategy());
const dev2 = new Developer(repo.getPlayers().length, 'Bob', new PassiveStrategy());

// add developers to repo
repo.addPlayer(dev1);
repo.addPlayer(dev2);

// open issue
const thread = new Thread(1, dev1, 0, 'HIGH');
repo.addThread(thread);

// add comment
thread.addComment(new Comment(1, dev2, 0, 'LOW'));

// check repo status
console.log('Open Threads:', repo.getThreads().length);
console.log('Developers:', repo.getPlayers().length);
console.log('Thread Comments:', thread.getComments().length);
