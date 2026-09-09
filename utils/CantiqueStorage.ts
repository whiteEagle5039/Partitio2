// utils/CantiqueStorage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Cantique, CantiqueMetadata } from '@/types/cantique';
import { cantiquesLibrary } from '@/cantiques';

const STORAGE_KEYS = {
  CANTIQUES_PREFIX: '@harmonia/cantiques',      // Cantiques de la bibliothèque
  USER_CANTIQUES: '@harmonia/user_cantiques',   // Cantiques créés par l'utilisateur
  FAVORITES: '@harmonia/favorite_cantiques',    // Cantiques favoris
  DOWNLOADS: '@harmonia/downloaded_cantiques',  // Cantiques marqués disponibles hors-ligne
  RECENTS: '@harmonia/recent_cantiques',        // Historique de consultation
};

const RECENTS_LIMIT = 20;

export const useCantiqueStorage = () => {
  
  // ==========================================
  // BIBLIOTHÈQUE DE CANTIQUES (Lecture seule)
  // ==========================================
  
  /**
   * Récupérer tous les cantiques de la bibliothèque
   */
  const getAllCantiques = async (): Promise<Cantique[]> => {
    try {
      // Retourner la bibliothèque pré-chargée
      return cantiquesLibrary;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des cantiques:', error);
      return [];
    }
  };

  /**
   * Récupérer un cantique par son ID
   */
  const getCantiqueById = async (id: string): Promise<Cantique | null> => {
    try {
      const cantique = cantiquesLibrary.find(c => c.id === id);
      return cantique || null;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération du cantique:', error);
      return null;
    }
  };

  /**
   * Récupérer un cantique par son numéro
   */
  const getCantiqueByNumber = async (number: number): Promise<Cantique | null> => {
    try {
      const cantique = cantiquesLibrary.find(c => c.number === number);
      return cantique || null;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération du cantique:', error);
      return null;
    }
  };

  /**
   * Rechercher des cantiques
   */
  const searchCantiques = async (query: string): Promise<Cantique[]> => {
    try {
      const lowerQuery = query.toLowerCase();
      
      return cantiquesLibrary.filter(cantique => 
        cantique.title.toLowerCase().includes(lowerQuery) ||
        cantique.composer.toLowerCase().includes(lowerQuery) ||
        cantique.category?.toLowerCase().includes(lowerQuery) ||
        cantique.number.toString().includes(lowerQuery) ||
        cantique.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
      );
    } catch (error) {
      console.error('❌ Erreur lors de la recherche:', error);
      return [];
    }
  };

  /**
   * Filtrer par catégorie
   */
  const getCantiquesByCategory = async (category: string): Promise<Cantique[]> => {
    try {
      return cantiquesLibrary.filter(c => c.category === category);
    } catch (error) {
      console.error('❌ Erreur lors du filtrage:', error);
      return [];
    }
  };

  // ==========================================
  // CANTIQUES UTILISATEUR (Lecture/Écriture)
  // ==========================================

  /**
   * Sauvegarder un cantique créé par l'utilisateur
   */
  const saveUserCantique = async (cantique: Cantique): Promise<Cantique> => {
    try {
      const key = `${STORAGE_KEYS.USER_CANTIQUES}/${cantique.id}`;
      const cantiqueData = {
        ...cantique,
        isPublic: false,
        createdAt: cantique.createdAt || new Date().toISOString(),
      };
      
      await AsyncStorage.setItem(key, JSON.stringify(cantiqueData));
      console.log('✅ Cantique utilisateur sauvegardé:', cantique.id);
      
      return cantiqueData;
    } catch (error) {
      console.error('❌ Erreur lors de la sauvegarde:', error);
      throw error;
    }
  };

  /**
   * Récupérer tous les cantiques de l'utilisateur
   */
  const getUserCantiques = async (): Promise<Cantique[]> => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const userKeys = keys.filter(key => 
        key.startsWith(STORAGE_KEYS.USER_CANTIQUES)
      );
      
      const cantiques = await AsyncStorage.multiGet(userKeys);
      
      return cantiques
        .map(([_, value]) => value ? JSON.parse(value) : null)
        .filter(Boolean)
        .sort((a, b) => b.number - a.number);
    } catch (error) {
      console.error('❌ Erreur lors de la récupération:', error);
      return [];
    }
  };

  /**
   * Supprimer un cantique utilisateur
   */
  const deleteUserCantique = async (id: string): Promise<void> => {
    try {
      const key = `${STORAGE_KEYS.USER_CANTIQUES}/${id}`;
      await AsyncStorage.removeItem(key);
      console.log('✅ Cantique utilisateur supprimé:', id);
    } catch (error) {
      console.error('❌ Erreur lors de la suppression:', error);
      throw error;
    }
  };

  // ==========================================
  // FAVORIS
  // ==========================================

  /**
   * Ajouter un cantique aux favoris
   */
  const addToFavorites = async (cantiqueId: string): Promise<void> => {
    try {
      const favorites = await getFavorites();
      
      if (!favorites.includes(cantiqueId)) {
        favorites.push(cantiqueId);
        await AsyncStorage.setItem(
          STORAGE_KEYS.FAVORITES,
          JSON.stringify(favorites)
        );
        console.log('✅ Cantique ajouté aux favoris:', cantiqueId);
      }
    } catch (error) {
      console.error('❌ Erreur lors de l\'ajout aux favoris:', error);
      throw error;
    }
  };

  /**
   * Retirer un cantique des favoris
   */
  const removeFromFavorites = async (cantiqueId: string): Promise<void> => {
    try {
      const favorites = await getFavorites();
      const updated = favorites.filter(id => id !== cantiqueId);
      
      await AsyncStorage.setItem(
        STORAGE_KEYS.FAVORITES,
        JSON.stringify(updated)
      );
      console.log('✅ Cantique retiré des favoris:', cantiqueId);
    } catch (error) {
      console.error('❌ Erreur lors du retrait des favoris:', error);
      throw error;
    }
  };

  /**
   * Récupérer la liste des IDs de favoris
   */
  const getFavorites = async (): Promise<string[]> => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.FAVORITES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des favoris:', error);
      return [];
    }
  };

  /**
   * Récupérer les cantiques favoris complets
   */
  const getFavoriteCantiques = async (): Promise<Cantique[]> => {
    try {
      const favoriteIds = await getFavorites();
      const allCantiques = await getAllCantiques();
      
      return allCantiques.filter(c => favoriteIds.includes(c.id));
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des favoris:', error);
      return [];
    }
  };

  /**
   * Vérifier si un cantique est en favoris
   */
  const isFavorite = async (cantiqueId: string): Promise<boolean> => {
    try {
      const favorites = await getFavorites();
      return favorites.includes(cantiqueId);
    } catch (error) {
      console.error('❌ Erreur lors de la vérification:', error);
      return false;
    }
  };

  // ==========================================
  // TÉLÉCHARGEMENTS (disponibilité hors-ligne)
  // ==========================================

  /**
   * Récupérer la liste des IDs de cantiques téléchargés
   */
  const getDownloadedIds = async (): Promise<string[]> => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.DOWNLOADS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des téléchargements:', error);
      return [];
    }
  };

  /**
   * Marquer un cantique comme téléchargé (disponible hors-ligne)
   */
  const downloadCantique = async (cantiqueId: string): Promise<void> => {
    try {
      const downloaded = await getDownloadedIds();

      if (!downloaded.includes(cantiqueId)) {
        downloaded.push(cantiqueId);
        await AsyncStorage.setItem(STORAGE_KEYS.DOWNLOADS, JSON.stringify(downloaded));
      }
    } catch (error) {
      console.error('❌ Erreur lors du téléchargement:', error);
      throw error;
    }
  };

  /**
   * Retirer un cantique des téléchargements
   */
  const removeDownloadedCantique = async (cantiqueId: string): Promise<void> => {
    try {
      const downloaded = await getDownloadedIds();
      const updated = downloaded.filter((id) => id !== cantiqueId);
      await AsyncStorage.setItem(STORAGE_KEYS.DOWNLOADS, JSON.stringify(updated));
    } catch (error) {
      console.error('❌ Erreur lors de la suppression du téléchargement:', error);
      throw error;
    }
  };

  /**
   * Vérifier si un cantique est téléchargé
   */
  const isDownloaded = async (cantiqueId: string): Promise<boolean> => {
    const downloaded = await getDownloadedIds();
    return downloaded.includes(cantiqueId);
  };

  /**
   * Récupérer les cantiques téléchargés complets
   */
  const getDownloadedCantiques = async (): Promise<Cantique[]> => {
    const downloadedIds = await getDownloadedIds();
    return cantiquesLibrary.filter((c) => downloadedIds.includes(c.id));
  };

  // ==========================================
  // HISTORIQUE DE CONSULTATION
  // ==========================================

  /**
   * Enregistrer la consultation d'un cantique (le place en tête de l'historique)
   */
  const addToRecentlyViewed = async (cantiqueId: string): Promise<void> => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.RECENTS);
      const recents: string[] = data ? JSON.parse(data) : [];
      const updated = [cantiqueId, ...recents.filter((id) => id !== cantiqueId)].slice(0, RECENTS_LIMIT);
      await AsyncStorage.setItem(STORAGE_KEYS.RECENTS, JSON.stringify(updated));
    } catch (error) {
      console.error("❌ Erreur lors de l'enregistrement de la consultation:", error);
    }
  };

  /**
   * Récupérer les cantiques récemment consultés
   */
  const getRecentlyViewedCantiques = async (limit = 10): Promise<Cantique[]> => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.RECENTS);
      const recentIds: string[] = data ? JSON.parse(data) : [];

      return recentIds
        .map((id) => cantiquesLibrary.find((c) => c.id === id))
        .filter((c): c is Cantique => !!c)
        .slice(0, limit);
    } catch (error) {
      console.error('❌ Erreur lors de la récupération de l’historique:', error);
      return [];
    }
  };

  // ==========================================
  // MÉTADONNÉES
  // ==========================================

  /**
   * Récupérer uniquement les métadonnées (pour les listes)
   */
  const getAllMetadata = async (): Promise<CantiqueMetadata[]> => {
    try {
      return cantiquesLibrary.map(c => ({
        id: c.id,
        number: c.number,
        title: c.title,
        composer: c.composer,
        category: c.category,
        tags: c.tags,
      }));
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des métadonnées:', error);
      return [];
    }
  };

  /**
   * Récupérer toutes les catégories disponibles
   */
  const getCategories = async (): Promise<string[]> => {
    try {
      const categories = new Set<string>();
      cantiquesLibrary.forEach(c => {
        if (c.category) categories.add(c.category);
      });
      return Array.from(categories).sort();
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des catégories:', error);
      return [];
    }
  };

  return {
    // Bibliothèque
    getAllCantiques,
    getCantiqueById,
    getCantiqueByNumber,
    searchCantiques,
    getCantiquesByCategory,
    getAllMetadata,
    getCategories,
    
    // Cantiques utilisateur
    saveUserCantique,
    getUserCantiques,
    deleteUserCantique,
    
    // Favoris
    addToFavorites,
    removeFromFavorites,
    getFavorites,
    getFavoriteCantiques,
    isFavorite,

    // Téléchargements
    downloadCantique,
    removeDownloadedCantique,
    isDownloaded,
    getDownloadedCantiques,

    // Historique
    addToRecentlyViewed,
    getRecentlyViewedCantiques,
  };
};