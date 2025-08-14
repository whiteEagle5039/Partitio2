import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function ScreensLayout() {
  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="search" />
        <Stack.Screen name="library" />
        <Stack.Screen name="downloads" />
        <Stack.Screen name="compose" />
        <Stack.Screen name="profile" />
        <Stack.Screen name="setting" />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}