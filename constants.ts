// constants.ts
import { Domain } from './types.ts';
import { packData } from './data/pack.ts';
import { adaptPackToDomains } from './lib/packAdapter.ts';
import { applyPackEnhancements } from './data/packEnhancements.ts'; 

// Bump storage key version to avoid conflicts with old data structures.
export const STORAGE_KEY = 'sophia-playcheck-data-v2';

// Adapt the new pack data to the Domain[] structure the UI expects.

export const DOMAINS: Domain[] = adaptPackToDomains(
  applyPackEnhancements(packData) // <-- wrap here
);