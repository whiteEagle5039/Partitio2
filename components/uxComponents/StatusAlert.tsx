import { TextComponent } from '@/components/uxComponents/TextComponent';
import { useThemeColors } from '@/hooks/useThemeColors';
import { LucideIcon } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';

interface StatusAlertProps {
  icon?: LucideIcon;
  title?: string;
  message?: string;
  actionText?: string;
  onAction?: () => void;
  visible?: boolean;
  containerStyle?: ViewStyle;
  centered?: boolean;
  iconColor?: string;
  iconBackgroundAlpha?: number;
}

export const StatusAlert: React.FC<StatusAlertProps> = ({
  icon: IconComponent,
  title,
  message,
  actionText,
  onAction,
  visible = true,
  containerStyle,
  centered = false,
  iconColor,
  iconBackgroundAlpha = 0.1,
}) => {
  const colors = useThemeColors();
  const resolvedIconColor = iconColor || colors.blueSingle;

  if (!visible) return null;

  const styles = StyleSheet.create({
    // Mode centré (comme "Connexion requise")
    centeredContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 40,
    },
    centeredCard: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 32,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
      marginHorizontal: 5,
    },
    centeredIcon: {
      width: 80,
      height: 80,
      borderRadius: 40,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 20,
      backgroundColor: `${resolvedIconColor}${Math.round(iconBackgroundAlpha * 255).toString(16).padStart(2, '0')}`,
    },
    centeredTitle: {
      textAlign: 'center',
      marginBottom: 12,
    },
    centeredMessage: {
      textAlign: 'center',
      marginBottom: 24,
      lineHeight: 20,
    },
    centeredButton: {
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 24,
      marginTop: 8,
    },

    // Mode inline (comme AlertCard)
    inlineContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 12,
      paddingVertical: 6,
      marginHorizontal: 20,
      marginBottom: 10,
      borderRadius: 20,
      borderWidth: 1,
      backgroundColor: `${resolvedIconColor}20`,
      borderColor: resolvedIconColor,
    },
    inlineContentContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    inlineTextContainer: {
      flex: 1,
    },
    inlineActionButton: {
      marginLeft: 8,
      paddingHorizontal: 12,
      paddingVertical: 4,
    },
    inlineIcon: {
      width: 24,
      height: 24,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

  if (centered) {
    return (
      <View style={[styles.centeredContainer, containerStyle]}>
        <View style={styles.centeredCard}>
          {IconComponent && (
            <View style={styles.centeredIcon}>
              <IconComponent size={40} color={resolvedIconColor} strokeWidth={2} />
            </View>
          )}
          {title && (
            <TextComponent variante="subtitle1" style={styles.centeredTitle}>
              {title}
            </TextComponent>
          )}
          {message && (
            <TextComponent
              variante="body2"
              color={colors.text2}
              style={styles.centeredMessage}
            >
              {message}
            </TextComponent>
          )}
          {actionText && onAction && (
            <TouchableOpacity
              style={[styles.centeredButton, { backgroundColor: colors.primary }]}
              onPress={onAction}
            >
              <TextComponent variante="body3" color="#FFFFFF">
                {actionText}
              </TextComponent>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }

  // Mode inline par défaut
  return (
    <View style={[styles.inlineContainer, containerStyle]}>
      <View style={styles.inlineContentContainer}>
        {IconComponent && (
          <View style={styles.inlineIcon}>
            <IconComponent size={16} color={resolvedIconColor} strokeWidth={2} />
          </View>
        )}
        <View style={styles.inlineTextContainer}>
          {title && message ? (
            <>
              <TextComponent variante="subtitle3" color={resolvedIconColor}>
                {title}
              </TextComponent>
              <TextComponent variante="body4" color={resolvedIconColor}>
                {message}
              </TextComponent>
            </>
          ) : title ? (
            <TextComponent variante="body4" color={resolvedIconColor}>
              {title}
            </TextComponent>
          ) : (
            <TextComponent variante="body4" color={resolvedIconColor}>
              {message}
            </TextComponent>
          )}
        </View>
      </View>

      {actionText && onAction && (
        <TouchableOpacity style={styles.inlineActionButton} onPress={onAction}>
          <TextComponent variante="caption" color={resolvedIconColor}>
            {actionText}
          </TextComponent>
        </TouchableOpacity>
      )}
    </View>
  );
};

/**
 * Alias pour utilisation simple avec le style centré
 */
export const CenteredStatusAlert = (props: StatusAlertProps) => (
  <StatusAlert {...props} centered={true} />
);

/**
 * Alias pour utilisation simple avec le style inline
 */
export const InlineStatusAlert = (props: StatusAlertProps) => (
  <StatusAlert {...props} centered={false} />
);
