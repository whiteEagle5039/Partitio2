import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useThemeColors } from '@/hooks/useThemeColors';

type SplashScreenIconProps = ViewProps & {
  fillColor?: string;
  width?: string | number;
  height?: string | number;
};

export function SplashScreenIcon({ style, fillColor, width = "64", height = "64" }: SplashScreenIconProps) {
  const themeColors = useThemeColors();

  // Utilise la couleur fournie ou celle du thème
  const color = fillColor || themeColors.icon;

  return (
    <View style={[styles.container, style]}>
      <Svg
        width={width}
        height={height}
        viewBox="0 0 1920 1920"
        fill="none"
      >
        <Path
          d="M960 0C430.645 0 0 430.645 0 960s430.645 960 960 960 960-430.645 960-960S1489.355 0 960 0"
          fill={color}
          fillRule="evenodd"
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SplashScreenIcon;
