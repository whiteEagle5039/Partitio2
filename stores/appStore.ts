import { create } from 'zustand';

// Types
export interface SheetMusic {
  id: string;
  title: string;
  composer: string;
  genre: string;
  difficulty: 'Débutant' | 'Intermédiaire' | 'Avancé';
  thumbnail: string;
  downloadUrl?: string;
  isDownloaded: boolean;
  dateAdded: Date;
  fileSize?: number;
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

// Store principal
interface AppState {
  // User
  user: User | null;
  setUser: (user: User) => void;
  
  // Partitions
  sheetMusic: SheetMusic[];
  downloadedSheets: SheetMusic[];
  addSheetMusic: (sheet: SheetMusic) => void;
  downloadSheet: (sheetId: string) => void;
  removeDownload: (sheetId: string) => void;
  
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
    difficulty: string;
    composer: string;
  };
  setSearchFilters: (filters: Partial<AppState['searchFilters']>) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // User
  user: {
    id: '1',
    name: 'Utilisateur',
    email: 'user@partitio.com',
    storageUsed: 25.2,
    storageLimit: 100,
  },
  setUser: (user) => set({ user }),
  
  // Partitions
  sheetMusic: [
    {
      id: '1',
      title: 'Clair de Lune',
      composer: 'Claude Debussy',
      genre: 'Classique',
      difficulty: 'Intermédiaire',
      thumbnail: 'https://images.pexels.com/photos/164743/pexels-photo-164743.jpeg?auto=compress&cs=tinysrgb&w=400',
      isDownloaded: true,
      dateAdded: new Date(),
      fileSize: 2.4,
    },
    {
      id: '2',
      title: 'Für Elise',
      composer: 'Ludwig van Beethoven',
      genre: 'Classique',
      difficulty: 'Débutant',
      thumbnail: 'https://images.pexels.com/photos/1407322/pexels-photo-1407322.jpeg?auto=compress&cs=tinysrgb&w=400',
      isDownloaded: false,
      dateAdded: new Date(),
      fileSize: 1.8,
    },
    {
      id: '3',
      title: 'Canon en Ré',
      composer: 'Johann Pachelbel',
      genre: 'Classique',
      difficulty: 'Intermédiaire',
      thumbnail: 'https://images.pexels.com/photos/1246437/pexels-photo-1246437.jpeg?auto=compress&cs=tinysrgb&w=400',
      isDownloaded: true,
      dateAdded: new Date(),
      fileSize: 3.1,
    },
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

   // UI State
  isDrawerOpene: false,
  setDrawerOpene: (open) => set({ isDrawerOpene: open }),
  
  // Search
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
  searchFilters: {
    genre: '',
    difficulty: '',
    composer: '',
  },
  setSearchFilters: (filters) => set((state) => ({
    searchFilters: { ...state.searchFilters, ...filters }
  })),
}));