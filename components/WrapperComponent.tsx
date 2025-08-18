import React, { useEffect, useRef } from 'react';
import { View, Animated, Dimensions, TouchableOpacity, StyleSheet } from 'react-native';
import { DrawerMenu } from './DrawerMenu';
import { useAppStore } from '@/stores/appStore';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DRAWER_WIDTH = 230;

interface WrapperComponentProps {
  children: React.ReactNode;
  showDrawer?: boolean; // Option pour désactiver le drawer sur certaines pages
}

export function WrapperComponent({ children, showDrawer = true }: WrapperComponentProps) {
  const { isDrawerOpen, setDrawerOpen } = useAppStore();
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isDrawerOpen ? -DRAWER_WIDTH : 0, // Négatif pour pousser vers la gauche
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isDrawerOpen]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'row',
    },
    contentContainer: {
      flex: 1,
      width: SCREEN_WIDTH,
    },
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      zIndex: 999,
    },
  });

  return (
    <View style={styles.container}>
      {/* Contenu principal animé */}
      <Animated.View style={[styles.contentContainer, { transform: [{ translateX: slideAnim }] }]}>
        {children}
        
        {/* Overlay pour fermer le drawer */}
        {isDrawerOpen && showDrawer && (
          <TouchableOpacity 
            style={styles.overlay}
            onPress={() => setDrawerOpen(false)}
            activeOpacity={1}
          />
        )}
      </Animated.View>

      {/* Drawer Menu à droite */}
      {showDrawer && <DrawerMenu />}
    </View>
  );
}