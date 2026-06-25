import React from 'react';
import { View, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { LucideIcon } from 'lucide-react-native';
import { TextComponent } from '@/components/uxComponents/TextComponent';
import { useThemeColors } from '@/hooks/useThemeColors';

export type AlertType = 'info' | 'warning' | 'error' | 'success';

interface AlertCardProps {
  type?: AlertType;
  icon?: LucideIcon;
  title?: string;
  message?: string;
  actionText?: string;
  onAction?: () => void;
  onClose?: () => void;
  visible?: boolean;
  containerStyle?: ViewStyle;
  customColor?: string;
}

const getColorByType = (type: AlertType, colors: any): string => {
  switch (type) {
    case 'warning':
      return '#F59E0B'; // Orange
    case 'error':
      return '#EF4444'; // Red
    case 'success':
      return '#10B981'; // Green
    case 'info':
    default:
      return colors.blueSingle; // Default blue
  }
};

export const AlertCard: React.FC<AlertCardProps> = ({
  type = 'info',
  icon: IconComponent,
  title,
  message,
  actionText,
  onAction,
  onClose,
  visible = true,
  containerStyle,
  customColor,
}) => {
  const colors = useThemeColors();

  if (!visible) return null;

  const alertColor = customColor || getColorByType(type, colors);

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 12,
      marginHorizontal: 20,
      marginBottom: 12,
      borderRadius: 12,
      borderWidth: 1,
      backgroundColor: `${alertColor}15`,
      borderColor: alertColor,
    },
    contentContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    textContainer: {
      flex: 1,
    },
    title: {
      marginBottom: title && message ? 4 : 0,
    },
    actionContainer: {
      marginLeft: 12,
      paddingLeft: 12,
      borderLeftWidth: 1,
      borderLeftColor: `${alertColor}30`,
    },
    actionButton: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 6,
      backgroundColor: `${alertColor}20`,
    },
    actionText: {
      textAlign: 'center',
    },
  });

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.contentContainer}>
        {IconComponent && (
          <IconComponent size={20} color={alertColor} strokeWidth={2} />
        )}
        <View style={styles.textContainer}>
          {title && (
            <TextComponent
              variante="subtitle3"
              color={alertColor}
              style={[styles.title, { fontWeight: '600' }]}
            >
              {title}
            </TextComponent>
          )}
          {message && (
            <TextComponent
              variante="body4"
              color={alertColor}
            >
              {message}
            </TextComponent>
          )}
        </View>
      </View>

      {(actionText && onAction) || onClose ? (
        <View style={styles.actionContainer}>
          {actionText && onAction && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={onAction}
            >
              <TextComponent
                variante="caption"
                color={alertColor}
                style={[styles.actionText, { fontWeight: '600' }]}
              >
                {actionText}
              </TextComponent>
            </TouchableOpacity>
          )}
        </View>
      ) : null}
    </View>
  );
};

/**
 * Prédéfinis pour usage rapide
 */

export const InfoAlert = (props: Omit<AlertCardProps, 'type'>) => (
  <AlertCard type="info" {...props} />
);

export const WarningAlert = (props: Omit<AlertCardProps, 'type'>) => (
  <AlertCard type="warning" {...props} />
);

export const ErrorAlert = (props: Omit<AlertCardProps, 'type'>) => (
  <AlertCard type="error" {...props} />
);

export const SuccessAlert = (props: Omit<AlertCardProps, 'type'>) => (
  <AlertCard type="success" {...props} />
);
