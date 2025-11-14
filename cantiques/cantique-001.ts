import { Cantique } from '@/types/cantique';

const cantique001: Cantique = {
  id: 'cantique-001',
  number: 1,
  title: 'Ô Jésus, ma joie',
  composer: 'Johann Crüger',
  category: 'Louange',
  tempo: '4/4',
  key: 'Do',
  isPublic: true,
  createdAt: '05-01-01T00:00:00.000Z',
  sections: [
    {
      id: '1',
      name: 'Couplet 1',
      soprano: 'do | re:-:mi | fa sol | la sol fa | mi |',
      alto: 'la | si do | re mi | fa mi re | do |',
      tenor: 'fa | sol la | si do | re do si | la |',
      bass: 'fa | sol la | si do | re do si | la |',
      lyrics: 'Ô Jésus, ma joie,\nMon trésor, ma gloire,\nTu es ma victoire,\nMon soutien, ma loi.'
    },
    {
      id: '',
      name: 'Couplet ',
      soprano: 'do | re mi | fa sol | la sol fa | mi |',
      alto: 'la | si do | re mi | fa mi re | do |',
      tenor: 'fa | sol la | si do | re do si | la |',
      bass: 'fa | sol la | si do | re do si | la |',
      lyrics: 'En toi seul je mets\nMa confiance entière,\nTu es ma lumière,\nMon divin palais.'
    }
  ]
};
export { cantique001 };