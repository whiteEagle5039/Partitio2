import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { View } from 'react-native';
import 'react-native-reanimated';

import { AuthProvider } from '@/contexts/AuthContext';
import { useAppFonts } from '@/hooks/useAppFonts';
import { useThemeColors } from '@/hooks/useThemeColors';

// Empêche le splash natif de disparaître avant le chargement des polices.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const loaded = useAppFonts();
  const colors = useThemeColors();

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      {/* Fond global : évite les flashs blancs entre écrans, surtout en thème sombre. */}
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <Stack
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
            contentStyle: { backgroundColor: colors.background },
          }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(splash)" />
        </Stack>
      </View>
    </AuthProvider>
  );
}
