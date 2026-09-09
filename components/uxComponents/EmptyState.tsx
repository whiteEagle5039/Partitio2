import { LucideIcon } from 'lucide-react-native';
import React from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';

import { useResponsive } from '@/hooks/useResponsive';
import { useThemeColors } from '@/hooks/useThemeColors';
import { ButtonComponent } from './ButtonComponent';
import { TextComponent } from './TextComponent';

type EmptyStateProps = {
  icon?: LucideIcon;
  title: string;
  subtitle?: string;
  actionText?: string;
  onActionPress?: () => void;
  /** `card` (défaut) pour un bloc encadré, `plain` pour un centrage plein écran. */
  variant?: 'card' | 'plain';
  /** Teinte de l'icône (défaut : primaire). */
  accent?: string;
  style?: StyleProp<ViewStyle>;
};

/**
 * État vide unique de l'application : même composition (icône, titre, aide,
 * action) sur tous les écrans, dimensionné selon la largeur disponible.
 */
export function EmptyState({
  icon: Icon,
  title,
  subtitle,
  actionText,
  onActionPress,
  variant = 'card',
  accent,
  style,
}: EmptyStateProps) {
  const colors = useThemeColors();
  const { spacing, radius, scale, isSmall } = useResponsive();

  const tint = accent ?? colors.primary;
  const badgeSize = scale(isSmall ? 56 : 68);

  return (
    <View
      style={[
        {
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: spacing.xxl,
          paddingHorizontal: spacing.xl,
          gap: spacing.xs,
          ...(variant === 'card'
            ? {
                backgroundColor: colors.card,
                borderColor: colors.border,
                borderWidth: 1,
                borderRadius: radius.lg,
              }
            : { flex: 1 }),
        },
        style,
      ]}
    >
      {Icon && (
        <View
          style={{
            width: badgeSize,
            height: badgeSize,
            borderRadius: badgeSize / 2,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: `${tint}18`,
            marginBottom: spacing.xs,
          }}
        >
          <Icon size={badgeSize * 0.45} color={tint} />
        </View>
      )}

      <TextComponent variante="subtitle2" color={colors.text} style={{ textAlign: 'center' }}>
        {title}
      </TextComponent>

      {!!subtitle && (
        <TextComponent variante="body4" color={colors.text2} style={{ textAlign: 'center', maxWidth: 380 }}>
          {subtitle}
        </TextComponent>
      )}

      {!!actionText && !!onActionPress && (
        <ButtonComponent
          title={actionText}
          onPress={onActionPress}
          size="sm"
          variant="primary"
          style={{ marginTop: spacing.sm }}
        />
      )}
    </View>
  );
}

export default EmptyState;
