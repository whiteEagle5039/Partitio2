// cantiques/index.ts
import { Cantique } from '@/types/cantique';
import { cantique001 } from './cantique-001';
import { cantique002 } from './cantique-002';
import { cantique003 } from './cantique-003';
import { cantique004 } from './cantique-004';


// Export de tous les cantiques
export const cantiquesLibrary: Cantique[] = [
  cantique001,
  cantique002,
  cantique003,
  cantique004,
];

// Export individuel si nécessaire
export {
  cantique001,
  cantique002,
  cantique003,
  cantique004,
};