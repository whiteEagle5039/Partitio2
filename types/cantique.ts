// types/cantique.ts

export interface Section {
  id: string;
  name: string;
  soprano: string;
  alto: string;
  tenor: string;
  bass: string;
  lyrics?: string;
}

export interface Cantique {
  id: string;                    // Identifiant unique (ex: "cantique-001")
  number: number;                // Numéro dans le recueil (ex: 1, 2, 3...)
  title: string;                 // Titre du cantique
  composer: string;              // Compositeur
  category?: string;             // Catégorie (ex: "Louange", "Adoration", "Noël")
  tempo: string;                 // Tempo (ex: "4/4", "3/4")
  key: string;                   // Tonalité (ex: "Do", "Ré", "Mi")
  sections: Section[];           // Sections musicales
  createdAt: string;             // Date de création
  tags?: string[];               // Tags pour la recherche (ex: ["noël", "joie"])
  isPublic: boolean;             // Si le cantique est dans la bibliothèque publique
}

export interface CantiqueMetadata {
  id: string;
  number: number;
  title: string;
  composer: string;
  category?: string;
  tags?: string[];
}