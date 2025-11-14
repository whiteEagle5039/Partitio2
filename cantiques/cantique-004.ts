import { Cantique } from '@/types/cantique';

const cantique004: Cantique = {
  id: 'cantique-004',
  number: 4,
  title: 'Toutes tes anxiétés',
  composer: 'JSML(01)',
  category: 'Réconfort',
  tempo: '3/4',
  key: 'Fa',
  isPublic: true,
  createdAt: '2025-01-01T00:00:00.000Z',
  tags: ['réconfort', 'paix', 'confiance'],
  sections: [
    {
      id: '1',
      name: 'Couplet',
      soprano: 'd:-.r:m|s:-:m|f:-.m|m:r:- |r:-.m:f |f:-:f |f:m:r |m:-:-. |d:-.r:m|s:-:m|f:-.m |m:r:-. |r:-.m:f,|f:-.m:r |m:d:r |d:-:- ',
      alto: '',
      tenor: 'd:-.d:d|d:-.d|t,:-:d |s,:s,:- |f:-.m:r |s,:r:-|s,:r:s, |d:-:- |m:-.r:d|d:-.d |d:r:m |f:f:- |f:-.m:r |r:-.m:r |s:s,:s, |d:-:- ',
      bass: '',
      lyrics: `1. Ton cœur est-il rempli de tristesse? Ta vie est-elle pleine de soucis? Viens à la croix avec tes fardeaux, Et déposes là toutes tes anxiétés.\n\n2. Point d'autre ami si prêt à t'aider, Et qui soit prompt à t'écouter; Point d'autre lieu pour laisser tes fardeaux; Nul autre pour exaucer ta prière.\n\n 3. Viens donc maintenant et ne tarde plus; Écoute Ses douces et tendres instances; Tu ne dois craindre aucune déception; Au trône de grâce, tu auras la paix.`
    },
    
    {
      id: '2',
      name: 'Refrain',
      soprano: '|m:-.r:d|m:-.r:d|f:-.m |r:-:- |f:-.m:r |f:-.m:r |s:-:f |m:-:-. |s:-.f:m|s:-.f:m |l:-:s |f:-:-. |m:-.r:d |f:-.m |r:-:- |d:-:-. |',
      alto: '',
      tenor: '|d:-.d:d|d:-.d:d|t,:-:d |s,:- |s,:r.s,:s, |s,:-.s,:s, |s,:l,:t, |d:-:- |m:-.r:d|m:-.r:d |r:-:m |f:-:- |s:-.f:m |r:r,:m, |f:s,:- |d:-:- |',
      bass: '',
      lyrics: `Toutes tes anxiétés et soucis, Amène et laisse-les au Trône de Grâce; Point de fardeau qu'il ne puisse porter, Point d'autre ami comme Jésus.`
    }
  ]
};

export { cantique004 };