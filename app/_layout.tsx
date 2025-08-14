import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { AuthProvider } from '@/contexts/AuthContext';
// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    GgSansRegular: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

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
      <Stack
        screenOptions={{ headerShown:false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(home)" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(splash)"/>
        <Stack.Screen name="(screens)" />
      </Stack>
    </AuthProvider>
   
  );
}
