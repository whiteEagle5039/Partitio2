import { useStatusBarStyle } from '@/hooks/useThemeColors';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function ProtectedLayout() {
  const statusBarStyle = useStatusBarStyle();

  return (
  <>
    <Stack
      screenOptions={{ headerShown:false }}>
      <Stack.Screen name="(home)" />
      <Stack.Screen name="(screens)" />
    </Stack>
    <StatusBar style={statusBarStyle} translucent backgroundColor="transparent" />
  </>
    
  );
}
