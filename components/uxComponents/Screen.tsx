import React, { useMemo } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

import { useResponsive } from '@/hooks/useResponsive';
import { useThemeColors } from '@/hooks/useThemeColors';

type ScreenProps = {
  children: React.ReactNode;
  /** Fond de l'écran (par défaut `colors.background`). */
  background?: string;
  /** Bords protégés par la safe area. Les côtés comptent en paysage / sur encoche. */
  edges?: readonly Edge[];
  style?: StyleProp<ViewStyle>;
};

/**
 * Coquille d'écran : safe area sur les quatre côtés utiles et fond thématisé.
 * Le `View` extérieur évite les bandes blanches quand le contenu ne remplit pas
 * la zone protégée.
 */
export function Screen({ children, background, edges = ['top', 'left', 'right'], style }: ScreenProps) {
  const colors = useThemeColors();
  const backgroundColor = background ?? colors.background;

  return (
    <View style={[styles.fill, { backgroundColor }]}>
      <SafeAreaView edges={edges} style={[styles.fill, style]}>
        {children}
      </SafeAreaView>
    </View>
  );
}

type ContentProps = {
  children: React.ReactNode;
  /** `wide` pour les grilles denses, `narrow` (défaut) pour listes et textes. */
  width?: 'narrow' | 'wide' | 'full';
  /** Applique la marge latérale standard de l'écran. */
  gutter?: boolean;
  style?: StyleProp<ViewStyle>;
};

/**
 * Centre le contenu et borne sa largeur : sur tablette et sur le web, une liste
 * étirée sur 1200 px devient illisible.
 */
export function Content({ children, width = 'narrow', gutter = true, style }: ContentProps) {
  const { gutter: gutterSize, maxContentWidth, maxWideWidth } = useResponsive();

  const containerStyle = useMemo<ViewStyle>(
    () => ({
      width: '100%',
      alignSelf: 'center',
      maxWidth: width === 'full' ? undefined : width === 'wide' ? maxWideWidth : maxContentWidth,
      paddingHorizontal: gutter ? gutterSize : 0,
    }),
    [gutter, gutterSize, maxContentWidth, maxWideWidth, width],
  );

  return <View style={[containerStyle, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
});

export default Screen;
