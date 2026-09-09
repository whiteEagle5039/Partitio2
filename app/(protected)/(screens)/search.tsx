import { router } from 'expo-router';
import { ArrowLeft, BookOpen, ChevronRight, Edit3, FileText, Folder as FolderIcon, Music, Search, X } from 'lucide-react-native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

import { EmptyState } from '@/components/uxComponents/EmptyState';
import { Badge, ListItemCard } from '@/components/uxComponents/ListItemCard';
import { Content, Screen } from '@/components/uxComponents/Screen';
import { TextComponent } from '@/components/uxComponents/TextComponent';
import { MAX_FONT_SCALE, MIN_TOUCH_TARGET, touchSlop } from '@/constants/layout';
import { useListLayout } from '@/hooks/useListLayout';
import { useResponsive } from '@/hooks/useResponsive';
import { useThemeColors } from '@/hooks/useThemeColors';
import { leconsLibrary } from '@/lecons';
import { useAppStore, type Folder } from '@/stores/appStore';
import { useCantiqueStorage } from '@/utils/CantiqueStorage';
import { useCompositionStorage } from '@/utils/CompositionStorage';

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

const sourceFilters = ['Tous', 'Cantiques', 'Leçons', 'Compositions'] as const;

const normalize = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

export default function SearchScreen() {
  const colors = useThemeColors();
  const { spacing, radius, icon, gutter, fontSize } = useResponsive();
  const listLayout = useListLayout();
  const { setCurrentCategory, setCurrentFolder } = useAppStore();
  const { getAllMetadata } = useCantiqueStorage();
  const { getAllCompositions } = useCompositionStorage();

  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSource, setSelectedSource] =
    useState<(typeof sourceFilters)[number]>('Tous');

  const loadSearchIndex = useCallback(async () => {
    try {
      setLoading(true);

      const [cantiques, compositions] = await Promise.all([getAllMetadata(), getAllCompositions()]);

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
    // Les getters viennent de hooks de stockage recréés à chaque rendu.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    void loadSearchIndex();
  }, [loadSearchIndex]);

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

  const counts = useMemo(
    () => ({
      Cantiques: results.filter((item) => item.categoryName === 'Cantiques').length,
      Leçons: results.filter((item) => item.categoryName === 'Leçons').length,
      Compositions: results.filter((item) => item.categoryName === 'Compositions').length,
    }),
    [results],
  );

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

    if (targetCategory) setCurrentCategory(targetCategory);
    if (targetFolder) setCurrentFolder(targetFolder as Folder);

    router.push('/library');
  };

  const resultIcon = (result: SearchResult) => {
    const size = icon.md;

    switch (result.kind) {
      case 'cantique':
        return <Music size={size} color={result.categoryColor} />;
      case 'composition':
        return <Edit3 size={size} color={result.categoryColor} />;
      case 'lecon-folder':
        return <FolderIcon size={size} color={result.categoryColor} />;
      default:
        return <FileText size={size} color={result.categoryColor} />;
    }
  };

  const styles = StyleSheet.create({
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      paddingHorizontal: gutter - spacing.xs,
      paddingVertical: spacing.xs,
      backgroundColor: colors.card,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
    },
    searchContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      backgroundColor: colors.input,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: spacing.sm,
      minHeight: MIN_TOUCH_TARGET,
    },
    searchInput: {
      flex: 1,
      minWidth: 0,
      paddingVertical: spacing.xs,
      fontSize: fontSize(16),
      color: colors.text,
    },
    iconButton: {
      minWidth: MIN_TOUCH_TARGET,
      minHeight: MIN_TOUCH_TARGET,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: radius.md,
    },
    filtersBar: {
      backgroundColor: colors.card,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
    },
    filterRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.xs,
      paddingVertical: spacing.sm,
    },
    filterChip: {
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: radius.pill,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.muted,
    },
    filterChipActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    summary: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.xs,
      paddingVertical: spacing.xs,
    },
    loadingContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.sm,
    },
  });

  return (
    <Screen>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => router.back()}
          hitSlop={touchSlop}
          accessibilityRole="button"
          accessibilityLabel="Retour"
        >
          <ArrowLeft size={icon.lg} color={colors.icon} />
        </TouchableOpacity>

        <View style={styles.searchContainer}>
          <Search size={icon.md} color={colors.icon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher…"
            placeholderTextColor={colors.text2}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCorrect={false}
            autoCapitalize="none"
            returnKeyType="search"
            maxFontSizeMultiplier={MAX_FONT_SCALE}
            accessibilityLabel="Champ de recherche"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              hitSlop={touchSlop}
              accessibilityRole="button"
              accessibilityLabel="Effacer la recherche"
            >
              <X size={icon.sm} color={colors.icon} />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => setShowFilters((value) => !value)}
          hitSlop={touchSlop}
          accessibilityRole="button"
          accessibilityLabel="Filtrer les résultats"
          accessibilityState={{ expanded: showFilters }}
        >
          <BookOpen size={icon.lg} color={showFilters ? colors.primary : colors.icon} />
        </TouchableOpacity>
      </View>

      {showFilters && (
        <View style={styles.filtersBar}>
          <Content>
            <View style={styles.filterRow}>
              {sourceFilters.map((source) => (
                <TouchableOpacity
                  key={source}
                  style={[styles.filterChip, selectedSource === source && styles.filterChipActive]}
                  onPress={() => setSelectedSource(source)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: selectedSource === source }}
                >
                  <TextComponent
                    variante="body5"
                    color={selectedSource === source ? colors.primaryForeground : colors.text}
                  >
                    {source}
                  </TextComponent>
                </TouchableOpacity>
              ))}
            </View>
          </Content>
        </View>
      )}

      <Content>
        <View style={styles.summary}>
          <Badge label={`${counts.Cantiques} cantiques`} />
          <Badge label={`${counts.Leçons} leçons`} />
          <Badge label={`${counts.Compositions} compositions`} />
        </View>
      </Content>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <TextComponent variante="body4" color={colors.text2}>
            Préparation de la recherche locale...
          </TextComponent>
        </View>
      ) : (
        <FlatList
          data={filteredResults}
          keyExtractor={(item) => `${item.kind}-${item.id}`}
          contentContainerStyle={[
            listLayout.contentContainerStyle,
            filteredResults.length === 0 && { flexGrow: 1 },
          ]}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            filteredResults.length > 0 ? (
              <TextComponent variante="body5" color={colors.text2}>
                {filteredResults.length} résultat{filteredResults.length > 1 ? 's' : ''}
              </TextComponent>
            ) : null
          }
          ListEmptyComponent={
            <EmptyState
              variant="plain"
              icon={Search}
              title="Aucun résultat trouvé"
              subtitle="Essayez un autre mot-clé ou changez la source recherchée."
            />
          }
          renderItem={({ item }) => (
            <ListItemCard
              title={item.title}
              subtitle={item.subtitle}
              description={item.description}
              leading={resultIcon(item)}
              leadingTint={item.categoryColor}
              onPress={() => openResult(item)}
              trailing={<ChevronRight size={icon.sm} color={colors.text2} />}
              meta={
                <>
                  <Badge label={item.categoryName} tone={item.categoryColor} />
                  <Badge label={item.sourceLabel} />
                </>
              }
            />
          )}
        />
      )}
    </Screen>
  );
}
