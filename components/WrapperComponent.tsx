import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';

import { getDrawerWidth } from '@/constants/layout';
import { useAppStore } from '@/stores/appStore';
import { DrawerMenu } from './musicComponents/DrawerMenu';

interface WrapperComponentProps {
  children: React.ReactNode;
  showDrawer?: boolean; // Option pour désactiver le drawer sur certaines pages
}

/**
 * Enveloppe d'écran gérant le tiroir « push » : le contenu glisse vers la
 * gauche exactement de la largeur du tiroir, calculée à partir de la fenêtre
 * courante (rotation et multi-fenêtre inclus).
 */
export function WrapperComponent({ children, showDrawer = true }: WrapperComponentProps) {
  const { isDrawerOpen, setDrawerOpen } = useAppStore();
  const { width } = useWindowDimensions();
  const drawerWidth = getDrawerWidth(width);

  const progress = useRef(new Animated.Value(0)).current;
  const open = showDrawer && isDrawerOpen;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: open ? 1 : 0,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [open, progress]);

  const translateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -drawerWidth],
  });

  const overlayOpacity = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.contentContainer, { transform: [{ translateX }] }]}>
        {children}

        {/* Voile de fermeture : n'intercepte les gestes que tiroir ouvert. */}
        {open && (
          <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]} pointerEvents="auto">
            <Pressable
              style={StyleSheet.absoluteFill}
              onPress={() => setDrawerOpen(false)}
              accessibilityRole="button"
              accessibilityLabel="Fermer le menu"
            />
          </Animated.View>
        )}
      </Animated.View>

      {showDrawer && <DrawerMenu />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  contentContainer: {
    flex: 1,
    width: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    zIndex: 999,
  },
});
