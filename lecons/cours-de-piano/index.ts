import type { Folder } from '@/stores/appStore';
import { coursPiano001 } from './cours-001';

export const coursDePiano: Folder = {
  id: 'f5',
  name: 'Cours de Piano',
  description: 'Apprentissage complet du piano',
  thumbnail: 'https://images.pexels.com/photos/164743/pexels-photo-164743.jpeg?auto=compress&cs=tinysrgb&w=400',
  courseCount: 1,
  categoryId: '5',
  createdAt: new Date(),
  author: 'Prof. Marie Dubois',
  content: [coursPiano001],
};
