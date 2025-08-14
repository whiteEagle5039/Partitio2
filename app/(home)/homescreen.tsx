import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Menu, 
  Search, 
  Library, 
  PenTool, 
  Download,
  Music,
  TrendingUp,
  Clock
} from 'lucide-react-native';
import { TextComponent } from '@/components/TextComponent';
import { SheetMusicCard } from '@/components/SheetMusicCard';
import { DrawerMenu } from '@/components/DrawerMenu';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useAppStore } from '@/stores/appStore';

import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const colors = useThemeColors();
  const router = useRouter();
  const { sheetMusic, setDrawerOpen, downloadedSheets } = useAppStore();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.card,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 16,
      backgroundColor: colors.card,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    logo: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    logoText: {
      marginLeft: 12,
      fontWeight: 'bold',
    },
    menuButton: {
      padding: 8,
    },
    scrollView: {
      flex: 1,
      backgroundColor:colors.background
    },
    quickActions: {
      flexDirection: 'row',
      paddingHorizontal: 20,
      paddingVertical: 24,
      gap: 12,
    },
    quickActionCard: {
      flex: 1,
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 16,
      alignItems: 'center',
      elevation: 2,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    quickActionIcon: {
      marginBottom: 8,
    },
    section: {
      paddingVertical: 16,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      marginBottom: 16,
    },
    seeAllButton: {
      padding: 8,
    },
    statsContainer: {
      flexDirection: 'row',
      paddingHorizontal: 20,
      paddingVertical: 16,
      gap: 16,
    },
    statCard: {
      flex: 1,
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      alignItems: 'center',
    },
    statNumber: {
      marginTop: 8,
    },
    horizontalScroll: {
      paddingLeft: 20,
    },
  });

  const quickActions = [
    {
      icon: Search,
      label: 'Rechercher',
      color: colors.primary,
      onPress: () => router.push('/search'),
    },
    {
      icon: PenTool,
      label: 'Composer',
      color: colors.primary2,
      onPress: () => router.push('/compose'),
    },
    {
      icon: Library,
      label: 'Bibliothèque',
      color: colors.primary3,
      onPress: () => router.push('/library'),
    },
  ];

  const recentSheets = sheetMusic.slice(0, 5);

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logo}>
            <LinearGradient
              colors={[colors.primary, colors.primary2]}
              style={{ borderRadius: 8, padding: 8 }}
            >
              <Music size={24} color="#FFFFFF" />
            </LinearGradient>
            <TextComponent style={styles.logoText} variante="subtitle1">
              Partitio
            </TextComponent>
          </View>
          
          <TouchableOpacity 
            style={styles.menuButton}
            onPress={() => setDrawerOpen(true)}
          >
            <Menu size={24} color={colors.icon} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Actions rapides */}
          <View style={styles.quickActions}>
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={styles.quickActionCard}
                onPress={action.onPress}
              >
                <action.icon 
                  size={28} 
                  color={action.color} 
                  style={styles.quickActionIcon} 
                />
                <TextComponent variante="body4" style={{ textAlign: 'center' }}>
                  {action.label}
                </TextComponent>
              </TouchableOpacity>
            ))}
          </View>

          {/* Statistiques */}
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <TrendingUp size={24} color={colors.primary} />
              <TextComponent variante="subtitle2" style={styles.statNumber}>
                {sheetMusic.length}
              </TextComponent>
              <TextComponent variante="caption" color={colors.text2}>
                Partitions
              </TextComponent>
            </View>
            <View style={styles.statCard}>
              <Download size={24} color={colors.primary2} />
              <TextComponent variante="subtitle2" style={styles.statNumber}>
                {downloadedSheets.length}
              </TextComponent>
              <TextComponent variante="caption" color={colors.text2}>
                Téléchargées
              </TextComponent>
            </View>
            <View style={styles.statCard}>
              <Clock size={24} color={colors.primary3} />
              <TextComponent variante="subtitle2" style={styles.statNumber}>
                12h
              </TextComponent>
              <TextComponent variante="caption" color={colors.text2}>
                Cette semaine
              </TextComponent>
            </View>
          </View>

          {/* Partitions récentes */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <TextComponent variante="subtitle1">
                Récemment ajoutées
              </TextComponent>
              <TouchableOpacity 
                style={styles.seeAllButton}
                onPress={() => router.push('/library')}
              >
                <TextComponent variante="body4" color={colors.primary}>
                  Voir tout
                </TextComponent>
              </TouchableOpacity>
            </View>
            
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.horizontalScroll}
            >
              {recentSheets.map((sheet:any) => (
                <SheetMusicCard
                  key={sheet.id}
                  title={sheet.title}
                  composer={sheet.composer}
                  thumbnail={sheet.thumbnail}
                  isDownloaded={sheet.isDownloaded}
                  onPress={() => console.log(`Ouvrir ${sheet.title}`)}
                />
              ))}
            </ScrollView>
          </View>

          {/* Partitions populaires */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <TextComponent variante="subtitle1">
                Tendances
              </TextComponent>
              <TouchableOpacity 
                style={styles.seeAllButton}
                onPress={() => router.push('/search')}
              >
                <TextComponent variante="body4" color={colors.primary}>
                  Explorer
                </TextComponent>
              </TouchableOpacity>
            </View>
            
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.horizontalScroll}
            >
              {sheetMusic.map((sheet:any) => (
                <SheetMusicCard
                  key={sheet.id}
                  title={sheet.title}
                  composer={sheet.composer}
                  thumbnail={sheet.thumbnail}
                  isDownloaded={sheet.isDownloaded}
                  onPress={() => console.log(`Ouvrir ${sheet.title}`)}
                />
              ))}
            </ScrollView>
          </View>
        </ScrollView>
      </SafeAreaView>

      <DrawerMenu />
    </View>
  );
}