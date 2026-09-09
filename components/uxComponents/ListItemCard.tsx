import React from 'react';
import { StyleSheet, TouchableOpacity, View, type StyleProp, type ViewStyle } from 'react-native';

import { MIN_TOUCH_TARGET } from '@/constants/layout';
import { useResponsive } from '@/hooks/useResponsive';
import { useThemeColors } from '@/hooks/useThemeColors';
import { TextComponent } from './TextComponent';

type ListItemCardProps = {
  title: string;
  subtitle?: string;
  description?: string;
  /** Contenu de la vignette (icône, numéro…). */
  leading?: React.ReactNode;
  /** Teinte du fond de la vignette. */
  leadingTint?: string;
  /** Contenu aligné à droite (chevron, actions…). */
  trailing?: React.ReactNode;
  /** Ligne de métadonnées sous le texte (badges, compteurs…). */
  meta?: React.ReactNode;
  onPress?: () => void;
  numberOfLines?: number;
  style?: StyleProp<ViewStyle>;
};

/**
 * Ligne de liste commune (cantiques, compositions, leçons, recherche,
 * téléchargements) : même vignette, même rythme vertical, même troncature.
 */
export function ListItemCard({
  title,
  subtitle,
  description,
  leading,
  leadingTint,
  trailing,
  meta,
  onPress,
  numberOfLines = 2,
  style,
}: ListItemCardProps) {
  const colors = useThemeColors();
  const { spacing, radius, scale } = useResponsive();

  const thumbSize = scale(52);
  const tint = leadingTint ?? colors.primary;

  const Container: any = onPress ? TouchableOpacity : View;

  return (
    <Container
      onPress={onPress}
      activeOpacity={0.75}
      accessibilityRole={onPress ? 'button' : undefined}
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing.sm,
          backgroundColor: colors.card,
          borderRadius: radius.lg,
          borderWidth: 1,
          borderColor: colors.border,
          padding: spacing.sm,
          minHeight: MIN_TOUCH_TARGET,
        },
        style,
      ]}
    >
      {leading != null && (
        <View
          style={{
            width: thumbSize,
            height: thumbSize,
            borderRadius: radius.md,
            backgroundColor: `${tint}18`,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {leading}
        </View>
      )}

      <View style={styles.body}>
        <TextComponent variante="subtitle3" color={colors.text} numberOfLines={1}>
          {title}
        </TextComponent>

        {!!subtitle && (
          <TextComponent variante="body4" color={colors.text2} numberOfLines={1}>
            {subtitle}
          </TextComponent>
        )}

        {!!description && (
          <TextComponent variante="body5" color={colors.text2} numberOfLines={numberOfLines}>
            {description}
          </TextComponent>
        )}

        {!!meta && (
          <View style={[styles.meta, { gap: spacing.xs, marginTop: spacing.xxs }]}>{meta}</View>
        )}
      </View>

      {!!trailing && <View style={styles.trailing}>{trailing}</View>}
    </Container>
  );
}

type BadgeProps = {
  label: string;
  /** Couleur du texte ; le fond en reprend une version très diluée. */
  tone?: string;
  icon?: React.ReactNode;
};

/** Petite étiquette de métadonnée, dimensionnée avec le reste de l'échelle. */
export function Badge({ label, tone, icon }: BadgeProps) {
  const colors = useThemeColors();
  const { spacing, radius } = useResponsive();
  const color = tone ?? colors.text2;

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xxs,
        paddingHorizontal: spacing.xs,
        paddingVertical: spacing.xxs / 2,
        borderRadius: radius.pill,
        backgroundColor: tone ? `${tone}18` : colors.muted,
      }}
    >
      {icon}
      <TextComponent variante="caption" color={color} numberOfLines={1}>
        {label}
      </TextComponent>
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    minWidth: 0,
    justifyContent: 'center',
  },
  meta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  trailing: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ListItemCard;
