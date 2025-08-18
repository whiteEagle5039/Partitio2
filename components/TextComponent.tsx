import { useThemeColors } from "@/hooks/useThemeColors";
import { useFonts } from "expo-font";
import React from "react";
import { Text, TextProps, StyleSheet, StyleProp, TextStyle } from "react-native";

// Styles inspirés de Claude/Anthropic
const styles = StyleSheet.create({
    // Styles pour les titres (Styrene-like)
    headline: { 
        fontSize: 24, 
        lineHeight: 28, 
        fontWeight: "600",
        fontFamily: "Styrene-Medium" // Fallback to system font if not loaded
    },
    subtitle0: { 
        fontSize: 32, 
        lineHeight: 36, 
        // fontWeight: "bold",
        fontFamily: "Styrene-Bold"
    },
    subtitle1: { 
        fontSize: 24, 
        lineHeight: 28, 
        fontWeight: "600",
        fontFamily: "Styrene-Medium"
    },
    subtitle2: { 
        fontSize: 18, 
        lineHeight: 22, 
        fontWeight: "600",
        fontFamily: "Styrene-Medium"
    },
    subtitle3: { 
        fontSize: 16, 
        lineHeight: 20, 
        fontWeight: "600",
        fontFamily: "Styrene-Medium"
    },
    header: { 
        fontSize: 32, 
        lineHeight: 36, 
        fontWeight: "bold",
        fontFamily: "Styrene-Bold"
    },
    
    // Styles pour le corps de texte (Tiempos-like)
    body1: { 
        fontSize: 32, 
        lineHeight: 36, 
        fontFamily: "Tiempos-Medium"
    },
    body2: { 
        fontSize: 16, 
        lineHeight: 22,
        fontFamily: "Tiempos-Regular"
    },
    body3: { 
        fontSize: 15, 
        lineHeight: 21,
        fontFamily: "Tiempos-Regular"
    },
    body4: { 
        fontSize: 14, 
        lineHeight: 20,
        fontFamily: "Tiempos-Regular"
    },
    body5: { 
        fontSize: 13, 
        lineHeight: 18,
        fontFamily: "Tiempos-Regular"
    },
    
    caption: { 
        fontSize: 12, 
        lineHeight: 16,
        fontFamily: "Tiempos-Regular"
    },
});

// Fallback styles pour les appareils sans les polices personnalisées
const fallbackStyles = StyleSheet.create({
    headline: { 
        fontSize: 24, 
        lineHeight: 28, 
        fontWeight: "600"
    },
    subtitle0: { 
        fontSize: 32, 
        lineHeight: 36, 
        fontWeight: "bold"
    },
    subtitle1: { 
        fontSize: 24, 
        lineHeight: 28, 
        fontWeight: "600"
    },
    subtitle2: { 
        fontSize: 18, 
        lineHeight: 22, 
        fontWeight: "600"
    },
    subtitle3: { 
        fontSize: 16, 
        lineHeight: 20, 
        fontWeight: "600"
    },
    body1: { fontSize: 18, lineHeight: 24 },
    body2: { fontSize: 16, lineHeight: 22 },
    body3: { fontSize: 15, lineHeight: 21 },
    body4: { fontSize: 14, lineHeight: 20 },
    body5: { fontSize: 13, lineHeight: 18 },
    caption: { fontSize: 12, lineHeight: 16 },
});

type Props = TextProps & {
    color?: string;
    variante?: keyof typeof styles;
    children?: React.ReactNode;
    style?: StyleProp<TextStyle>;
};

export function TextComponent({ variante = "body3", color, style, ...rest }: Props) {
    const colors = useThemeColors();
    
    // Chargement des polices personnalisées
    const [fontsLoaded] = useFonts({
        // Si vous avez les vraies polices Styrene et Tiempos
        'Styrene-Regular': require('../assets/fonts/StyreneB-Regular-Trial-BF63f6cbe9db1d5.otf'),
        'Styrene-Medium': require('../assets/fonts/StyreneB-Medium-Trial-BF63f6cc85760c2.otf'),
        'Styrene-Bold': require('../assets/fonts/StyreneB-Bold-Trial-BF63f6cbe9f13bb.otf'),
        'Tiempos-Regular': require('../assets/fonts/TestTiemposText-Regular-BF66457a50cd521.otf'),
        'Tiempos-Medium': require('../assets/fonts/TestTiemposText-Medium-BF66457a508489a.otf'),
        'Tiempos-Bold': require('../assets/fonts/TestTiemposText-Bold-BF66457a4f03c40.otf'),
    });

    // Utilise les styles avec polices personnalisées si chargées, sinon fallback
    const currentStyles = fontsLoaded ? styles : fallbackStyles;

    return (
        <Text 
            style={[
                currentStyles[variante],
                { color: color ?? colors.text2 },
                style
            ]} 
            {...rest}
        />
    );
}

// Composant séparé pour les titres (style Styrene)
export function TextComponentHeading({ variante = "headline", color, style, ...rest }: Props) {
    const colors = useThemeColors();
    
    const [fontsLoaded] = useFonts({
        'Styrene-Regular': require('../assets/fonts/StyreneB-Regular-Trial-BF63f6cbe9db1d5.otf'),
        'Styrene-Medium': require('../assets/fonts/StyreneB-Medium-Trial-BF63f6cc85760c2.otf'),
        'Styrene-Bold': require('../assets/fonts/StyreneB-BoldItalic-Trial-BF63f6cbe6863e6.otf'),
    });

    const headingStyles = fontsLoaded ? styles : fallbackStyles;

    return (
        <Text 
            style={[
                headingStyles[variante],
                { color: color ?? colors.text1 },
                style
            ]} 
            {...rest}
        />
    );
}

// Export par défaut
export default TextComponent;