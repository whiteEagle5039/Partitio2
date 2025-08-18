import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Animated, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  User, 
  Settings, 
  HardDrive, 
  Library, 
  PenTool,
  Search,
  X
} from 'lucide-react-native';
import { TextComponent } from './TextComponent';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useAppStore } from '@/stores/appStore';
import { useRouter } from 'expo-router';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DRAWER_WIDTH = 300;

export function DrawerMenu() {
  const colors = useThemeColors();
  const { user, isDrawerOpen, setDrawerOpen } = useAppStore();
  const router = useRouter();
  const slideAnim = useRef(new Animated.Value(DRAWER_WIDTH)).current; // Commence à droite (hors écran)

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isDrawerOpen ? 0 : DRAWER_WIDTH, // 0 = visible, DRAWER_WIDTH = caché à droite
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isDrawerOpen]);

  const styles = StyleSheet.create({
    drawer: {
      position: 'absolute',
      top: 0,
      right: 0, // Position à droite
      bottom: 0,
      width: DRAWER_WIDTH,
      backgroundColor: colors.card,
      zIndex: 1001,
      elevation: 16,
      shadowColor: '#000',
      shadowOffset: { width: -2, height: 0 }, // Ombre vers la gauche
      shadowOpacity: 0.25,
      shadowRadius: 8,

      // Ajout de bord en haut à gauche
      borderTopLeftRadius: 30, 
    },
    header: {
      padding: 15,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap:14
    },
    userInfo: {
      flex: 1,
      flexDirection:'row'
    },
    closeButton: {
      padding: 5,
      paddingRight:0,
    },
    avatar: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 12,
    },
    menuItems: {
      flex: 1,
      paddingTop: 8,
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 16,
    },
    menuIcon: {
      marginRight: 16,
    },
    storageSection: {
      padding: 20,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    storageBar: {
      height: 6,
      backgroundColor: colors.muted,
      borderRadius: 2,
      marginTop: 8,
    },
    storageProgress: {
      height: '100%',
      backgroundColor: colors.cardForeground,
      borderRadius: 2,
    },
  });

  const menuItems = [
    { icon: Search, label: 'Recherche', route: '/search' },
    { icon: Library, label: 'Bibliothèque', route: '/library' },
    { icon: PenTool, label: 'Composition', route: '/compose' },
    { icon: HardDrive, label: 'Téléchargements', route: '/downloads' },
    { icon: User, label: 'Profil', route: '/profile' },
    { icon: Settings, label: 'Paramètres', route: '/setting' },
  ];

  const handleMenuItemPress = (route: string) => {
    setDrawerOpen(false);
    router.push(route as any);
  };

  const storagePercentage = user ? (user.storageUsed / user.storageLimit) * 100 : 0;

  return (
    <Animated.View style={[styles.drawer, { transform: [{ translateX: slideAnim }] }]}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={() => setDrawerOpen(false)}
          >
            <X size={32} color={colors.icon} />
          </TouchableOpacity>
          <View style={styles.userInfo} >
            <TextComponent variante="body0" color={colors.blueSingle}>
              {user?.name || 'Utilisateur'}
            </TextComponent>
            <TextComponent variante="body0">'s Work</TextComponent>
            {/* <TextComponent variante="caption" color={colors.text2}>
              {user?.email || 'user@partitio.com'}
            </TextComponent> */}
          </View>
        </View>

        <ScrollView style={styles.menuItems}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={() => handleMenuItemPress(item.route)}
            >
              <item.icon size={32} color={colors.primary} style={styles.menuIcon} />
              <TextComponent variante="subtitle1">
                {item.label}
              </TextComponent>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.storageSection}>
          <TextComponent variante="body2" color={colors.text2} style={{ marginBottom: 4 }}>
            Stockage utilisé
          </TextComponent>
          <TextComponent variante="body4" color={colors.blueSingle}>
            {user?.storageUsed || 0} MB / {user?.storageLimit || 100} MB
          </TextComponent>
          <View style={styles.storageBar}>
            <View 
              style={[
                styles.storageProgress, 
                { width: `${storagePercentage}%` }
              ]} 
            />
          </View>
        </View>
      </SafeAreaView>
    </Animated.View>
  );
}