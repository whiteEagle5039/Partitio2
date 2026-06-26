import type { Folder } from '@/stores/appStore';
import { coursTrompette001 } from './cours-001';

export const coursDeTrompette: Folder = {
  id: 'f7',
  name: 'Cours de Trompette',
  description: 'Techniques de cuivre et respiration',
  thumbnail: 'https://images.pexels.com/photos/1246437/pexels-photo-1246437.jpeg?auto=compress&cs=tinysrgb&w=400',
  courseCount: 1,
  categoryId: '5',
  createdAt: new Date(),
  author: 'Pierre Trumpet',
  content: [coursTrompette001],
};
