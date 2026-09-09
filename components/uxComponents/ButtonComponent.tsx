import { LucideIcon } from "lucide-react-native";
import React from "react";
import {
  ActivityIndicator,
  StyleProp,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

import { MIN_TOUCH_TARGET, elevation } from "@/constants/layout";
import { useResponsive } from "@/hooks/useResponsive";
import { useThemeColors } from "@/hooks/useThemeColors";
import { TextComponent, type TextVariant } from "./TextComponent";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "destructive";
export type ButtonSize = "sm" | "md" | "lg";

type ButtonComponentProps = {
  title: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: LucideIcon;
  /** Position de l'icône par rapport au libellé. */
  iconPosition?: "left" | "right";
  loading?: boolean;
  disabled?: boolean;
  /** Occupe toute la largeur disponible. */
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

/**
 * Bouton unique de l'application : mêmes hauteurs, mêmes rayons et mêmes
 * cibles tactiles partout, quelle que soit la taille d'écran.
 */
export function ButtonComponent({
  title,
  onPress,
  variant = "primary",
  size = "md",
  icon: Icon,
  iconPosition = "left",
  loading = false,
  disabled = false,
  fullWidth = false,
  style,
  textStyle,
}: ButtonComponentProps) {
  const colors = useThemeColors();
  const { spacing, radius, scale } = useResponsive();

  const sizing: Record<ButtonSize, { height: number; paddingH: number; text: TextVariant; icon: number }> = {
    sm: { height: scale(36), paddingH: spacing.sm, text: "body5", icon: scale(16) },
    md: { height: Math.max(MIN_TOUCH_TARGET, scale(48)), paddingH: spacing.lg, text: "subtitle3", icon: scale(18) },
    lg: { height: Math.max(MIN_TOUCH_TARGET, scale(56)), paddingH: spacing.xl, text: "subtitle2", icon: scale(20) },
  };

  const palette: Record<ButtonVariant, { background: string; border: string; label: string }> = {
    primary: { background: colors.primary, border: colors.primary, label: colors.primaryForeground },
    secondary: { background: colors.secondary, border: colors.secondary, label: colors.text },
    outline: { background: "transparent", border: colors.border, label: colors.text },
    ghost: { background: "transparent", border: "transparent", label: colors.primary },
    destructive: { background: colors.destructive, border: colors.destructive, label: colors.destructiveForeground },
  };

  const { height, paddingH, text, icon: iconSize } = sizing[size];
  const tone = palette[variant];
  const isInactive = disabled || loading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isInactive}
      activeOpacity={0.85}
      accessibilityRole="button"
      accessibilityState={{ disabled: isInactive, busy: loading }}
      style={[
        {
          height,
          paddingHorizontal: paddingH,
          borderRadius: radius.md,
          backgroundColor: tone.background,
          borderWidth: variant === "outline" ? 1 : 0,
          borderColor: tone.border,
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
          gap: spacing.xs,
          opacity: isInactive ? 0.55 : 1,
          alignSelf: fullWidth ? "stretch" : "flex-start",
          ...(variant === "primary" || variant === "destructive" ? elevation(1, tone.background) : null),
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={tone.label} />
      ) : (
        <>
          {Icon && iconPosition === "left" && <Icon size={iconSize} color={tone.label} />}
          <TextComponent variante={text} color={tone.label} numberOfLines={1} style={textStyle}>
            {title}
          </TextComponent>
          {Icon && iconPosition === "right" && <Icon size={iconSize} color={tone.label} />}
        </>
      )}
    </TouchableOpacity>
  );
}

/** Groupe de boutons qui passe en colonne quand la largeur manque. */
export function ButtonRow({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  const { spacing, isSmall } = useResponsive();

  return (
    <View
      style={[
        {
          flexDirection: isSmall ? "column" : "row",
          alignItems: isSmall ? "stretch" : "center",
          gap: spacing.sm,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

export default ButtonComponent;
