import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';

import {
    breakpoints,
    contentMaxWidth,
    getBreakpoint,
    gridColumns,
    iconBase,
    moderate,
    radiusBase,
    spacingBase,
    type Breakpoint,
    type IconScale,
    type RadiusScale,
    type SpacingScale,
} from '@/constants/layout';

export type Responsive = {
    width: number;
    height: number;
    breakpoint: Breakpoint;
    isSmall: boolean;
    isTablet: boolean;
    isLandscape: boolean;
    /** Espacements adaptés à la largeur courante. */
    spacing: SpacingScale;
    /** Rayons adaptés à la largeur courante. */
    radius: RadiusScale;
    /** Tailles d'icônes adaptées à la largeur courante. */
    icon: IconScale;
    /** Marge latérale des écrans. */
    gutter: number;
    /** Largeur max du contenu centré (listes/formulaires). */
    maxContentWidth: number;
    /** Largeur max du contenu centré (grilles denses). */
    maxWideWidth: number;
    /** Met un nombre à l'échelle de la largeur courante. */
    scale: (size: number, factor?: number) => number;
    /** Met une taille de police à l'échelle (variation volontairement douce). */
    fontSize: (size: number) => number;
    /** Nombre de colonnes pour une largeur de carte minimale. */
    columns: (minCardWidth: number, max?: number) => number;
};

function buildScale<T extends Record<string, number>>(base: T, width: number, factor: number): T {
    const out = {} as Record<string, number>;
    for (const key of Object.keys(base)) {
        const value = base[key];
        out[key] = value === 0 || value >= 999 ? value : moderate(width, value, factor);
    }
    return out as T;
}

/**
 * Valeurs de mise en page dépendantes de la taille de fenêtre.
 *
 * Contrairement à `Dimensions.get()` lu au chargement du module, ce hook suit
 * les rotations, le multi-fenêtre Android et le redimensionnement web.
 */
export function useResponsive(): Responsive {
    const { width, height } = useWindowDimensions();

    return useMemo(() => {
        const breakpoint = getBreakpoint(width);
        const isTablet = width >= breakpoints.lg;
        const isSmall = width < breakpoints.sm;

        // Sur tablette, les espacements montent à peine : c'est la grille qui
        // s'élargit, pas les composants.
        const spacingFactor = isTablet ? 0.25 : 0.6;

        const spacing = buildScale(spacingBase, width, spacingFactor);
        const radius = buildScale(radiusBase, width, 0.3);
        const icon = buildScale(iconBase, width, 0.35);

        return {
            width,
            height,
            breakpoint,
            isSmall,
            isTablet,
            isLandscape: width > height,
            spacing,
            radius,
            icon,
            gutter: isTablet ? spacing.xxl : spacing.lg,
            maxContentWidth: contentMaxWidth.narrow,
            maxWideWidth: contentMaxWidth.wide,
            scale: (size: number, factor = 0.6) => moderate(width, size, factor),
            fontSize: (size: number) => moderate(width, size, 0.35),
            columns: (minCardWidth: number, max = 4) =>
                gridColumns(Math.min(width, contentMaxWidth.wide), minCardWidth, max),
        };
    }, [width, height]);
}
