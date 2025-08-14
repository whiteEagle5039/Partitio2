import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Music } from 'lucide-react-native';
import { TextComponent } from './TextComponent';
import { useThemeColors } from '@/hooks/useThemeColors';

export function Header() {
  const colors = useThemeColors();

  const styles = StyleSheet.create({
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 15,
      backgroundColor: `${colors.background}CC`,
      backdropFilter: 'blur(10px)',
    },
    logo: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    logoText: {
      marginLeft: 8,
      fontWeight: 'bold',
    },
    menu: {
      flexDirection: 'row',
      gap: 20,
    },
    menuItem: {
      padding: 8,
    },
  });

  return (
    <View style={styles.header}>
      <View style={styles.logo}>
        <Music size={28} color={colors.primary} />
        <TextComponent style={styles.logoText} variante="subtitle2">
          Partitio
        </TextComponent>
      </View>
      
      <View style={styles.menu}>
        <TouchableOpacity style={styles.menuItem}>
          <TextComponent variante="body3">Profil</TextComponent>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <TextComponent variante="body3">Explorer</TextComponent>
        </TouchableOpacity>
      </View>
    </View>
  );
}