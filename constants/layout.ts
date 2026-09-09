/**
 * Fondations de mise en page pour harmonia.
 *
 * Un seul endroit qui décrit les espacements, rayons, ombres et règles
 * d'adaptation aux tailles d'écran. Les écrans consomment ces valeurs via
 * `useResponsive()` (valeurs vivantes, réévaluées à la rotation) et non en
 * lisant `Dimensions.get()` au chargement du module.
 */
import { Platform, type TextStyle, type ViewStyle } from 'react-native';

/** Largeur de référence des maquettes (iPhone 14 / Pixel 7). */
export const BASE_WIDTH = 390;

/** Seuils de largeur de fenêtre, en points. */
export const breakpoints = {
  xs: 0,     // petits téléphones (<360)
  sm: 360,   // téléphones standards
  md: 480,   // grands téléphones / petits pliants
  lg: 768,   // tablettes
  xl: 1024,  // grandes tablettes, web
} as const;

export type Breakpoint = keyof typeof breakpoints;

export function getBreakpoint(width: number): Breakpoint {
  if (width >= breakpoints.xl) return 'xl';
  if (width >= breakpoints.lg) return 'lg';
  if (width >= breakpoints.md) return 'md';
  if (width >= breakpoints.sm) return 'sm';
  return 'xs';
}

/**
 * Facteur d'échelle brut, borné pour qu'un petit téléphone reste lisible et
 * qu'une tablette n'obtienne pas des espacements démesurés (sur grand écran on
 * élargit la grille plutôt que les éléments).
 */
export function rawScale(width: number): number {
  const clamped = Math.min(Math.max(width, 320), 500);
  return clamped / BASE_WIDTH;
}

/** Interpolation douce entre « pas d'échelle » (0) et « échelle pleine » (1). */
export function moderate(width: number, size: number, factor = 0.6): number {
  return Math.round((size + (rawScale(width) * size - size) * factor) * 100) / 100;
}

/** Échelle des espacements (base 4). */
export const spacingBase = {
  none: 0,
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
} as const;

export type SpacingKey = keyof typeof spacingBase;
export type SpacingScale = Record<SpacingKey, number>;

/** Rayons de bordure. */
export const radiusBase = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
  pill: 999,
} as const;

export type RadiusKey = keyof typeof radiusBase;
export type RadiusScale = Record<RadiusKey, number>;

/** Tailles d'icônes cohérentes d'un écran à l'autre. */
export const iconBase = {
  xs: 14,
  sm: 18,
  md: 22,
  lg: 26,
  xl: 32,
  xxl: 40,
} as const;

export type IconKey = keyof typeof iconBase;
export type IconScale = Record<IconKey, number>;

/** Cible tactile minimale recommandée (iOS HIG / Material). */
export const MIN_TOUCH_TARGET = 44;

/** hitSlop générique pour les petites icônes cliquables. */
export const touchSlop = { top: 8, bottom: 8, left: 8, right: 8 } as const;

/** Multiplicateur maximal appliqué aux réglages système « grandes polices ». */
export const MAX_FONT_SCALE = 1.35;

export type ElevationLevel = 0 | 1 | 2 | 3;

/**
 * Ombres portées homogènes. `color` permet d'assombrir davantage en thème clair
 * et de rester discret en thème sombre.
 */
export function elevation(level: ElevationLevel, color = '#000000'): ViewStyle {
  if (level === 0) return {};

  const presets = {
    1: { offset: 1, radius: 3, opacity: 0.06, elevation: 1 },
    2: { offset: 3, radius: 8, opacity: 0.1, elevation: 3 },
    3: { offset: 8, radius: 20, opacity: 0.16, elevation: 8 },
  } as const;

  const preset = presets[level];

  return {
    shadowColor: color,
    shadowOffset: { width: 0, height: preset.offset },
    shadowOpacity: preset.opacity,
    shadowRadius: preset.radius,
    elevation: preset.elevation,
  };
}

/** Largeur maximale du contenu lisible, par famille de mise en page. */
export const contentMaxWidth = {
  /** Listes, formulaires, texte : au-delà, on centre. */
  narrow: 560,
  /** Grilles de cartes et écrans denses. */
  wide: 900,
} as const;

/**
 * Nombre de colonnes d'une grille pour une largeur utile donnée.
 * `min` est la largeur minimale souhaitée d'une carte.
 */
export function gridColumns(availableWidth: number, min: number, max = 4): number {
  return Math.max(1, Math.min(max, Math.floor(availableWidth / min)));
}

/** Style de texte évitant les débordements sur petits écrans. */
export const textWrap: TextStyle = {
  flexShrink: 1,
  ...(Platform.OS === 'web' ? { wordBreak: 'break-word' as any } : null),
};

/**
 * Largeur du tiroir latéral.
 *
 * Sur téléphone il occupe une fraction de l'écran (et reste utilisable sur un
 * 320 pt) ; sur tablette il garde une largeur fixe confortable.
 */
export function getDrawerWidth(windowWidth: number): number {
  if (windowWidth >= breakpoints.lg) return 340;
  return Math.round(Math.min(Math.max(windowWidth * 0.78, 260), 330));
}
