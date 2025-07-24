import { randomPick } from "../../utils/utils";

export type EntityValue = 'NEGATIVE' | 'VERY_LOW' | 'LOW' | 'NORMAL' | 'HIGH' | 'VERY_HIGH';

export type Capability = 'VERY_LOW' | 'LOW' | 'NORMAL' | 'HIGH' | 'VERY_HIGH';

export type Collaborativity = 'VERY_LOW' | 'LOW' | 'NORMAL' | 'HIGH' | 'VERY_HIGH';

export type Motivation = 'NORMAL' | 'SPECULATIVE';

export const capabilityValueMap = new Map<Capability | EntityValue, number>([
  ['NEGATIVE', -1],
  ['VERY_LOW', 1],
  ['LOW', 2],
  ['NORMAL', 3],
  ['HIGH', 4],
  ['VERY_HIGH', 5],
]);

export const collaborativityRatio = new Map<Collaborativity, number>([
  ['VERY_LOW', 10],
  ['LOW', 30],
  ['NORMAL', 50],
  ['HIGH', 70],
  ['VERY_HIGH', 90],
]);

export const getRandomValue = (_capability: Capability, motivation: Motivation): EntityValue => {
  if (motivation === 'SPECULATIVE') return 'NEGATIVE';
  return randomPick<EntityValue>([
    { value: 'VERY_LOW', ratio: 1 },
    { value: 'LOW', ratio: 1 },
    { value: 'NORMAL', ratio: 1 },
    { value: 'HIGH', ratio: 1 },
    { value: 'VERY_HIGH', ratio: 1 },
  ]);
};

export const getRandomCapability = (): Capability => {
  return randomPick<Capability>([
    { value: 'VERY_LOW', ratio: 20 },
    { value: 'LOW', ratio: 25 },
    { value: 'NORMAL', ratio: 30 },
    { value: 'HIGH', ratio: 15 },
    { value: 'VERY_HIGH', ratio: 10 },
  ]);
};

export const getRandomCollaborativity = (): Collaborativity => {
  return randomPick<Collaborativity>([
    { value: 'VERY_LOW', ratio: 10 },
    { value: 'LOW', ratio: 20 },
    { value: 'NORMAL', ratio: 40 },
    { value: 'HIGH', ratio: 20 },
    { value: 'VERY_HIGH', ratio: 10 },
  ]);
};

export const getRandomMotivation = (): Motivation => {
  return randomPick<Motivation>([
    { value: 'NORMAL', ratio: 90 },
    { value: 'SPECULATIVE', ratio: 10 },
  ]);
};

export const collaborativityCompatible = (c1: Collaborativity, c2: Collaborativity): boolean => {
  const compatibleMap = new Map<Collaborativity, Set<Collaborativity>>([
    ['VERY_LOW', new Set(['VERY_LOW', 'LOW'])],
    ['LOW', new Set(['VERY_LOW', 'LOW', 'NORMAL'])],
    ['NORMAL', new Set(['LOW', 'NORMAL', 'HIGH'])],
    ['HIGH', new Set(['NORMAL', 'HIGH', 'VERY_HIGH'])],
    ['VERY_HIGH', new Set(['HIGH', 'VERY_HIGH'])],
  ]);
  return compatibleMap.get(c1)?.has(c2) ?? false;
}
