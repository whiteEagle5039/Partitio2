import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Filter, ArrowLeft } from 'lucide-react-native';
import { TextComponent } from '@/components/TextComponent';
import { SheetMusicCard } from '@/components/SheetMusicCard';
import { useThemeColors } from '@/hooks/useThemeColors';
import { SheetMusic, useAppStore } from '@/stores/appStore';
import { useRouter } from 'expo-router';

export default function SearchScreen() {
  const colors = useThemeColors();
  const router = useRouter();
  const { sheetMusic, searchQuery, setSearchQuery, searchFilters, setSearchFilters } = useAppStore();
  const [showFilters, setShowFilters] = useState(false);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 16,
      backgroundColor: colors.card,
      elevation: 2,
    },
    backButton: {
      marginRight: 16,
      padding: 8,
    },
    searchContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.input,
      borderRadius: 12,
      paddingHorizontal: 16,
      marginRight: 12,
    },
    searchInput: {
      flex: 1,
      paddingVertical: 12,
      fontSize: 16,
      color: colors.text,
    },
    filterButton: {
      padding: 8,
    },
    filtersContainer: {
      backgroundColor: colors.card,
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    filterRow: {
      flexDirection: 'row',
      gap: 12,
      marginBottom: 12,
    },
    filterChip: {
      backgroundColor: colors.muted,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
    },
    filterChipActive: {
      backgroundColor: colors.primary,
    },
    content: {
      flex: 1,
      paddingTop: 16,
    },
    resultsHeader: {
      paddingHorizontal: 20,
      marginBottom: 16,
    },
    resultsGrid: {
      paddingHorizontal: 20,
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 16,
    },
    gridCard: {
      width: '47%',
    },
    noResults: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 40,
    },
  });

  const genres = ['Tous', 'Classique', 'Jazz', 'Pop', 'Rock', 'Blues'];
  const difficulties = ['Tous', 'Débutant', 'Intermédiaire', 'Avancé'];

  const filteredSheets = sheetMusic.filter((sheet: SheetMusic) => {
    const matchesQuery = sheet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        sheet.composer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = !searchFilters.genre || searchFilters.genre === 'Tous' || 
                        sheet.genre === searchFilters.genre;
    const matchesDifficulty = !searchFilters.difficulty || searchFilters.difficulty === 'Tous' || 
                             sheet.difficulty === searchFilters.difficulty;
    
    return matchesQuery && matchesGenre && matchesDifficulty;
  });

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.container}>
        {/* Header avec recherche */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={colors.icon} />
          </TouchableOpacity>
          
          <View style={styles.searchContainer}>
            <Search size={20} color={colors.icon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Rechercher des partitions..."
              placeholderTextColor={colors.text2}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          
          <TouchableOpacity 
            style={styles.filterButton}
            onPress={() => setShowFilters(!showFilters)}
          >
            <Filter size={24} color={showFilters ? colors.primary : colors.icon} />
          </TouchableOpacity>
        </View>

        {/* Filtres */}
        {showFilters && (
          <View style={styles.filtersContainer}>
            <TextComponent variante="subtitle3" style={{ marginBottom: 12 }}>
              Genre
            </TextComponent>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.filterRow}>
                {genres.map((genre) => (
                  <TouchableOpacity
                    key={genre}
                    style={[
                      styles.filterChip,
                      searchFilters.genre === genre && styles.filterChipActive
                    ]}
                    onPress={() => setSearchFilters({ genre: genre === 'Tous' ? '' : genre })}
                  >
                    <TextComponent 
                      variante="body4" 
                      color={searchFilters.genre === genre ? colors.primaryForeground : colors.text}
                    >
                      {genre}
                    </TextComponent>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            <TextComponent variante="subtitle3" style={{ marginBottom: 12, marginTop: 16 }}>
              Difficulté
            </TextComponent>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.filterRow}>
                {difficulties.map((difficulty) => (
                  <TouchableOpacity
                    key={difficulty}
                    style={[
                      styles.filterChip,
                      searchFilters.difficulty === difficulty && styles.filterChipActive
                    ]}
                    onPress={() => setSearchFilters({ difficulty: difficulty === 'Tous' ? '' : difficulty })}
                  >
                    <TextComponent 
                      variante="body4" 
                      color={searchFilters.difficulty === difficulty ? colors.primaryForeground : colors.text}
                    >
                      {difficulty}
                    </TextComponent>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        )}

        {/* Résultats */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.resultsHeader}>
            <TextComponent variante="body3" color={colors.text2}>
              {filteredSheets.length} résultat{filteredSheets.length > 1 ? 's' : ''} trouvé{filteredSheets.length > 1 ? 's' : ''}
            </TextComponent>
          </View>

          {filteredSheets.length > 0 ? (
            <View style={styles.resultsGrid}>
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
            <View style={styles.noResults}>
              <Search size={48} color={colors.text2} />
              <TextComponent variante="subtitle2" style={{ marginTop: 16, textAlign: 'center' }}>
                Aucun résultat trouvé
              </TextComponent>
              <TextComponent variante="body4" color={colors.text2} style={{ textAlign: 'center', marginTop: 8 }}>
                Essayez de modifier vos critères de recherche
              </TextComponent>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}