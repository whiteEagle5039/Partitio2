import { usePathname, useRouter } from 'expo-router';
import {
    HardDrive,
    Library,
    PenTool,
    Search,
    Settings,
    User,
    X
} from 'lucide-react-native';
import React, { useEffect, useRef } from 'react';
import { Animated, ScrollView, StyleSheet, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MIN_TOUCH_TARGET, elevation, getDrawerWidth, touchSlop } from '@/constants/layout';
import { useResponsive } from '@/hooks/useResponsive';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useAppStore } from '@/stores/appStore';
import { TextComponent } from '../uxComponents/TextComponent';

const menuItems = [
  { icon: Search, label: 'Recherche', route: '/search' },
  { icon: Library, label: 'Bibliothèque', route: '/library' },
  { icon: PenTool, label: 'Composition', route: '/compose' },
  { icon: HardDrive, label: 'Téléchargements', route: '/downloads' },
  { icon: User, label: 'Profil', route: '/profile' },
  { icon: Settings, label: 'Paramètres', route: '/setting' },
];

export function DrawerMenu() {
  const colors = useThemeColors();
  const { spacing, radius, icon } = useResponsive();
  const { user, isDrawerOpen, setDrawerOpen } = useAppStore();
  const router = useRouter();
  const pathname = usePathname();

  const { width } = useWindowDimensions();
  const drawerWidth = getDrawerWidth(width);

  // Commence hors écran, à droite.
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: isDrawerOpen ? 1 : 0,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [isDrawerOpen, progress]);

  const translateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [drawerWidth, 0],
  });

  const styles = StyleSheet.create({
    drawer: {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      width: drawerWidth,
      backgroundColor: colors.card,
      zIndex: 1001,
      borderTopLeftRadius: radius.xl,
      borderBottomLeftRadius: radius.xl,
      overflow: 'hidden',
      ...elevation(3),
    },
    header: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    closeButton: {
      minWidth: MIN_TOUCH_TARGET,
      minHeight: MIN_TOUCH_TARGET,
      alignItems: 'center',
      justifyContent: 'center',
    },
    userInfo: {
      flex: 1,
      minWidth: 0,
    },
    menuItems: {
      flex: 1,
    },
    menuContent: {
      paddingVertical: spacing.xs,
      paddingHorizontal: spacing.xs,
      gap: spacing.xxs,
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      minHeight: MIN_TOUCH_TARGET,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.sm,
      borderRadius: radius.md,
    },
    menuItemActive: {
      backgroundColor: `${colors.primary}18`,
    },
    storageSection: {
      paddingHorizontal: spacing.md,
      paddingTop: spacing.sm,
      paddingBottom: spacing.md,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.border,
      gap: spacing.xxs,
    },
    storageBar: {
      height: 6,
      backgroundColor: colors.muted,
      borderRadius: radius.pill,
      marginTop: spacing.xs,
      overflow: 'hidden',
    },
    storageProgress: {
      height: '100%',
      backgroundColor: colors.primary,
      borderRadius: radius.pill,
    },
  });

  const handleMenuItemPress = (route: string) => {
    setDrawerOpen(false);
    router.push(route as any);
  };

  const storagePercentage = user
    ? Math.min(100, Math.max(0, (user.storageUsed / user.storageLimit) * 100))
    : 0;

  return (
    <Animated.View
      style={[styles.drawer, { transform: [{ translateX }] }]}
      pointerEvents={isDrawerOpen ? 'auto' : 'none'}
      accessibilityViewIsModal={isDrawerOpen}
    >
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'right', 'bottom']}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setDrawerOpen(false)}
            hitSlop={touchSlop}
            accessibilityRole="button"
            accessibilityLabel="Fermer le menu"
          >
            <X size={icon.lg} color={colors.icon} />
          </TouchableOpacity>

          <View style={styles.userInfo}>
            <TextComponent variante="subtitle2" color={colors.text} numberOfLines={1}>
              {user?.name || 'Utilisateur'}
            </TextComponent>
            <TextComponent variante="body5" color={colors.text2} numberOfLines={1}>
              {user?.email || 'Espace de travail'}
            </TextComponent>
          </View>
        </View>

        <ScrollView
          style={styles.menuItems}
          contentContainerStyle={styles.menuContent}
          showsVerticalScrollIndicator={false}
        >
          {menuItems.map((item) => {
            const isActive = pathname === item.route;

            return (
              <TouchableOpacity
                key={item.route}
                style={[styles.menuItem, isActive && styles.menuItemActive]}
                onPress={() => handleMenuItemPress(item.route)}
                accessibilityRole="button"
                accessibilityState={{ selected: isActive }}
              >
                <item.icon size={icon.md} color={isActive ? colors.primary : colors.icon} />
                <TextComponent
                  variante="subtitle3"
                  color={isActive ? colors.primary : colors.text}
                  numberOfLines={1}
                  style={{ flex: 1 }}
                >
                  {item.label}
                </TextComponent>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={styles.storageSection}>
          <TextComponent variante="subtitle4" color={colors.text}>
            Stockage utilisé
          </TextComponent>
          <TextComponent variante="body5" color={colors.text2}>
            {user?.storageUsed || 0} MB / {user?.storageLimit || 100} MB
          </TextComponent>
          <View style={styles.storageBar}>
            <View style={[styles.storageProgress, { width: `${storagePercentage}%` }]} />
          </View>
        </View>
      </SafeAreaView>
    </Animated.View>
  );
}
