const dateFormat = require('dateformat');
import { OpenAI } from 'openai';

const log = (level: string, ...args: any[]) =>
  console.log(`${dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss')} [${level}] `, ...args);

export const Logger = {
  info: (...args: any[]) => log('INFO', ...args),
  warn: (...args: any[]) => log('WARN', ...args),
  error: (...args: any[]) => log('ERROR', ...args),
}

const openai = new OpenAI({
  apiKey: process.env.ARK_KEY,
  baseURL: 'https://ark.cn-beijing.volces.com/api/v3',
});

export const chat = async (prompt: string, question: string): Promise<string> => {
  const result = await openai.chat.completions.create({
    model: 'deepseek-v3-241226',
    messages: [
      {
        role: 'system', content: prompt,
      },
      {
        role: 'user', content: question,
      }
    ],
  });
  const content = result.choices[0].message.content!;
  return content;
};
