import { useThemeColors } from './useThemeColors';

export type SheetTheme = {
  /** Fond de la « page » de partition. */
  paper: string;
  /** Encre principale (notes, titres). */
  ink: string;
  /** Encre secondaire (métadonnées). */
  inkMuted: string;
  /** Filets légers entre voix / mesures. */
  rule: string;
  /** Filets structurants (portées, séparateurs de système). */
  ruleStrong: string;
  /** Fond des blocs de paroles et des messages. */
  highlight: string;
};

/**
 * Couleurs de la partition affichée.
 *
 * On s'appuie sur les jetons du thème (dont `staff`) plutôt que sur du blanc et
 * du #333 en dur : la page reste lisible en thème sombre.
 */
export function useSheetTheme(): SheetTheme {
  const colors = useThemeColors();

  return {
    paper: colors.card,
    ink: colors.text,
    inkMuted: colors.text2,
    rule: colors.staff,
    ruleStrong: colors.border,
    highlight: colors.card2,
  };
}
