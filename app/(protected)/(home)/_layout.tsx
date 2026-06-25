import { useStatusBarStyle } from '@/hooks/useThemeColors';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function HomeLayout() {
  const statusBarStyle = useStatusBarStyle();

  return (
  <>
    <Stack
      screenOptions={{ headerShown:false }}>
      <Stack.Screen name="homescreen" />
    </Stack>
    <StatusBar style={statusBarStyle} translucent backgroundColor="transparent" />
  </>
  );
}