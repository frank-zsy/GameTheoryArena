export type Difficulty = 'VERY_EASY' | 'EASY' | 'NORMAL' | 'HARD' | 'VERY_HARD';

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

export const getRandomValue = (capability: Capability): EntityValue => {
  const capabilities = ['VERY_LOW', 'LOW', 'NORMAL', 'HIGH', 'VERY_HIGH'];
  const index = capabilities.findIndex(c => c === capability);
  const i = Math.floor(Math.random() * index);
  return capabilities[i] as EntityValue;
};

export const getRandomCapability = (): Capability => {
  const capabilities: Capability[] = ['VERY_LOW', 'LOW', 'NORMAL', 'HIGH', 'VERY_HIGH'];
  const ratios = [20, 65, 80, 90, 100];
  const rand = Math.random() * 100;
  for (let i = 0; i < ratios.length; i++) {
    const thredhold = ratios[i];
    if (rand < thredhold) {
      return capabilities[i];
    }
  }
  return 'VERY_LOW';
}

export const getRandomCollaborativity = (): Collaborativity => {
  const collaborativities: Collaborativity[] = ['VERY_LOW', 'LOW', 'NORMAL', 'HIGH', 'VERY_HIGH'];
  const ratios = [10, 30, 70, 90, 100];
  const rand = Math.random() * 100;
  for (let i = 0; i < ratios.length; i++) {
    const thredhold = ratios[i];
    if (rand < thredhold) {
      return collaborativities[i];
    }
  }
  return 'VERY_LOW';
}
