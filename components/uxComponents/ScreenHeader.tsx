import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, TouchableOpacity, View, type StyleProp, type ViewStyle } from 'react-native';

import { MIN_TOUCH_TARGET, touchSlop } from '@/constants/layout';
import { useResponsive } from '@/hooks/useResponsive';
import { useThemeColors } from '@/hooks/useThemeColors';
import { TextComponent } from './TextComponent';

type ScreenHeaderProps = {
  title?: string;
  subtitle?: string;
  /** Affiche la flèche de retour (par défaut : oui). */
  showBack?: boolean;
  onBack?: () => void;
  /** Actions à droite du titre. */
  right?: React.ReactNode;
  /** Remplace le titre (barre de recherche, breadcrumb…). */
  center?: React.ReactNode;
  /** Filet de séparation sous l'en-tête. */
  bordered?: boolean;
  style?: StyleProp<ViewStyle>;
};

/**
 * En-tête d'écran commun : même hauteur, même rythme et mêmes cibles tactiles
 * partout dans l'application, quelle que soit la taille d'écran.
 */
export function ScreenHeader({
  title,
  subtitle,
  showBack = true,
  onBack,
  right,
  center,
  bordered = true,
  style,
}: ScreenHeaderProps) {
  const colors = useThemeColors();
  const { spacing, icon, gutter, isSmall } = useResponsive();
  const router = useRouter();

  const handleBack = onBack ?? (() => router.back());

  return (
    <View
      style={[
        styles.header,
        {
          paddingHorizontal: gutter - spacing.xs,
          paddingVertical: spacing.xs,
          gap: spacing.xxs,
          backgroundColor: colors.card,
          borderBottomWidth: bordered ? StyleSheet.hairlineWidth : 0,
          borderBottomColor: colors.border,
        },
        style,
      ]}
    >
      {showBack && (
        <TouchableOpacity
          onPress={handleBack}
          hitSlop={touchSlop}
          accessibilityRole="button"
          accessibilityLabel="Retour"
          style={[styles.iconButton, { borderRadius: MIN_TOUCH_TARGET / 2 }]}
        >
          <ArrowLeft size={icon.lg} color={colors.icon} />
        </TouchableOpacity>
      )}

      {center ?? (
        <View style={styles.titleBlock}>
          {!!title && (
            <TextComponent variante={isSmall ? 'subtitle2' : 'subtitle1'} numberOfLines={1} color={colors.text}>
              {title}
            </TextComponent>
          )}
          {!!subtitle && (
            <TextComponent variante="body5" color={colors.text2} numberOfLines={1}>
              {subtitle}
            </TextComponent>
          )}
        </View>
      )}

      {!!right && <View style={[styles.actions, { gap: spacing.xxs }]}>{right}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    minWidth: MIN_TOUCH_TARGET,
    minHeight: MIN_TOUCH_TARGET,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleBlock: {
    flex: 1,
    justifyContent: 'center',
    minWidth: 0,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default ScreenHeader;
