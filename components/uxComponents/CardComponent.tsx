import React from "react";
import { View, ViewProps, type StyleProp, type ViewStyle } from "react-native";

import { elevation, type ElevationLevel } from "@/constants/layout";
import { useResponsive } from "@/hooks/useResponsive";
import { useThemeColors } from "@/hooks/useThemeColors";

type Props = ViewProps & {
    /** `plain` = fond carte, `outlined` = fond carte + filet, `muted` = fond secondaire. */
    tone?: "plain" | "outlined" | "muted";
    /** Profondeur de l'ombre portée. */
    level?: ElevationLevel;
    /** Rembourrage interne standard. */
    padded?: boolean;
    style?: StyleProp<ViewStyle>;
};

/** Surface de contenu : rayon, fond et filet cohérents avec le reste de l'app. */
export function CardComponent({ tone = "outlined", level = 0, padded = true, style, ...rest }: Props) {
    const colors = useThemeColors();
    const { spacing, radius } = useResponsive();

    const base: ViewStyle = {
        backgroundColor: tone === "muted" ? colors.card2 : colors.card,
        borderRadius: radius.lg,
        borderWidth: tone === "outlined" ? 1 : 0,
        borderColor: colors.border,
        padding: padded ? spacing.md : 0,
        ...elevation(level),
    };

    return <View style={[base, style]} {...rest} />;
}

export default CardComponent;
