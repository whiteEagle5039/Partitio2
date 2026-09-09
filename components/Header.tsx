import { Music } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { MIN_TOUCH_TARGET, touchSlop } from '@/constants/layout';
import { useResponsive } from '@/hooks/useResponsive';
import { useThemeColors } from '@/hooks/useThemeColors';
import { TextComponent } from './uxComponents/TextComponent';

/** En-tête de marque simple (logo + liens), dimensionné avec l'échelle globale. */
export function Header() {
  const colors = useThemeColors();
  const { spacing, icon, gutter } = useResponsive();

  return (
    <View
      style={[
        styles.header,
        {
          paddingHorizontal: gutter,
          paddingVertical: spacing.sm,
          backgroundColor: colors.card,
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: colors.border,
        },
      ]}
    >
      <View style={[styles.logo, { gap: spacing.xs }]}>
        <Music size={icon.lg} color={colors.primary} />
        <TextComponent variante="subtitle2" color={colors.text}>
          harmonia
        </TextComponent>
      </View>

      <View style={[styles.menu, { gap: spacing.xs }]}>
        {['Profil', 'Explorer'].map((label) => (
          <TouchableOpacity
            key={label}
            style={styles.menuItem}
            hitSlop={touchSlop}
            accessibilityRole="button"
          >
            <TextComponent variante="body4" color={colors.text2}>
              {label}
            </TextComponent>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menu: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItem: {
    minHeight: MIN_TOUCH_TARGET,
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
});
