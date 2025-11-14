import { Cantique } from '@/types/cantique';

const cantique003: Cantique = {
  id: 'cantique-003',
  number: 3,
  title: 'Quel ami fidèle et tendre',
  composer: 'Charles C. Converse',
  category: 'Confiance',
  tempo: '4/4',
  key: 'Fa',
  isPublic: true,
  createdAt: '2025-01-01T00:00:00.000Z',
  tags: ['prière', 'confiance', 'réconfort'],
  sections: [
    {
      id: '1',
      name: 'Refrain',
      soprano: 'fa4 | sol4 la4 | sib4 la4 | sol4 fa4 |',
      alto: 're4 | mi4 fa4 | sol4 fa4 | mi4 re4 |',
      tenor: 'la3 | sib3 do4 | re4 do4 | sib3 la3 |',
      bass: 're3 | sol3 fa3 | sib2 fa3 | do3 re3 |',
      lyrics: 'Quel ami fidèle et tendre\nNous avons en Jésus-Christ,\nToujours prêt à nous entendre,\nÀ répondre à notre cri !'
    }
  ]
};

export { cantique003 };