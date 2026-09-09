import { LucideIcon } from 'lucide-react-native';
import React from 'react';
import { ViewStyle } from 'react-native';

import { AlertCard } from './AlertCard';
import { EmptyState } from './EmptyState';

interface StatusAlertProps {
  icon?: LucideIcon;
  title?: string;
  message?: string;
  actionText?: string;
  onAction?: () => void;
  visible?: boolean;
  containerStyle?: ViewStyle;
  /** `true` : bloc centré plein écran. `false` (défaut) : bandeau compact. */
  centered?: boolean;
  iconColor?: string;
}

/**
 * Deux présentations d'un même message d'état, construites sur les composants
 * partagés : bandeau compact (`AlertCard`) ou bloc centré (`EmptyState`).
 */
export const StatusAlert: React.FC<StatusAlertProps> = ({
  icon,
  title,
  message,
  actionText,
  onAction,
  visible = true,
  containerStyle,
  centered = false,
  iconColor,
}) => {
  if (!visible) return null;

  if (centered) {
    return (
      <EmptyState
        icon={icon}
        title={title ?? ''}
        subtitle={message}
        actionText={actionText}
        onActionPress={onAction}
        accent={iconColor}
        style={containerStyle}
      />
    );
  }

  return (
    <AlertCard
      icon={icon}
      title={title}
      message={message}
      actionText={actionText}
      onAction={onAction}
      tone={iconColor}
      containerStyle={containerStyle}
    />
  );
};

/** Alias : version centrée. */
export const CenteredStatusAlert = (props: StatusAlertProps) => (
  <StatusAlert {...props} centered />
);

/** Alias : version compacte. */
export const InlineStatusAlert = (props: StatusAlertProps) => (
  <StatusAlert {...props} centered={false} />
);

export default StatusAlert;
