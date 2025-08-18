import { create } from 'zustand';

// Types
export interface SheetMusic {
  id: string;
  title: string;
  composer: string;
  genre: string;
  thumbnail: string;
  downloadUrl?: string;
  isDownloaded: boolean;
  dateAdded: Date;
  fileSize?: number;
  description?: string;
}

export interface UserComposition {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  lastModified: Date;
  isPublic: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  storageUsed: number;
  storageLimit: number;
}

// Nouvelle structure hiérarchique
export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  isDownloaded: boolean;
  dateAdded: Date;
  fileSize?: number;
  composer?: string;
}

export interface Folder {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  courseCount: number;
  courses: Course[];
  categoryId: string;
  createdAt: Date;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  folderCount: number;
  totalCourses: number;
  folders: Folder[];
}

// Store principal
interface AppState {
  // User & Authentication
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
  setAuthenticated: (authenticated: boolean) => void;
  
  // Connection Status
  isOnline: boolean;
  setOnline: (online: boolean) => void;
  
  // Nouvelle structure hiérarchique
  categories: Category[];
  currentCategory: Category | null;
  currentFolder: Folder | null;
  setCurrentCategory: (category: Category | null) => void;
  setCurrentFolder: (folder: Folder | null) => void;
  
  // Navigation state
  navigationLevel: 'categories' | 'folders' | 'courses';
  setNavigationLevel: (level: 'categories' | 'folders' | 'courses') => void;
  
  // Partitions (conservées pour compatibilité)
  sheetMusic: SheetMusic[];
  downloadedSheets: SheetMusic[];
  addSheetMusic: (sheet: SheetMusic) => void;
  downloadSheet: (sheetId: string) => void;
  removeDownload: (sheetId: string) => void;
  
  // Course actions
  downloadCourse: (courseId: string, folderId: string) => void;
  
  // Compositions
  compositions: UserComposition[];
  addComposition: (composition: UserComposition) => void;
  updateComposition: (id: string, updates: Partial<UserComposition>) => void;
  deleteComposition: (id: string) => void;
  
  // UI State
  isDrawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
  isDrawerOpene: boolean;
  setDrawerOpene: (open: boolean) => void;
  
  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchFilters: {
    genre: string;
    composer: string;
  };
  setSearchFilters: (filters: Partial<AppState['searchFilters']>) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // User & Authentication
  user: {
    id: '1',
    name: 'Owen',
    email: 'user@partitio.com',
    storageUsed: 25.2,
    storageLimit: 100,
  },
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  isAuthenticated: true,
  setAuthenticated: (authenticated) => set({ isAuthenticated: authenticated }),
  
  // Connection Status
  isOnline: false,
  setOnline: (online) => set({ isOnline: online }),
  
  // Nouvelle structure hiérarchique
  categories: [
    {
      id: '1',
      name: 'Tous',
      description: 'Toutes les catégories disponibles',
      icon: 'Library',
      color: '#8B5CF6',
      folderCount: 0,
      totalCourses: 0,
      folders: []
    },
    {
      id: '2',
      name: 'Cantiques',
      description: 'Partitions de cantiques et hymnes',
      icon: 'Music',
      color: '#10B981',
      folderCount: 2,
      totalCourses: 8,
      folders: [
        {
          id: 'f1',
          name: 'Cantiques Classiques',
          description: 'Collection des cantiques traditionnels',
          thumbnail: 'https://images.pexels.com/photos/164743/pexels-photo-164743.jpeg?auto=compress&cs=tinysrgb&w=400',
          courseCount: 5,
          categoryId: '2',
          createdAt: new Date(),
          courses: [
            {
              id: 'c1',
              title: 'Amazing Grace',
              description: 'Partition complète avec variations',
              thumbnail: 'https://images.pexels.com/photos/164743/pexels-photo-164743.jpeg?auto=compress&cs=tinysrgb&w=400',
              isDownloaded: true,
              dateAdded: new Date(),
              fileSize: 2.4,
              composer: 'John Newton'
            },
            {
              id: 'c2',
              title: 'How Great Thou Art',
              description: 'Arrangement pour piano solo',
              thumbnail: 'https://images.pexels.com/photos/1407322/pexels-photo-1407322.jpeg?auto=compress&cs=tinysrgb&w=400',
              isDownloaded: false,
              dateAdded: new Date(),
              fileSize: 1.8,
              composer: 'Carl Boberg'
            }
          ]
        },
        {
          id: 'f2',
          name: 'Cantiques Modernes',
          description: 'Cantiques contemporains et louange',
          thumbnail: 'https://images.pexels.com/photos/1246437/pexels-photo-1246437.jpeg?auto=compress&cs=tinysrgb&w=400',
          courseCount: 3,
          categoryId: '2',
          createdAt: new Date(),
          courses: [
            {
              id: 'c3',
              title: '10,000 Reasons',
              description: 'Partition moderne avec accords',
              thumbnail: 'https://images.pexels.com/photos/1246437/pexels-photo-1246437.jpeg?auto=compress&cs=tinysrgb&w=400',
              isDownloaded: true,
              dateAdded: new Date(),
              fileSize: 3.1,
              composer: 'Matt Redman'
            }
          ]
        }
      ]
    },
    {
      id: '3',
      name: 'Mes compositions',
      description: 'Vos créations personnelles',
      icon: 'Edit3',
      color: '#F59E0B',
      folderCount: 1,
      totalCourses: 3,
      folders: [
        {
          id: 'f3',
          name: 'Compositions 2024',
          description: 'Mes créations de cette année',
          thumbnail: 'https://images.pexels.com/photos/1407322/pexels-photo-1407322.jpeg?auto=compress&cs=tinysrgb&w=400',
          courseCount: 3,
          categoryId: '3',
          createdAt: new Date(),
          courses: [
            {
              id: 'c4',
              title: 'Ma première composition',
              description: 'Mélodie originale en Do majeur',
              thumbnail: 'https://images.pexels.com/photos/164743/pexels-photo-164743.jpeg?auto=compress&cs=tinysrgb&w=400',
              isDownloaded: true,
              dateAdded: new Date(),
              fileSize: 1.2
            }
          ]
        }
      ]
    },
    {
      id: '4',
      name: 'Chorale',
      description: 'Arrangements pour chœur',
      icon: 'Users',
      color: '#EF4444',
      folderCount: 1,
      totalCourses: 4,
      folders: [
        {
          id: 'f4',
          name: 'Arrangements SATB',
          description: 'Partitions pour chœur à 4 voix',
          thumbnail: 'https://images.pexels.com/photos/1246437/pexels-photo-1246437.jpeg?auto=compress&cs=tinysrgb&w=400',
          courseCount: 4,
          categoryId: '4',
          createdAt: new Date(),
          courses: []
        }
      ]
    },
    {
      id: '5',
      name: 'Leçons',
      description: 'Cours et tutoriels',
      icon: 'BookOpen',
      color: '#3B82F6',
      folderCount: 3,
      totalCourses: 15,
      folders: [
        {
          id: 'f5',
          name: 'Cours de Piano',
          description: 'Apprentissage complet du piano',
          thumbnail: 'https://images.pexels.com/photos/164743/pexels-photo-164743.jpeg?auto=compress&cs=tinysrgb&w=400',
          courseCount: 8,
          categoryId: '5',
          createdAt: new Date(),
          courses: [
            {
              id: 'c5',
              title: 'Introduction au Piano',
              description: 'Premiers pas et posture',
              thumbnail: 'https://images.pexels.com/photos/164743/pexels-photo-164743.jpeg?auto=compress&cs=tinysrgb&w=400',
              isDownloaded: false,
              dateAdded: new Date(),
              fileSize: 5.2
            },
            {
              id: 'c6',
              title: 'Les Accords de Base',
              description: 'Majeurs, mineurs et septième',
              thumbnail: 'https://images.pexels.com/photos/1407322/pexels-photo-1407322.jpeg?auto=compress&cs=tinysrgb&w=400',
              isDownloaded: true,
              dateAdded: new Date(),
              fileSize: 8.7
            },
            {
              id: 'c7',
              title: 'Exercices Pratiques',
              description: 'Gammes et arpèges',
              thumbnail: 'https://images.pexels.com/photos/1246437/pexels-photo-1246437.jpeg?auto=compress&cs=tinysrgb&w=400',
              isDownloaded: false,
              dateAdded: new Date(),
              fileSize: 4.3
            }
          ]
        },
        {
          id: 'f6',
          name: 'Cours de Guitare',
          description: 'Techniques de guitare acoustique',
          thumbnail: 'https://images.pexels.com/photos/1407322/pexels-photo-1407322.jpeg?auto=compress&cs=tinysrgb&w=400',
          courseCount: 4,
          categoryId: '5',
          createdAt: new Date(),
          courses: [
            {
              id: 'c8',
              title: 'Accords Ouverts',
              description: 'Les accords de base en position ouverte',
              thumbnail: 'https://images.pexels.com/photos/1407322/pexels-photo-1407322.jpeg?auto=compress&cs=tinysrgb&w=400',
              isDownloaded: true,
              dateAdded: new Date(),
              fileSize: 3.8
            }
          ]
        },
        {
          id: 'f7',
          name: 'Cours de Trompette',
          description: 'Techniques de cuivre et respiration',
          thumbnail: 'https://images.pexels.com/photos/1246437/pexels-photo-1246437.jpeg?auto=compress&cs=tinysrgb&w=400',
          courseCount: 3,
          categoryId: '5',
          createdAt: new Date(),
          courses: [
            {
              id: 'c9',
              title: 'Embouchure et Respiration',
              description: 'Fondamentaux de la trompette',
              thumbnail: 'https://images.pexels.com/photos/1246437/pexels-photo-1246437.jpeg?auto=compress&cs=tinysrgb&w=400',
              isDownloaded: false,
              dateAdded: new Date(),
              fileSize: 6.1
            }
          ]
        }
      ]
    }
  ],
  
  currentCategory: null,
  currentFolder: null,
  navigationLevel: 'categories',
  
  setCurrentCategory: (category) => set({ 
    currentCategory: category,
    currentFolder: null,
    navigationLevel: category ? 'folders' : 'categories'
  }),
  
  setCurrentFolder: (folder) => set({ 
    currentFolder: folder,
    navigationLevel: folder ? 'courses' : 'folders'
  }),
  
  setNavigationLevel: (level) => set({ navigationLevel: level }),
  
  // Course actions
  downloadCourse: (courseId, folderId) => set((state) => ({
    categories: state.categories.map(cat => ({
      ...cat,
      folders: cat.folders.map(folder => 
        folder.id === folderId 
          ? {
              ...folder,
              courses: folder.courses.map(course =>
                course.id === courseId 
                  ? { ...course, isDownloaded: true }
                  : course
              )
            }
          : folder
      )
    }))
  })),
  
  // Partitions (conservées pour compatibilité)
  sheetMusic: [
    {
      id: '1',
      title: 'Clair de Lune',
      composer: 'Claude Debussy',
      genre: 'Classique',
      thumbnail: 'https://images.pexels.com/photos/164743/pexels-photo-164743.jpeg?auto=compress&cs=tinysrgb&w=400',
      isDownloaded: true,
      dateAdded: new Date(),
      fileSize: 2.4,
    }
  ],
  downloadedSheets: [],
  addSheetMusic: (sheet) => set((state) => ({ 
    sheetMusic: [...state.sheetMusic, sheet] 
  })),
  downloadSheet: (sheetId) => set((state) => ({
    sheetMusic: state.sheetMusic.map(sheet => 
      sheet.id === sheetId ? { ...sheet, isDownloaded: true } : sheet
    ),
    downloadedSheets: [
      ...state.downloadedSheets,
      state.sheetMusic.find(s => s.id === sheetId)!
    ]
  })),
  removeDownload: (sheetId) => set((state) => ({
    sheetMusic: state.sheetMusic.map(sheet => 
      sheet.id === sheetId ? { ...sheet, isDownloaded: false } : sheet
    ),
    downloadedSheets: state.downloadedSheets.filter(s => s.id !== sheetId)
  })),
  
  // Compositions
  compositions: [
    {
      id: '1',
      title: 'Ma première composition',
      content: 'C G Am F',
      createdAt: new Date(),
      lastModified: new Date(),
      isPublic: false,
    }
  ],
  addComposition: (composition) => set((state) => ({ 
    compositions: [...state.compositions, composition] 
  })),
  updateComposition: (id, updates) => set((state) => ({
    compositions: state.compositions.map(comp => 
      comp.id === id ? { ...comp, ...updates, lastModified: new Date() } : comp
    )
  })),
  deleteComposition: (id) => set((state) => ({
    compositions: state.compositions.filter(comp => comp.id !== id)
  })),
  
  // UI State
  isDrawerOpen: false,
  setDrawerOpen: (open) => set({ isDrawerOpen: open }),
  isDrawerOpene: false,
  setDrawerOpene: (open) => set({ isDrawerOpene: open }),
  
  // Search
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
  searchFilters: {
    genre: '',
    composer: '',
  },
  setSearchFilters: (filters) => set((state) => ({
    searchFilters: { ...state.searchFilters, ...filters }
  })),
}));