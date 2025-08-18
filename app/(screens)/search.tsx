import React, { useState, useMemo } from 'react';
import { View, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Filter, ArrowLeft, Music, Play, User, FileText, WifiOff, CloudOff } from 'lucide-react-native';
import { TextComponent } from '@/components/TextComponent';
import { useThemeColors } from '@/hooks/useThemeColors';
import { Course, useAppStore } from '@/stores/appStore';
import { useRouter } from 'expo-router';

// Interface pour les résultats de recherche enrichis
interface SearchResult extends Course {
  categoryName: string;
  categoryColor: string;
  folderName?: string;
  author?: string;
}

export default function SearchScreen() {
  const colors = useThemeColors();
  const router = useRouter();
  const { 
    categories, 
    searchQuery, 
    setSearchQuery, 
    searchFilters, 
    setSearchFilters,
    isOnline,
    setOnline
  } = useAppStore();
  const [showFilters, setShowFilters] = useState(false);

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
      marginRight: 2,
      padding: 3,
    },
    searchContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.input,
      borderRadius: 12,
      paddingHorizontal: 16,
      marginRight: 2,
    },
    searchInput: {
      flex: 1,
      paddingVertical: 10,
      fontSize: 24,
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
      backgroundColor: colors.background,
    },
    resultsHeader: {
      paddingHorizontal: 20,
      marginBottom: 16,
    },
    resultsList: {
      paddingHorizontal: 20,
      paddingBottom: 20,
    },
    resultItem: {
      flexDirection: 'row',
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      alignItems: 'center',
      borderColor: colors.border,
      borderWidth: 1,
    },
    resultThumbnail: {
      width: 60,
      height: 60,
      borderRadius: 12,
      marginRight: 16,
      alignItems: 'center',
      justifyContent: 'center',
    },
    resultContent: {
      flex: 1,
    },
    resultTitle: {
      marginBottom: 4,
    },
    resultMeta: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: 8,
      marginTop: 8,
    },
    metaItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    metaSeparator: {
      width: 4,
      height: 4,
      borderRadius: 2,
      backgroundColor: colors.text2,
    },
    categoryBadge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      marginTop: 8,
    },
    statusBadge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      marginLeft: 'auto',
    },
    noResults: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 40,
    },
    noResultsIcon: {
      width: 80,
      height: 80,
      borderRadius: 40,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 20,
    },
    // Styles pour l'état hors-ligne
    offlineContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 40,
    },
    offlineCard: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 32,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
      marginHorizontal: 5,
    },
    offlineIcon: {
      width: 80,
      height: 80,
      borderRadius: 40,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 20,
    },
    offlineTitle: {
      textAlign: 'center',
      marginBottom: 12,
    },
    offlineSubtitle: {
      textAlign: 'center',
      marginBottom: 24,
      lineHeight: 20,
    },
    offlineButton: {
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 24,
      marginTop: 8,
    },
    connectionStatus: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 12,
      paddingVertical: 8,
      marginHorizontal: 20,
      marginVertical: 10,
      borderRadius: 20,
      borderWidth: 1,
      gap: 8,
    },
  });

  // Composant pour l'état hors-ligne
  const OfflineState = () => {
    return (
      <View style={styles.offlineContainer}>
        <View style={styles.offlineCard}>
          <View style={[styles.offlineIcon, { backgroundColor: `${colors.blueSingle}15` }]}>
            <WifiOff size={40} color={colors.blueSingle} />
          </View>
          <TextComponent variante="subtitle1" style={styles.offlineTitle}>
            Connexion requise
          </TextComponent>
          <TextComponent variante="body2" color={colors.text2} style={styles.offlineSubtitle}>
            La recherche n'est disponible qu'en ligne. Vérifiez votre connexion internet pour explorer notre bibliothèque.
          </TextComponent>
          <TouchableOpacity 
            style={[styles.offlineButton, { backgroundColor: colors.primary }]}
            onPress={() => setOnline(true)}
          >
            <TextComponent variante="body3" color="#FFFFFF">
              Réessayer
            </TextComponent>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // Génération des filtres dynamiques à partir des catégories

  // Composant pour l'indicateur de connexion (quand en ligne)
  const ConnectionStatus = () => {
    if (isOnline) return null;

    return (
      <View 
        style={[
          styles.connectionStatus, 
          { 
            backgroundColor: `${colors.blueSingle}20`,
            borderColor: colors.blueSingle,
          }
        ]}
      >
        <WifiOff size={16} color={colors.blueSingle} />
        <TextComponent variante="body4" color={colors.blueSingle}>
          Hors connexion
        </TextComponent>
      </View>
    );
  };
  const categoryFilters = useMemo(() => {
    const filters = ['Tous'];
    categories.forEach(cat => {
      if (cat.id !== '1') { // Exclure la catégorie "Tous"
        filters.push(cat.name);
      }
    });
    return filters;
  }, [categories]);

  const authorFilters = useMemo(() => {
    const authors = new Set<string>(['Tous']);
    categories.forEach(cat => {
      // Auteurs des dossiers
      cat.folders.forEach(folder => {
        if (folder.author) authors.add(folder.author);
        // Auteurs des cours dans les dossiers
        folder.courses.forEach(course => {
          if (course.author) authors.add(course.author);
          if (course.composer) authors.add(course.composer);
        });
      });
      // Auteurs des cours directs
      cat.courses?.forEach(course => {
        if (course.author) authors.add(course.author);
        if (course.composer) authors.add(course.composer);
      });
    });
    return Array.from(authors);
  }, [categories]);

  // Fonction pour collecter tous les cours avec leurs métadonnées
  const getAllSearchResults = useMemo((): SearchResult[] => {
    const results: SearchResult[] = [];
    
    categories.forEach(category => {
      if (category.id === '1') return; // Exclure "Tous"
      
      // Cours directs dans la catégorie
      if (category.courses) {
        category.courses.forEach(course => {
          results.push({
            ...course,
            categoryName: category.name,
            categoryColor: category.color,
            author: course.author || course.composer
          });
        });
      }
      
      // Cours dans les dossiers
      category.folders.forEach(folder => {
        folder.courses.forEach(course => {
          results.push({
            ...course,
            categoryName: category.name,
            categoryColor: category.color,
            folderName: folder.name,
            author: course.author || course.composer || folder.author
          });
        });
      });
    });
    
    return results;
  }, [categories]);

  // Filtrage des résultats
  const filteredResults = useMemo(() => {
    return getAllSearchResults.filter((result: SearchResult) => {
      const matchesQuery = !searchQuery || 
        result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (result.author && result.author.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (result.composer && result.composer.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (result.description && result.description.toLowerCase().includes(searchQuery.toLowerCase()));
        
      const matchesCategory = !searchFilters.genre || 
        searchFilters.genre === 'Tous' || 
        result.categoryName === searchFilters.genre;
        
      const matchesAuthor = !searchFilters.composer || 
        searchFilters.composer === 'Tous' || 
        result.author === searchFilters.composer ||
        result.composer === searchFilters.composer;
        
      return matchesQuery && matchesCategory && matchesAuthor;
    });
  }, [getAllSearchResults, searchQuery, searchFilters]);

  // Rendu d'un élément de résultat
  const renderResultItem = (result: SearchResult) => {
    const isLesson = result.categoryName === 'Leçons';
    
    return (
      <TouchableOpacity
        key={`${result.categoryName}-${result.folderName || 'direct'}-${result.id}`}
        style={styles.resultItem}
        onPress={() => console.log(`Ouvrir: ${result.title}`)}
      >
        <View style={[styles.resultThumbnail, { backgroundColor: `${result.categoryColor}15` }]}>
          <Play size={24} color={result.categoryColor} />
        </View>
        
        <View style={styles.resultContent}>
          <TextComponent variante="subtitle3" style={styles.resultTitle}>
            {result.title}
          </TextComponent>
          
          <TextComponent variante="body4" color={colors.text2}>
            {result.description}
          </TextComponent>
          
          {/* Métadonnées */}
          <View style={styles.resultMeta}>
            {result.author && (
              <>
                <View style={styles.metaItem}>
                  <User size={12} color={colors.text2} />
                  <TextComponent variante="caption" color={colors.text2}>
                    {result.author}
                  </TextComponent>
                </View>
                <View style={styles.metaSeparator} />
              </>
            )}
            
            {result.folderName && (
              <>
                <View style={styles.metaItem}>
                  <TextComponent variante="caption" color={colors.text2}>
                    {result.folderName}
                  </TextComponent>
                </View>
                <View style={styles.metaSeparator} />
              </>
            )}
            
            {/* Afficher la taille seulement si ce n'est PAS une leçon */}
            {!isLesson && result.fileSize && (
              <View style={styles.metaItem}>
                <FileText size={12} color={colors.text2} />
                <TextComponent variante="caption" color={colors.text2}>
                  {result.fileSize} MB
                </TextComponent>
              </View>
            )}
          </View>
          
          {/* Badge de catégorie */}
          <View style={[styles.categoryBadge, { backgroundColor: `${result.categoryColor}20` }]}>
            <TextComponent variante="caption" color={result.categoryColor}>
              {result.categoryName}
            </TextComponent>
          </View>
        </View>
        
        {/* Statut de téléchargement */}
        <View style={[
          styles.statusBadge,
          { backgroundColor: result.isDownloaded ? `${colors.primary}20` : `${colors.text2}20` }
        ]}>
          <View style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: result.isDownloaded ? colors.primary : colors.text2
          }} />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.container}>
        {/* Header avec recherche */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={32} color={colors.icon} />
          </TouchableOpacity>
          
          <View style={[styles.searchContainer, { opacity: isOnline ? 1 : 0.5 }]}>
            <Search size={30} color={colors.icon} />
            <TextInput
              style={styles.searchInput}
              placeholder={isOnline ? "Rechercher..." : "Hors connexion"}
              placeholderTextColor={colors.text2}
              value={searchQuery}
              onChangeText={setSearchQuery}
              editable={isOnline}
            />
          </View>
          
          <TouchableOpacity 
            style={styles.filterButton}
            onPress={() => setShowFilters(!showFilters)}
            disabled={!isOnline}
          >
            <Filter size={32} color={showFilters ? colors.primary : (isOnline ? colors.icon : colors.text2)} />
          </TouchableOpacity>
        </View>

        {/* Indicateur de connexion */}
        <ConnectionStatus />

        {/* Si hors-ligne, afficher l'état offline */}
        {!isOnline ? (
          <OfflineState />
        ) : (
          <>
            {/* Filtres */}
            {showFilters && (
              <View style={styles.filtersContainer}>
                {/* Filtre par catégorie */}
                <TextComponent variante="subtitle3" style={{ marginBottom: 12 }}>
                  Catégorie
                </TextComponent>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.filterRow}>
                    {categoryFilters.map((category) => (
                      <TouchableOpacity
                        key={category}
                        style={[
                          styles.filterChip,
                          searchFilters.genre === category && styles.filterChipActive
                        ]}
                        onPress={() => setSearchFilters({ genre: category === 'Tous' ? '' : category })}
                      >
                        <TextComponent 
                          variante="body2" 
                          color={searchFilters.genre === category ? '#FFFFFF' : colors.text}
                        >
                          {category}
                        </TextComponent>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>

                {/* Filtre par auteur */}
                <TextComponent variante="subtitle3" style={{ marginBottom: 12, marginTop: 16 }}>
                  Auteur
                </TextComponent>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.filterRow}>
                    {authorFilters.map((author) => (
                      <TouchableOpacity
                        key={author}
                        style={[
                          styles.filterChip,
                          searchFilters.composer === author && styles.filterChipActive
                        ]}
                        onPress={() => setSearchFilters({ composer: author === 'Tous' ? '' : author })}
                      >
                        <TextComponent 
                          variante="body2" 
                          color={searchFilters.composer === author ? '#FFFFFF' : colors.text}
                        >
                          {author}
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
                <TextComponent variante="body2" color={colors.text2}>
                  {filteredResults.length} résultat{filteredResults.length > 1 ? 's' : ''} trouvé{filteredResults.length > 1 ? 's' : ''}
                </TextComponent>
              </View>

              {filteredResults.length > 0 ? (
                <View style={styles.resultsList}>
                  {filteredResults.map((result) => renderResultItem(result))}
                </View>
              ) : (
                <View style={styles.noResults}>
                  <View style={[styles.noResultsIcon, { backgroundColor: `${colors.primary}15` }]}>
                    <Search size={40} color={colors.primary} />
                  </View>
                  <TextComponent variante="subtitle1" style={{ marginTop: 16, textAlign: 'center' }}>
                    Aucun résultat trouvé
                  </TextComponent>
                  <TextComponent variante="body2" color={colors.text2} style={{ textAlign: 'center', marginTop: 8 }}>
                    Essayez de modifier vos critères de recherche
                  </TextComponent>
                </View>
              )}
            </ScrollView>
          </>
        )}
      </SafeAreaView>
    </View>
  );
}