// src/styles/themes.ts
import { DarkTheme, DefaultTheme, type Theme } from "@react-navigation/native";

import { color } from "@/constants/color";

/**
 * Thèmes React Navigation dérivés de la palette de l'application, pour que les
 * fonds de navigation, séparateurs et accents restent identiques aux écrans.
 */
export const lightTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: color.light.background,
    card: color.light.card,
    text: color.light.text,
    border: color.light.border,
    primary: color.light.primary,
    notification: color.light.accent,
  },
};

export const darkTheme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: color.dark.background,
    card: color.dark.card,
    text: color.dark.text,
    border: color.dark.border,
    primary: color.dark.primary,
    notification: color.dark.accent,
  },
};
