import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Grid, List, SortAsc, Folder } from 'lucide-react-native';
import { TextComponent } from '@/components/TextComponent';
import { SheetMusicCard } from '@/components/SheetMusicCard';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useAppStore } from '@/stores/appStore';
import { useRouter } from 'expo-router';
import { SheetMusic } from '@/stores/appStore';

export default function LibraryScreen() {
  const colors = useThemeColors();
  const router = useRouter();
  const { sheetMusic } = useAppStore();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState('Tous');

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.card,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 10,
      paddingVertical: 10,
      backgroundColor: colors.card,
      elevation: 2,
    },
    backButton: {
      marginRight: 16,
    },
    headerTitle: {
      flex: 1,
    },
    headerActions: {
      flexDirection: 'row',
      gap: 8,
    },
    actionButton: {
      padding: 8,
    },
    categoriesContainer: {
      backgroundColor: colors.background,
      paddingVertical: 16,
    },
    categoriesScroll: {
      paddingLeft: 20,
    },
    categoryChip: {
      backgroundColor: colors.muted,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      marginRight: 12,
    },
    categoryChipActive: {
      backgroundColor: colors.cardForeground,
    },
    content: {
      flex: 1,
      paddingTop: 10,
      backgroundColor: colors.background,
    },
    statsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      marginBottom: 20,
    },
    statItem: {
      alignItems: 'center',
    },
    gridContainer: {
      paddingHorizontal: 20,
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 16,
    },
    gridCard: {
      width: '47%',
    },
    listContainer: {
      paddingHorizontal: 20,
    },
    listItem: {
      flexDirection: 'row',
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      alignItems: 'center',
    },
    listThumbnail: {
      width: 60,
      height: 60,
      borderRadius: 8,
      marginRight: 16,
    },
    listContent: {
      flex: 1,
    },
    listTitle: {
      marginBottom: 4,
    },
    emptyState: {
      flex: 1,
      alignItems: 'center',
      paddingHorizontal: 40,
      paddingTop:'35%'
    },
  });

  const categories = ['Tous', 'Cantiques','Mes compositions', 'Chorale'];
  
  const filteredSheets = sheetMusic.filter((sheet: SheetMusic) => 
    selectedCategory === 'Tous' || sheet.genre === selectedCategory
  );

  const stats = {
    total: sheetMusic.length,
    downloaded: sheetMusic.filter((s:any) => s.isDownloaded).length,
    compositions: 3, // Nombre de compositions personnelles
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={colors.icon} />
          </TouchableOpacity>
          
          <View style={styles.headerTitle}>
            <TextComponent variante="subtitle1">
              Ma Bibliothèque
            </TextComponent>
          </View>
          
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.actionButton}>
              <SortAsc size={24} color={colors.icon} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            >
              {viewMode === 'grid' ? (
                <List size={24} color={colors.icon} />
              ) : (
                <Grid size={24} color={colors.icon} />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Catégories */}
        <View style={styles.categoriesContainer}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesScroll}
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryChip,
                  selectedCategory === category && styles.categoryChipActive
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <TextComponent 
                  variante="body4" 
                  color={selectedCategory === category ? colors.primaryForeground : colors.text}
                >
                  {category}
                </TextComponent>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Statistiques */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <TextComponent variante="subtitle1">{stats.total}</TextComponent>
              <TextComponent variante="caption" color={colors.text2}>Total</TextComponent>
            </View>
            <View style={styles.statItem}>
              <TextComponent variante="subtitle1">{stats.downloaded}</TextComponent>
              <TextComponent variante="caption" color={colors.text2}>Téléchargées</TextComponent>
            </View>
            <View style={styles.statItem}>
              <TextComponent variante="subtitle1">{stats.compositions}</TextComponent>
              <TextComponent variante="caption" color={colors.text2}>Compositions</TextComponent>
            </View>
          </View>

          {/* Contenu */}
          {filteredSheets.length > 0 ? (
            viewMode === 'grid' ? (
              <View style={styles.gridContainer}>
                {filteredSheets.map((sheet:SheetMusic) => (
                  <View key={sheet.id} style={styles.gridCard}>
                    <SheetMusicCard
                      title={sheet.title}
                      composer={sheet.composer}
                      thumbnail={sheet.thumbnail}
                      isDownloaded={sheet.isDownloaded}
                      onPress={() => console.log(`Ouvrir ${sheet.title}`)}
                    />
                  </View>
                ))}
              </View>
            ) : (
              <View style={styles.listContainer}>
                {filteredSheets.map((sheet: SheetMusic) => (
                  <TouchableOpacity key={sheet.id} style={styles.listItem}>
                    <View style={styles.listThumbnail}>
                      <Folder size={24} color={colors.primary} />
                    </View>
                    <View style={styles.listContent}>
                      <TextComponent variante="subtitle3" style={styles.listTitle}>
                        {sheet.title}
                      </TextComponent>
                      <TextComponent variante="caption" color={colors.text2}>
                        {sheet.composer} • {sheet.genre}
                      </TextComponent>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )
          ) : (
            <View style={styles.emptyState}>
              <Folder size={48} color={colors.text2} />
              <TextComponent variante="subtitle2" style={{ marginTop: 16, textAlign: 'center' }}>
                Vide comme l'air ...
              </TextComponent>
              {/* <TextComponent>( Vide comme l'air )..</TextComponent> */}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}