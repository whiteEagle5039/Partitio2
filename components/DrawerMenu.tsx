import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
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

export function DrawerMenu() {
  const colors = useThemeColors();
  const { user, isDrawerOpen, setDrawerOpen } = useAppStore();
  const router = useRouter();

  const styles = StyleSheet.create({
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 1000,
    },
    drawer: {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      width: 280,
      backgroundColor: colors.card,
      zIndex: 1001,
      elevation: 16,
      shadowColor: '#000',
      shadowOffset: { width: 2, height: 0 },
      shadowOpacity: 0.25,
      shadowRadius: 8,
    },
    header: {
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    userInfo: {
      flex: 1,
    },
    closeButton: {
      padding: 8,
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
      height: 4,
      backgroundColor: colors.muted,
      borderRadius: 2,
      marginTop: 8,
    },
    storageProgress: {
      height: '100%',
      backgroundColor: colors.primary,
      borderRadius: 2,
    },
  });

  const menuItems = [
    { icon: Search, label: 'Recherche', route: '/search' },
    { icon: Library, label: 'Bibliothèque', route: '/library' },
    { icon: PenTool, label: 'Composition', route: '/compose' },
    { icon: HardDrive, label: 'Téléchargements', route: '/downloads' },
    { icon: User, label: 'Profil', route: '/profile' },
    { icon: Settings, label: 'Paramètres', route: '/settings' },
  ];

  const handleMenuItemPress = (route: string) => {
    setDrawerOpen(false);
    router.push(route as any);
  };

  const storagePercentage = user ? (user.storageUsed / user.storageLimit) * 100 : 0;

  if (!isDrawerOpen) return null;

  return (
    <>
      <TouchableOpacity 
        style={styles.overlay} 
        onPress={() => setDrawerOpen(false)}
        activeOpacity={1}
      />
      <SafeAreaView style={styles.drawer}>
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <View style={styles.avatar}>
              <User size={24} color={colors.primaryForeground} />
            </View>
            <TextComponent variante="subtitle2">
              {user?.name || 'Utilisateur'}
            </TextComponent>
            <TextComponent variante="caption" color={colors.text2}>
              {user?.email || 'user@partitio.com'}
            </TextComponent>
          </View>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={() => setDrawerOpen(false)}
          >
            <X size={24} color={colors.icon} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.menuItems}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={() => handleMenuItemPress(item.route)}
            >
              <item.icon size={24} color={colors.icon} style={styles.menuIcon} />
              <TextComponent variante="body2">
                {item.label}
              </TextComponent>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.storageSection}>
          <TextComponent variante="subtitle3" style={{ marginBottom: 4 }}>
            Stockage utilisé
          </TextComponent>
          <TextComponent variante="caption" color={colors.text2}>
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
    </>
  );
}