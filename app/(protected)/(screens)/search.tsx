import { TextComponent } from '@/components/uxComponents/TextComponent';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useAppStore, type Folder } from '@/stores/appStore';
import { useCantiqueStorage } from '@/utils/CantiqueStorage';
import { useCompositionStorage } from '@/utils/CompositionStorage';
import { leconsLibrary } from '@/lecons';
import { router } from 'expo-router';
import { BookOpen, ChevronRight, FileText, Folder as FolderIcon, Music, Search, Edit3 } from 'lucide-react-native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type ResultKind = 'cantique' | 'lecon-folder' | 'lecon-content' | 'composition';

interface SearchResult {
  id: string;
  kind: ResultKind;
  title: string;
  subtitle?: string;
  description?: string;
  categoryName: string;
  categoryColor: string;
  composer?: string;
  folderName?: string;
  tags?: string[];
  number?: number;
  contentId?: string;
  folderId?: string;
  sourceLabel: string;
}

export default function SearchScreen() {
  const colors = useThemeColors();
  const { setCurrentCategory, setCurrentFolder } = useAppStore();
  const { getAllMetadata } = useCantiqueStorage();
  const { getAllCompositions } = useCompositionStorage();

  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSource, setSelectedSource] = useState<'Tous' | 'Cantiques' | 'Leçons' | 'Compositions'>('Tous');

  useEffect(() => {
    void loadSearchIndex();
  }, [loadSearchIndex]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 10,
      paddingVertical: 10,
      backgroundColor: colors.card,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    searchContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.input,
      borderRadius: 14,
      paddingHorizontal: 14,
      marginHorizontal: 2,
    },
    searchInput: {
      flex: 1,
      paddingVertical: 10,
      fontSize: 18,
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
      gap: 10,
      marginBottom: 12,
    },
    filterChip: {
      backgroundColor: colors.muted,
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 18,
    },
    filterChipActive: {
      backgroundColor: colors.primary,
    },
    content: {
      flex: 1,
    },
    resultsHeader: {
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 10,
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
      width: 56,
      height: 56,
      borderRadius: 14,
      marginRight: 14,
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
    metaBadge: {
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 999,
      backgroundColor: colors.muted,
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 32,
      paddingBottom: 48,
    },
    emptyIcon: {
      width: 84,
      height: 84,
      borderRadius: 42,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 18,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    sourceSummary: {
      flexDirection: 'row',
      gap: 10,
      paddingHorizontal: 20,
      paddingBottom: 12,
    },
    sourcePill: {
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 999,
      backgroundColor: colors.muted,
    },
  });

  const sourceFilters = ['Tous', 'Cantiques', 'Leçons', 'Compositions'] as const;

  const loadSearchIndex = useCallback(async () => {
    try {
      setLoading(true);

      const [cantiques, compositions] = await Promise.all([
        getAllMetadata(),
        getAllCompositions(),
      ]);

      const cantiqueResults: SearchResult[] = cantiques.map((cantique) => ({
        id: cantique.id,
        kind: 'cantique',
        title: cantique.title,
        subtitle: cantique.composer,
        description: cantique.tags?.length ? cantique.tags.join(', ') : cantique.category || 'Cantique',
        categoryName: 'Cantiques',
        categoryColor: '#10B981',
        composer: cantique.composer,
        number: cantique.number,
        tags: cantique.tags,
        sourceLabel: 'Cantique',
      }));

      const leconResults: SearchResult[] = leconsLibrary.flatMap((folder) => {
        const folderMatches: SearchResult = {
          id: folder.id,
          kind: 'lecon-folder',
          title: folder.name,
          subtitle: folder.author || 'Leçon',
          description: folder.description,
          categoryName: 'Leçons',
          categoryColor: '#3B82F6',
          composer: folder.author,
          folderId: folder.id,
          sourceLabel: 'Dossier',
        };

        const contentMatches = folder.content.map((content) => ({
          id: `${folder.id}-${content.id}`,
          kind: 'lecon-content' as const,
          title: content.title,
          subtitle: folder.name,
          description: content.description || content.content,
          categoryName: 'Leçons',
          categoryColor: '#3B82F6',
          composer: content.composer || content.author,
          folderName: folder.name,
          folderId: folder.id,
          contentId: content.id,
          sourceLabel: 'Cours',
        }));

        return [folderMatches, ...contentMatches];
      });

      const compositionResults: SearchResult[] = compositions.map((composition) => ({
        id: composition.id,
        kind: 'composition',
        title: composition.title,
        subtitle: composition.composer,
        description: 'Composition enregistrée dans l’app',
        categoryName: 'Compositions',
        categoryColor: '#F59E0B',
        composer: composition.composer,
        sourceLabel: 'Composition',
      }));

      setResults([...cantiqueResults, ...leconResults, ...compositionResults]);
    } catch (error) {
      console.error('❌ Erreur lors de l’indexation de recherche:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [getAllCompositions, getAllMetadata]);

  const normalize = (value: string) =>
    value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

  const filteredResults = useMemo(() => {
    const query = normalize(searchQuery.trim());

    return results.filter((result) => {
      const matchesSource = selectedSource === 'Tous' || result.categoryName === selectedSource;

      if (!matchesSource) return false;

      if (!query) return true;

      const haystack = [
        result.title,
        result.subtitle || '',
        result.description || '',
        result.composer || '',
        result.folderName || '',
        result.tags?.join(' ') || '',
        result.number?.toString() || '',
      ]
        .map(normalize)
        .join(' ');

      return haystack.includes(query);
    });
  }, [results, searchQuery, selectedSource]);

  const openResult = (result: SearchResult) => {
    if (result.kind === 'cantique') {
      router.push(`/cantiquePreview?id=${result.id}`);
      return;
    }

    if (result.kind === 'composition') {
      router.push(`/compositionPreview?id=${result.id}`);
      return;
    }

    const targetFolder = leconsLibrary.find((folder) => folder.id === result.folderId);
    const targetCategory = useAppStore.getState().categories.find((category) => category.id === '5') || null;

    if (targetCategory) {
      setCurrentCategory(targetCategory);
    }

    if (targetFolder) {
      setCurrentFolder(targetFolder as Folder);
    }

    router.push('/library');
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.searchContainer}>
            <Search size={24} color={colors.icon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Rechercher un cantique, une leçon ou une composition"
              placeholderTextColor={colors.text2}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCorrect={false}
              autoCapitalize="none"
              returnKeyType="search"
            />
          </View>

          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setShowFilters((value) => !value)}
          >
            <BookOpen size={28} color={showFilters ? colors.primary : colors.icon} />
          </TouchableOpacity>
        </View>

        {showFilters && (
          <View style={styles.filtersContainer}>
            <TextComponent variante="subtitle3" style={{ marginBottom: 12 }}>
              Filtrer par source
            </TextComponent>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.filterRow}>
                {sourceFilters.map((source) => (
                  <TouchableOpacity
                    key={source}
                    style={[
                      styles.filterChip,
                      selectedSource === source && styles.filterChipActive,
                    ]}
                    onPress={() => setSelectedSource(source)}
                  >
                    <TextComponent variante="body2" color={selectedSource === source ? '#FFFFFF' : colors.text}>
                      {source}
                    </TextComponent>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        )}

        <View style={styles.sourceSummary}>
          <View style={styles.sourcePill}>
            <TextComponent variante="caption" color={colors.text2}>
              {results.filter((item) => item.categoryName === 'Cantiques').length} cantiques
            </TextComponent>
          </View>
          <View style={styles.sourcePill}>
            <TextComponent variante="caption" color={colors.text2}>
              {results.filter((item) => item.categoryName === 'Leçons').length} leçons
            </TextComponent>
          </View>
          <View style={styles.sourcePill}>
            <TextComponent variante="caption" color={colors.text2}>
              {results.filter((item) => item.categoryName === 'Compositions').length} compositions
            </TextComponent>
          </View>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <TextComponent variante="body3" color={colors.text2} style={{ marginTop: 12 }}>
              Préparation de la recherche locale...
            </TextComponent>
          </View>
        ) : (
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.resultsHeader}>
              <TextComponent variante="body2" color={colors.text2}>
                {filteredResults.length} résultat{filteredResults.length > 1 ? 's' : ''} trouvé{filteredResults.length > 1 ? 's' : ''}
              </TextComponent>
            </View>

            {filteredResults.length > 0 ? (
              <View style={styles.resultsList}>
                {filteredResults.map((result) => (
                  <TouchableOpacity
                    key={`${result.kind}-${result.id}`}
                    style={styles.resultItem}
                    onPress={() => openResult(result)}
                    activeOpacity={0.75}
                  >
                    <View style={[styles.resultThumbnail, { backgroundColor: `${result.categoryColor}18` }]}>
                      {result.kind === 'cantique' ? (
                        <Music size={24} color={result.categoryColor} />
                      ) : result.kind === 'composition' ? (
                        <Edit3 size={24} color={result.categoryColor} />
                      ) : result.kind === 'lecon-folder' ? (
                        <FolderIcon size={24} color={result.categoryColor} />
                      ) : (
                        <FileText size={24} color={result.categoryColor} />
                      )}
                    </View>

                    <View style={styles.resultContent}>
                      <TextComponent variante="subtitle3" style={styles.resultTitle}>
                        {result.title}
                      </TextComponent>

                      {result.subtitle && (
                        <TextComponent variante="body4" color={colors.text2}>
                          {result.subtitle}
                        </TextComponent>
                      )}

                      {result.description && (
                        <TextComponent variante="body4" color={colors.text2} style={{ marginTop: 4 }}>
                          {result.description}
                        </TextComponent>
                      )}

                      <View style={styles.resultMeta}>
                        <View style={styles.metaBadge}>
                          <TextComponent variante="caption" color={result.categoryColor}>
                            {result.categoryName}
                          </TextComponent>
                        </View>

                        <View style={styles.metaBadge}>
                          <TextComponent variante="caption" color={colors.text2}>
                            {result.sourceLabel}
                          </TextComponent>
                        </View>

                        {result.kind === 'lecon-folder' || result.kind === 'lecon-content' ? (
                          <ChevronRight size={14} color={colors.text2} />
                        ) : null}
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <View style={styles.emptyState}>
                <View style={[styles.emptyIcon, { backgroundColor: `${colors.primary}15` }]}>
                  <Search size={40} color={colors.primary} />
                </View>
                <TextComponent variante="subtitle1" style={{ textAlign: 'center' }}>
                  Aucun résultat trouvé
                </TextComponent>
                <TextComponent variante="body2" color={colors.text2} style={{ textAlign: 'center', marginTop: 8 }}>
                  Essayez un autre mot-clé ou changez la source recherchée.
                </TextComponent>
              </View>
            )}
          </ScrollView>
        )}
      </SafeAreaView>
    </View>
  );
}
