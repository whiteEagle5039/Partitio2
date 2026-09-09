import React, { useMemo } from "react";
import { Platform, StyleProp, Text, TextProps, TextStyle } from "react-native";

import { MAX_FONT_SCALE } from "@/constants/layout";
import { useAppFonts } from "@/hooks/useAppFonts";
import { useResponsive } from "@/hooks/useResponsive";
import { useThemeColors } from "@/hooks/useThemeColors";

type FontRole = "display" | "text";

type Variant = {
    /** Taille à la largeur de référence (390 pt) ; mise à l'échelle à l'exécution. */
    size: number;
    /** Rapport interligne / taille de police. */
    leading: number;
    weight: TextStyle["fontWeight"];
    role: FontRole;
    /** Graisse de la fonte personnalisée à utiliser. */
    face: "Regular" | "Medium" | "Bold";
    letterSpacing?: number;
};

/**
 * Échelle typographique unique de l'application.
 * `display` = Styrene (titres), `text` = Tiempos (contenu).
 */
const variants = {
    header: { size: 32, leading: 1.16, weight: "700", role: "display", face: "Bold", letterSpacing: -0.6 },
    headline: { size: 24, leading: 1.2, weight: "600", role: "display", face: "Medium", letterSpacing: -0.3 },
    subtitle0: { size: 30, leading: 1.18, weight: "700", role: "display", face: "Bold", letterSpacing: -0.5 },
    subtitle1: { size: 22, leading: 1.25, weight: "600", role: "display", face: "Medium", letterSpacing: -0.2 },
    subtitle2: { size: 17, leading: 1.3, weight: "600", role: "display", face: "Medium" },
    subtitle3: { size: 15, leading: 1.33, weight: "600", role: "display", face: "Medium" },
    subtitle4: { size: 14, leading: 1.4, weight: "600", role: "display", face: "Regular" },

    body0: { size: 30, leading: 1.2, weight: "500", role: "text", face: "Medium" },
    body1: { size: 22, leading: 1.3, weight: "500", role: "text", face: "Medium" },
    body2: { size: 16, leading: 1.45, weight: "400", role: "text", face: "Regular" },
    body3: { size: 15, leading: 1.45, weight: "400", role: "text", face: "Regular" },
    body4: { size: 14, leading: 1.45, weight: "400", role: "text", face: "Regular" },
    body5: { size: 13, leading: 1.4, weight: "400", role: "text", face: "Regular" },
    body6: { size: 16, leading: 1.3, weight: "500", role: "text", face: "Medium" },

    caption: { size: 12, leading: 1.35, weight: "400", role: "text", face: "Regular", letterSpacing: 0.1 },
} satisfies Record<string, Variant>;

export type TextVariant = keyof typeof variants;

/** Fontes système de repli, tant que les fichiers ne sont pas chargés. */
const systemFamily: Record<FontRole, string | undefined> = {
    display: Platform.select({ ios: "System", android: "sans-serif", default: undefined }),
    text: Platform.select({ ios: "System", android: "sans-serif", default: undefined }),
};

function buildStyle(
    variant: Variant,
    fontsLoaded: boolean,
    fontSize: (size: number) => number,
): TextStyle {
    const size = fontSize(variant.size);
    const family = fontsLoaded
        ? `${variant.role === "display" ? "Styrene" : "Tiempos"}-${variant.face}`
        : systemFamily[variant.role];

    return {
        fontSize: size,
        lineHeight: Math.round(size * variant.leading),
        // Les fontes personnalisées portent déjà leur graisse : doubler l'effet
        // produit un faux gras sur Android.
        fontWeight: fontsLoaded ? undefined : variant.weight,
        fontFamily: family,
        letterSpacing: variant.letterSpacing,
    };
}

type Props = TextProps & {
    color?: string;
    variante?: TextVariant;
    children?: React.ReactNode;
    style?: StyleProp<TextStyle>;
};

/**
 * Texte de l'application : échelle typographique responsive, polices maison
 * avec repli système, et accessibilité (agrandissement système borné).
 */
export function TextComponent({ variante = "body3", color, style, ...rest }: Props) {
    const colors = useThemeColors();
    const { fontSize } = useResponsive();
    const fontsLoaded = useAppFonts();

    const variantStyle = useMemo(
        () => buildStyle(variants[variante] ?? variants.body3, fontsLoaded, fontSize),
        [variante, fontsLoaded, fontSize],
    );

    return (
        <Text
            maxFontSizeMultiplier={MAX_FONT_SCALE}
            style={[variantStyle, { color: color ?? colors.text2 }, style]}
            {...rest}
        />
    );
}

/** Variante par défaut orientée titres (même moteur de style). */
export function TextComponentHeading({ variante = "headline", ...rest }: Props) {
    return <TextComponent variante={variante} {...rest} />;
}

export default TextComponent;
