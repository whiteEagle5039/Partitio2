import React from 'react';
import { View, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { LucideIcon } from 'lucide-react-native';
import { TextComponent } from '@/components/uxComponents/TextComponent';
import { useThemeColors } from '@/hooks/useThemeColors';

interface AlertCardProps {
  icon?: LucideIcon;
  title?: string;
  message?: string;
  actionText?: string;
  onAction?: () => void;
  visible?: boolean;
  containerStyle?: ViewStyle;
}

export const AlertCard: React.FC<AlertCardProps> = ({
  icon: IconComponent,
  title,
  message,
  actionText,
  onAction,
  visible = true,
  containerStyle,
}) => {
  const colors = useThemeColors();

  if (!visible) return null;

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 12,
      paddingVertical: 6,
      marginHorizontal: 20,
      marginBottom: 10,
      borderRadius: 20,
      borderWidth: 1,
      backgroundColor: `${colors.blueSingle}20`,
      borderColor: colors.blueSingle,
    },
    contentContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    textContainer: {
      flex: 1,
    },
    actionButton: {
      marginLeft: 8,
      paddingHorizontal: 12,
      paddingVertical: 4,
    },
  });

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.contentContainer}>
        {IconComponent && (
          <IconComponent size={16} color={colors.blueSingle} strokeWidth={2} />
        )}
        <View style={styles.textContainer}>
          {title && message ? (
            <>
              <TextComponent variante="subtitle3" color={colors.blueSingle}>
                {title}
              </TextComponent>
              <TextComponent variante="body4" color={colors.blueSingle}>
                {message}
              </TextComponent>
            </>
          ) : title ? (
            <TextComponent variante="body4" color={colors.blueSingle}>
              {title}
            </TextComponent>
          ) : (
            <TextComponent variante="body4" color={colors.blueSingle}>
              {message}
            </TextComponent>
          )}
        </View>
      </View>

      {actionText && onAction && (
        <TouchableOpacity style={styles.actionButton} onPress={onAction}>
          <TextComponent variante="caption" color={colors.blueSingle}>
            {actionText}
          </TextComponent>
        </TouchableOpacity>
      )}
    </View>
  );
};

/**
 * Alias pour utilisation simple
 */
export const Alert = AlertCard;

