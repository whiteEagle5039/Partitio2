// src/styles/themes.ts
import { DefaultTheme, DarkTheme, Theme } from "@react-navigation/native";

export const lightTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "#FFFFFF",
    text: "#000000",
    primary: "#1E90FF",
  },
};

export const darkTheme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: "#000000",
    text: "#FFFFFF",
    primary: "#1E90FF",
  },
};
