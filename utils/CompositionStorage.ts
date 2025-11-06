// utils/CompositionStorage.tsCannot find module '@react-native-async-storage/async-storage' or its corresponding type declarations.ts(2307)

import AsyncStorage from '@react-native-async-storage/async-storage';

// Types pour la structure de données
export interface Symbol {
  type: 'note' | 'rest' | 'bar' | 'repeat' | 'dynamic' | 'articulation';
  value?: string; // Note name (C, D, E, etc.) or symbol
  duration?: 'whole' | 'half' | 'quarter' | 'eighth' | 'sixteenth';
  octave?: number;
  accidental?: 'sharp' | 'flat' | 'natural';
  dot?: boolean; // Pour les notes pointées
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
  thumbnail?: string; // URL ou base64 de la miniature
}

// Types pour l'interface actuelle
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

// Classe principale pour la gestion du stockage
export class CompositionStorage {
  private static STORAGE_KEY = '@compositions';
  private static METADATA_KEY = '@compositions_metadata';

  /**
   * Parse une chaîne de texte musical en symboles
   * Exemple: "C4 E4 | G4 r |" -> symboles structurés
   */
  private static parseTextToSymbols(text: string): Measure[] {
    const measures: Measure[] = [];
    let currentMeasure: Symbol[] = [];
    let measureId = 1;

    // Nettoyer et séparer les éléments
    const elements = text.trim().split(/\s+/);

    elements.forEach((element) => {
      if (element === '|') {
        // Barre de mesure
        currentMeasure.push({ type: 'bar' });
        measures.push({
          id: `m${measureId}`,
          symbols: [...currentMeasure],
        });
        currentMeasure = [];
        measureId++;
      } else if (element === 'r' || element.toLowerCase().startsWith('rest')) {
        // Silence
        currentMeasure.push({
          type: 'rest',
          duration: 'quarter', // Durée par défaut
        });
      } else if (element === '||' || element === ':|:' || element === ':||') {
        // Répétition
        currentMeasure.push({ type: 'repeat', value: element });
      } else if (/^[A-Ga-g][#b]?\d*$/.test(element)) {
        // Note (ex: C4, D#5, Eb3)
        const match = element.match(/^([A-Ga-g])([#b])?(\d)?$/);
        if (match) {
          const [, note, accidental, octave] = match;
          currentMeasure.push({
            type: 'note',
            value: note.toUpperCase(),
            octave: octave ? parseInt(octave) : 4,
            accidental: accidental === '#' ? 'sharp' : accidental === 'b' ? 'flat' : undefined,
            duration: 'quarter', // Durée par défaut
          });
        }
      } else if (/^[pPmMfF]+$/.test(element)) {
        // Dynamiques (p, mp, mf, f, ff, etc.)
        currentMeasure.push({
          type: 'dynamic',
          value: element,
        });
      }
    });

    // Ajouter la dernière mesure si elle contient des éléments
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
      // Déterminer le type de section basé sur le nom
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

      // Convertir chaque voix
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
      createdAt: existingId ? (this.getCreatedDate(existingId) || now) : now,
      updatedAt: now,
      sections: savedSections,
    };
  }

  /**
   * Convertir le format structuré en format simple
   */
  static convertToSimpleFormat(saved: SavedComposition): Composition {
    const sections: Section[] = saved.sections.map((savedSection) => {
      // Reconstruire les chaînes de texte à partir des symboles
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
      
      // Sauvegarder la composition
      await AsyncStorage.setItem(
        `${this.STORAGE_KEY}_${savedComp.id}`,
        JSON.stringify(savedComp)
      );

      // Mettre à jour les métadonnées
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

    // Trier par date de modification (plus récent en premier)
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
   * Obtenir la date de création
   */
  private static getCreatedDate(id: string): string | null {
    // Cette fonction serait appelée de manière asynchrone dans un contexte réel
    // Pour simplifier, on retourne null ici
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
      
      // Générer un nouvel ID pour éviter les conflits
      composition.id = `comp-${Date.now()}`;
      composition.createdAt = new Date().toISOString();
      composition.updatedAt = new Date().toISOString();

      // Sauvegarder
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

// Hook React pour utiliser facilement le stockage
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

  return {
    saveComposition,
    loadComposition,
    getAllCompositions,
    deleteComposition,
    exportComposition,
    importComposition,
  };
};