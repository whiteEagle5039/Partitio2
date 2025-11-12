// utils/CompositionStorage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configuration du chemin de stockage
const STORAGE_CONFIG = {
  // COMPOSITION_PREFIX: '@harmonia/compositions',  // Changez ici
  // METADATA_KEY: '@harmonia/metadata',            // Changez ici
  COMPOSITION_PREFIX: '@compositions',
  METADATA_KEY: '@compositions_metadata',
};

// Types pour la structure de données
export interface Symbol {
  type: 'note' | 'rest' | 'bar' | 'repeat' | 'dynamic' | 'articulation';
  value?: string;
  duration?: 'whole' | 'half' | 'quarter' | 'eighth' | 'sixteenth';
  octave?: number;
  accidental?: 'sharp' | 'flat' | 'natural';
  dot?: boolean;
}

export interface Measure {
  id: string;
  symbols: Symbol[];
}

export interface VoiceContent {
  voice: 'soprano' | 'alto' | 'tenor' | 'bass';
  measures: Measure[];
}

export interface SavedSection {
  id: string;
  type: 'verse' | 'chorus' | 'bridge' | 'intro' | 'outro' | 'custom';
  title: string;
  content: VoiceContent[];
  lyrics?: string;
}

export interface SavedComposition {
  id: string;
  title: string;
  composer: string;
  tempo: string;
  key: string;
  createdAt: string;
  updatedAt: string;
  sections: SavedSection[];
  thumbnail?: string;
}

export interface Section {
  id: string;
  name: string;
  soprano: string;
  alto: string;
  tenor: string;
  bass: string;
  lyrics?: string;
}

export interface Composition {
  title: string;
  tempo: string;
  key: string;
  sections: Section[];
}

export class CompositionStorage {
  private static get STORAGE_KEY() {
    return STORAGE_CONFIG.COMPOSITION_PREFIX;
  }
  
  private static get METADATA_KEY() {
    return STORAGE_CONFIG.METADATA_KEY;
  }

  /**
   * 🔧 Utilitaire pour déboguer : liste toutes les clés de stockage
   */
  static async debugListAllKeys(): Promise<string[]> {
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      const compositionKeys = allKeys.filter(key => 
        key.startsWith(this.STORAGE_KEY) || key === this.METADATA_KEY
      );
      console.log('📦 Clés de composition trouvées:', compositionKeys);
      return compositionKeys;
    } catch (error) {
      console.error('❌ Erreur lors de la liste des clés:', error);
      return [];
    }
  }

  /**
   * 🔧 Utilitaire : exporter toutes les données de stockage
   */
  static async debugExportAll(): Promise<Record<string, any>> {
    try {
      const keys = await this.debugListAllKeys();
      const data: Record<string, any> = {};
      
      for (const key of keys) {
        const value = await AsyncStorage.getItem(key);
        data[key] = value ? JSON.parse(value) : null;
      }
      
      console.log('📤 Export complet:', data);
      return data;
    } catch (error) {
      console.error('❌ Erreur lors de l\'export:', error);
      return {};
    }
  }

  /**
   * Parse une chaîne de texte musical en symboles
   */
  private static parseTextToSymbols(text: string): Measure[] {
    if (!text || text.trim() === '') return [];
    
    const measures: Measure[] = [];
    let currentMeasure: Symbol[] = [];
    let measureId = 1;

    const elements = text.trim().split(/\s+/);

    elements.forEach((element) => {
      if (element === '|') {
        currentMeasure.push({ type: 'bar' });
        measures.push({
          id: `m${measureId}`,
          symbols: [...currentMeasure],
        });
        currentMeasure = [];
        measureId++;
      } else if (element === 'r' || element.toLowerCase().startsWith('rest')) {
        currentMeasure.push({
          type: 'rest',
          duration: 'quarter',
        });
      } else if (element === '||' || element === ':|:' || element === ':||') {
        currentMeasure.push({ type: 'repeat', value: element });
      } else if (/^[A-Ga-g][#b]?\d*$/.test(element)) {
        const match = element.match(/^([A-Ga-g])([#b])?(\d)?$/);
        if (match) {
          const [, note, accidental, octave] = match;
          currentMeasure.push({
            type: 'note',
            value: note.toUpperCase(),
            octave: octave ? parseInt(octave) : 4,
            accidental: accidental === '#' ? 'sharp' : accidental === 'b' ? 'flat' : undefined,
            duration: 'quarter',
          });
        }
      } else if (/^[pPmMfF]+$/.test(element)) {
        currentMeasure.push({
          type: 'dynamic',
          value: element,
        });
      }
    });

    if (currentMeasure.length > 0) {
      measures.push({
        id: `m${measureId}`,
        symbols: currentMeasure,
      });
    }

    return measures;
  }

  /**
   * Convertir une composition simple en format structuré
   */
  static convertToSavedFormat(
    composition: Composition,
    composer: string = 'Anonyme',
    existingId?: string
  ): SavedComposition {
    const now = new Date().toISOString();
    
    const savedSections: SavedSection[] = composition.sections.map((section) => {
      let sectionType: SavedSection['type'] = 'custom';
      const lowerName = section.name.toLowerCase();
      
      if (lowerName.includes('couplet') || lowerName.includes('verse')) {
        sectionType = 'verse';
      } else if (lowerName.includes('refrain') || lowerName.includes('chorus')) {
        sectionType = 'chorus';
      } else if (lowerName.includes('pont') || lowerName.includes('bridge')) {
        sectionType = 'bridge';
      } else if (lowerName.includes('intro')) {
        sectionType = 'intro';
      } else if (lowerName.includes('outro') || lowerName.includes('conclusion')) {
        sectionType = 'outro';
      }

      const voiceContent: VoiceContent[] = [
        {
          voice: 'soprano',
          measures: this.parseTextToSymbols(section.soprano || ''),
        },
        {
          voice: 'alto',
          measures: this.parseTextToSymbols(section.alto || ''),
        },
        {
          voice: 'tenor',
          measures: this.parseTextToSymbols(section.tenor || ''),
        },
        {
          voice: 'bass',
          measures: this.parseTextToSymbols(section.bass || ''),
        },
      ];

      return {
        id: section.id,
        type: sectionType,
        title: section.name,
        content: voiceContent,
        lyrics: section.lyrics,
      };
    });

    return {
      id: existingId || `comp-${Date.now()}`,
      title: composition.title,
      composer,
      tempo: composition.tempo,
      key: composition.key,
      createdAt: existingId ? (this.getCreatedDateSync(existingId) || now) : now,
      updatedAt: now,
      sections: savedSections,
    };
  }

  /**
   * Convertir le format structuré en format simple
   */
  static convertToSimpleFormat(saved: SavedComposition): Composition {
    const sections: Section[] = saved.sections.map((savedSection) => {
      const soprano = this.symbolsToText(
        savedSection.content.find((v) => v.voice === 'soprano')?.measures || []
      );
      const alto = this.symbolsToText(
        savedSection.content.find((v) => v.voice === 'alto')?.measures || []
      );
      const tenor = this.symbolsToText(
        savedSection.content.find((v) => v.voice === 'tenor')?.measures || []
      );
      const bass = this.symbolsToText(
        savedSection.content.find((v) => v.voice === 'bass')?.measures || []
      );

      return {
        id: savedSection.id,
        name: savedSection.title,
        soprano,
        alto,
        tenor,
        bass,
        lyrics: savedSection.lyrics,
      };
    });

    return {
      title: saved.title,
      tempo: saved.tempo,
      key: saved.key,
      sections,
    };
  }

  /**
   * Convertir des symboles en texte
   */
  private static symbolsToText(measures: Measure[]): string {
    let text = '';

    measures.forEach((measure) => {
      measure.symbols.forEach((symbol) => {
        if (symbol.type === 'note') {
          let noteText = symbol.value || '';
          if (symbol.accidental === 'sharp') noteText += '#';
          if (symbol.accidental === 'flat') noteText += 'b';
          if (symbol.octave) noteText += symbol.octave;
          text += noteText + ' ';
        } else if (symbol.type === 'rest') {
          text += 'r ';
        } else if (symbol.type === 'bar') {
          text += '| ';
        } else if (symbol.type === 'repeat') {
          text += (symbol.value || '||') + ' ';
        } else if (symbol.type === 'dynamic') {
          text += (symbol.value || '') + ' ';
        }
      });
    });

    return text.trim();
  }

  /**
   * Sauvegarder une composition
   */
  static async saveComposition(
    composition: Composition,
    composer: string = 'Anonyme',
    existingId?: string
  ): Promise<SavedComposition> {
    try {
      const savedComp = this.convertToSavedFormat(composition, composer, existingId);
      
      await AsyncStorage.setItem(
        `${this.STORAGE_KEY}_${savedComp.id}`,
        JSON.stringify(savedComp)
      );

      await this.updateMetadata(savedComp);

      console.log('✅ Composition sauvegardée:', savedComp.id);
      return savedComp;
    } catch (error) {
      console.error('❌ Erreur lors de la sauvegarde:', error);
      throw error;
    }
  }

  /**
   * Charger une composition
   */
  static async loadComposition(id: string): Promise<SavedComposition | null> {
    try {
      const data = await AsyncStorage.getItem(`${this.STORAGE_KEY}_${id}`);
      if (data) {
        return JSON.parse(data);
      }
      return null;
    } catch (error) {
      console.error('❌ Erreur lors du chargement:', error);
      return null;
    }
  }

  /**
   * Récupérer toutes les compositions (métadonnées uniquement)
   */
  static async getAllCompositions(): Promise<Array<{
    id: string;
    title: string;
    composer: string;
    updatedAt: string;
    thumbnail?: string;
  }>> {
    try {
      const metadataStr = await AsyncStorage.getItem(this.METADATA_KEY);
      if (metadataStr) {
        return JSON.parse(metadataStr);
      }
      return [];
    } catch (error) {
      console.error('❌ Erreur lors de la récupération:', error);
      return [];
    }
  }

  /**
   * Supprimer une composition
   */
  static async deleteComposition(id: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(`${this.STORAGE_KEY}_${id}`);
      await this.removeFromMetadata(id);
      console.log('✅ Composition supprimée:', id);
    } catch (error) {
      console.error('❌ Erreur lors de la suppression:', error);
      throw error;
    }
  }

  /**
   * Mettre à jour les métadonnées
   */
  private static async updateMetadata(composition: SavedComposition): Promise<void> {
    const metadata = await this.getAllCompositions();
    const index = metadata.findIndex((m) => m.id === composition.id);

    const newMeta = {
      id: composition.id,
      title: composition.title,
      composer: composition.composer,
      updatedAt: composition.updatedAt,
      thumbnail: composition.thumbnail,
    };

    if (index >= 0) {
      metadata[index] = newMeta;
    } else {
      metadata.push(newMeta);
    }

    metadata.sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );

    await AsyncStorage.setItem(this.METADATA_KEY, JSON.stringify(metadata));
  }

  /**
   * Retirer des métadonnées
   */
  private static async removeFromMetadata(id: string): Promise<void> {
    const metadata = await this.getAllCompositions();
    const filtered = metadata.filter((m) => m.id !== id);
    await AsyncStorage.setItem(this.METADATA_KEY, JSON.stringify(filtered));
  }

  /**
   * Obtenir la date de création (version synchrone pour éviter les problèmes)
   */
  private static getCreatedDateSync(id: string): string | null {
    return null;
  }

  /**
   * Exporter une composition en JSON
   */
  static async exportToJSON(id: string): Promise<string | null> {
    const composition = await this.loadComposition(id);
    if (composition) {
      return JSON.stringify(composition, null, 2);
    }
    return null;
  }

  /**
   * Importer une composition depuis JSON
   */
  static async importFromJSON(jsonString: string): Promise<SavedComposition> {
    try {
      const composition: SavedComposition = JSON.parse(jsonString);
      
      composition.id = `comp-${Date.now()}`;
      composition.createdAt = new Date().toISOString();
      composition.updatedAt = new Date().toISOString();

      await AsyncStorage.setItem(
        `${this.STORAGE_KEY}_${composition.id}`,
        JSON.stringify(composition)
      );
      await this.updateMetadata(composition);

      return composition;
    } catch (error) {
      console.error('❌ Erreur lors de l\'importation:', error);
      throw error;
    }
  }
}

export const useCompositionStorage = () => {
  const saveComposition = async (
    composition: Composition,
    composer?: string,
    id?: string
  ) => {
    return CompositionStorage.saveComposition(composition, composer, id);
  };

  const loadComposition = async (id: string) => {
    const saved = await CompositionStorage.loadComposition(id);
    if (saved) {
      return CompositionStorage.convertToSimpleFormat(saved);
    }
    return null;
  };

  const getAllCompositions = () => {
    return CompositionStorage.getAllCompositions();
  };

  const deleteComposition = (id: string) => {
    return CompositionStorage.deleteComposition(id);
  };

  const exportComposition = (id: string) => {
    return CompositionStorage.exportToJSON(id);
  };

  const importComposition = (jsonString: string) => {
    return CompositionStorage.importFromJSON(jsonString);
  };

  // Fonctions de débogage
  const debugListKeys = () => {
    return CompositionStorage.debugListAllKeys();
  };

  const debugExportAll = () => {
    return CompositionStorage.debugExportAll();
  };

  return {
    saveComposition,
    loadComposition,
    getAllCompositions,
    deleteComposition,
    exportComposition,
    importComposition,
    debugListKeys,
    debugExportAll,
  };
};