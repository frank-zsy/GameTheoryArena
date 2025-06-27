const dateFormat = require('dateformat');

const log = (level: string, ...args: any[]) =>
  console.log(`${dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss')} [${level}] `, ...args);

export const Logger = {
  info: (...args: any[]) => log('INFO', ...args),
  warn: (...args: any[]) => log('WARN', ...args),
  error: (...args: any[]) => log('ERROR', ...args),
}

interface RandomPickArg<T> {
  ratio: number;
  value: T | (() => T);
}

export const randomPick = <T>(args: Array<RandomPickArg<T>>): T => {
  const totalRatio = args.map(a => a.ratio).reduce((p, c) => p + c, 0);
  const ratioArr: number[] = [];
  for (let i = 0; i < args.length - 1; i++)
    ratioArr.push((i === 0 ? 0 : ratioArr[i - 1]) + (args[i].ratio * 100 / totalRatio));
  const rand = Math.random() * 100;
  for (let i = 0; i < ratioArr.length; i++) {
    const thredhold = ratioArr[i];
    if (rand < thredhold) {
      if (typeof args[i].value === 'function') {
        return (args[i].value as () => T)();
      } else {
        return args[i].value as T;
      }
    }
  }
  if (typeof args[args.length - 1].value === 'function') {
    return (args[args.length - 1].value as () => T)();
  } else {
    return args[args.length - 1].value as T;
  }
}
