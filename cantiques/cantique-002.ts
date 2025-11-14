import { Cantique } from '@/types/cantique';

const cantique002: Cantique = {
  id: 'cantique-002',
  number: 2,
  title: 'Louez Dieu dans son sanctuaire',
  composer: 'Georg Friedrich Händel',
  category: 'Adoration',
  tempo: '3/4',
  key: 'Sol',
  isPublic: true,
  createdAt: '2025-01-01T00:00:00.000Z',
  tags: ['adoration', 'psaume', 'majestueux'],
  sections: [
    {
      id: '1',
      name: 'Introduction',
      soprano: 'sol4 | la4 si4 | do5 si4 | la4 |',
      alto: 'mi4 | fa4 sol4 | la4 sol4 | fa4 |',
      tenor: 'do4 | re4 mi4 | fa4 mi4 | re4 |',
      bass: 'do3 | re3 mi3 | fa3 mi3 | re3 |',
      lyrics: 'Louez Dieu dans son sanctuaire,\nLouez-le dans l\'étendue céleste.'
    }
  ]
};
export { cantique002 };