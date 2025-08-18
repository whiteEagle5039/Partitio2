import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Menu, 
  TableConfig,
  Search, 
  Library, 
  PenTool, 
  Music,
} from 'lucide-react-native';
import { TextComponent, TextComponentHeading } from '@/components/TextComponent';
import { SheetMusicCard } from '@/components/SheetMusicCard';
import { WrapperComponent } from '@/components/WrapperComponent';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useAppStore } from '@/stores/appStore';
import { useRouter } from 'expo-router';
import EmptyIcon from '@/components/EmptyIcon';

export default function HomeScreen() {
  const colors = useThemeColors();
  const router = useRouter();
  const { sheetMusic, setDrawerOpen, downloadedSheets, isDrawerOpen } = useAppStore();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.card,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 10,
      paddingVertical: 10,
      backgroundColor: colors.card,
    // //   elevation: 2,
    // //   shadowColor: '#000',
    //   shadowOffset: { width: 0, height: 2 },
    //   shadowOpacity: 0.1,
    //   shadowRadius: 4,
    },
    logo: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    logoText: {
      marginLeft: 12,
    },
    menuButton: {
      padding: 8,
    },
    scrollView: {
      flex: 1,
      backgroundColor: colors.background
    },
    quickActions: {
      flexDirection: 'column',
      paddingHorizontal: 20,
      paddingVertical: 24,
      gap: 12,
    },
    quickActionCard: {
      flex: 1,
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 15,
      gap: 12,
      flexDirection: 'row',
      alignItems: 'center',
      textAlign: 'center',
      borderColor: colors.border,
      borderWidth:1,

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
    horizontalScroll: {
      paddingLeft: 20,
    },
    emptyWrapper: {
      width: '100%',         
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 20,
      flexDirection:'row', 
      gap:'20'
    },
    
  });

  const quickActions = [
    {
      icon: Search,
      label: 'Rechercher',
      color: colors.primary2,
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
      color: colors.primary2,
      onPress: () => router.push('/library'),
    },
  ];

  const recentSheets = sheetMusic.slice(0, 5);

  return (
    <WrapperComponent>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logo}>
            {/* <LinearGradient
              colors={[colors.primary, colors.primary2]}
              style={{ borderRadius: 8, padding: 8 }}
            >
              <Music size={24} color="#FFFFFF" />
            </LinearGradient> */}
              {/* <Music size={24} color="#333" /> */}
            <TextComponent variante='body1'  style={styles.logoText}>
              Partitio
            </TextComponent>
            

          </View>
          
          <TouchableOpacity 
            style={styles.menuButton}
            onPress={() => setDrawerOpen(!isDrawerOpen)}
          >
            <Menu size={32} color={colors.icon} />
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
                  size={32} 
                  color={action.color} 
                  style={styles.quickActionIcon} 
                />
                <TextComponent variante="subtitle1" style={{ textAlign: 'center' }}>
                  {action.label}
                </TextComponent>
              </TouchableOpacity>
            ))}
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
                <TextComponent variante="body3" color={colors.primary}>
                  Explorer
                </TextComponent>
              </TouchableOpacity>
            </View>
            
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.horizontalScroll}
            >
              {sheetMusic.map((sheet: any) => (
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

           {/* Partitions récentes */}
           <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <TextComponent variante="subtitle1">
                Récemment ajoutées
              </TextComponent>
              {/* <TouchableOpacity 
                style={styles.seeAllButton}
                onPress={() => router.push('/library')}
              >
                <TextComponent variante="body4" color={colors.primary}>
                  Voir tout
                </TextComponent>
              </TouchableOpacity> */}
            </View>
            
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.horizontalScroll}
            >
              {recentSheets && recentSheets.length > 0 ? (
                recentSheets.map((sheet: any) => (
                  <SheetMusicCard
                    key={sheet.id}
                    title={sheet.title}
                    composer={sheet.composer}
                    thumbnail={sheet.thumbnail}
                    isDownloaded={sheet.isDownloaded}
                    onPress={() => console.log(`Ouvrir ${sheet.title}`)}
                  />
                ))
              ) : (
                <View style={styles.emptyWrapper}>
                  <EmptyIcon width={64} height={64}/>
                  <TextComponent variante="body3" color={colors.primary} style={{ marginTop: 8 }}>
                    Aucune partition récente
                  </TextComponent>
                </View>
              )}
            </ScrollView>
          </View>
        </ScrollView>
      </SafeAreaView>
    </WrapperComponent>
  );
}