import { router } from 'expo-router';
import { Music } from 'lucide-react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, View } from 'react-native';

import { EmptyState } from '@/components/uxComponents/EmptyState';
import { Badge, ListItemCard } from '@/components/uxComponents/ListItemCard';
import { TextComponent } from '@/components/uxComponents/TextComponent';
import { useListLayout } from '@/hooks/useListLayout';
import { useResponsive } from '@/hooks/useResponsive';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useCantiqueStorage } from '@/utils/CantiqueStorage';

interface CantiqueMetadata {
  id: string;
  number: number;
  title: string;
  composer: string;
  category?: string;
  tags?: string[];
}

interface CantiquesViewProps {
  onContentPress?: (cantiqueId: string) => void;
}

export const CantiquesView: React.FC<CantiquesViewProps> = ({ onContentPress }) => {
  const colors = useThemeColors();
  const { spacing } = useResponsive();
  const listLayout = useListLayout();
  const { getAllMetadata } = useCantiqueStorage();

  const [cantiques, setCantiques] = useState<CantiqueMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadCantiques = useCallback(async () => {
    try {
      const data = await getAllMetadata();
      setCantiques([...data].sort((a, b) => a.number - b.number));
    } catch (error) {
      console.error('❌ Erreur lors du chargement des cantiques:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
    // getAllMetadata provient d'un hook de stockage recréé à chaque rendu.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    void loadCantiques();
  }, [loadCantiques]);

  const handleRefresh = () => {
    setRefreshing(true);
    void loadCantiques();
  };

  const handleCantiquePress = (cantiqueId: string) => {
    if (!cantiqueId) return;

    if (onContentPress) {
      onContentPress(cantiqueId);
    } else {
      router.push(`/cantiquePreview?id=${cantiqueId}`);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.sm }}>
        <ActivityIndicator size="large" color={colors.primary} />
        <TextComponent variante="body4" color={colors.text2}>
          Chargement des cantiques...
        </TextComponent>
      </View>
    );
  }

  if (cantiques.length === 0) {
    return (
      <EmptyState
        variant="plain"
        icon={Music}
        title="Aucun cantique disponible"
        subtitle="La bibliothèque de cantiques ne contient pas encore de contenu."
      />
    );
  }

  return (
    <FlatList
      data={cantiques}
      keyExtractor={(item) => item.id}
      contentContainerStyle={listLayout.contentContainerStyle}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={colors.primary} />
      }
      renderItem={({ item }) => (
        <ListItemCard
          title={item.title}
          subtitle={item.composer}
          leading={
            <TextComponent variante="subtitle3" color={colors.primary}>
              {item.number}
            </TextComponent>
          }
          onPress={() => handleCantiquePress(item.id)}
          meta={
            <>
              {!!item.category && <Badge label={item.category} tone={colors.primary} />}
              {!!item.tags?.length && (
                <Badge label={item.tags.slice(0, 2).join(', ') + (item.tags.length > 2 ? '…' : '')} />
              )}
            </>
          }
        />
      )}
    />
  );
};
