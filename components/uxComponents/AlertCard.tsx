import { LucideIcon } from 'lucide-react-native';
import React from 'react';
import { TouchableOpacity, View, ViewStyle } from 'react-native';

import { TextComponent } from '@/components/uxComponents/TextComponent';
import { MIN_TOUCH_TARGET, touchSlop } from '@/constants/layout';
import { useResponsive } from '@/hooks/useResponsive';
import { useThemeColors } from '@/hooks/useThemeColors';

interface AlertCardProps {
  icon?: LucideIcon;
  title?: string;
  message?: string;
  actionText?: string;
  onAction?: () => void;
  visible?: boolean;
  /** Couleur de l'accent (texte, icône, bordure). */
  tone?: string;
  containerStyle?: ViewStyle;
}

/** Bandeau d'information compact, aligné sur l'échelle d'espacement de l'app. */
export const AlertCard: React.FC<AlertCardProps> = ({
  icon: IconComponent,
  title,
  message,
  actionText,
  onAction,
  visible = true,
  tone,
  containerStyle,
}) => {
  const colors = useThemeColors();
  const { spacing, radius, icon } = useResponsive();

  if (!visible) return null;

  const accent = tone ?? colors.blueSingle;

  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: spacing.xs,
          paddingHorizontal: spacing.sm,
          paddingVertical: spacing.xs,
          borderRadius: radius.pill,
          borderWidth: 1,
          backgroundColor: `${accent}20`,
          borderColor: accent,
        },
        containerStyle,
      ]}
    >
      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: spacing.xs }}>
        {IconComponent && <IconComponent size={icon.xs} color={accent} strokeWidth={2} />}

        <View style={{ flex: 1, minWidth: 0 }}>
          {title && message ? (
            <>
              <TextComponent variante="subtitle4" color={accent} numberOfLines={1}>
                {title}
              </TextComponent>
              <TextComponent variante="body5" color={accent} numberOfLines={2}>
                {message}
              </TextComponent>
            </>
          ) : (
            <TextComponent variante="body5" color={accent} numberOfLines={2}>
              {title || message}
            </TextComponent>
          )}
        </View>
      </View>

      {!!actionText && !!onAction && (
        <TouchableOpacity
          onPress={onAction}
          hitSlop={touchSlop}
          accessibilityRole="button"
          style={{
            paddingHorizontal: spacing.xs,
            minHeight: MIN_TOUCH_TARGET / 1.5,
            justifyContent: 'center',
          }}
        >
          <TextComponent variante="caption" color={accent}>
            {actionText}
          </TextComponent>
        </TouchableOpacity>
      )}
    </View>
  );
};

/** Alias pour utilisation simple */
export const Alert = AlertCard;

export default AlertCard;
