// components/AuthGuard.tsx
import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useRouter, useSegments } from 'expo-router';
import { useAppStore } from '@/stores/appStore';
import { useThemeColors } from '@/hooks/useThemeColors';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAppStore();
  const segments = useSegments();
  const router = useRouter();
  const colors = useThemeColors();

  useEffect(() => {
    const inAuthGroup = segments[0] === '(auth)';
    const inProtectedGroup = segments[0] === '(protected)' || segments[0] === 'homescreen';

    if (!isAuthenticated && inProtectedGroup) {
      // Rediriger vers l'authentification si non connecté
      router.replace('/email');
    } else if (isAuthenticated && inAuthGroup) {
      // Rediriger vers l'app si déjà connecté
      router.replace('/homescreen');
    }
  }, [isAuthenticated, segments, router]);

  // Afficher un écran de chargement pendant la vérification
  if (isAuthenticated === undefined) {
    return (
      <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: colors.background 
      }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return <>{children}</>;
}