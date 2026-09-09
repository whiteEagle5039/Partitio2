import { router } from 'expo-router';
import { Edit3, Music } from 'lucide-react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, View } from 'react-native';

import { EmptyState } from '@/components/uxComponents/EmptyState';
import { Badge, ListItemCard } from '@/components/uxComponents/ListItemCard';
import { TextComponent } from '@/components/uxComponents/TextComponent';
import { useListLayout } from '@/hooks/useListLayout';
import { useResponsive } from '@/hooks/useResponsive';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useCompositionStorage } from '@/utils/CompositionStorage';

interface CompositionMetadata {
  id: string;
  title: string;
  composer: string;
  updatedAt: string;
  thumbnail?: string;
}

interface CompositionsViewProps {
  onContentPress?: (compositionId: string) => void;
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffDays = Math.floor(Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Aujourd'hui";
  if (diffDays === 1) return 'Hier';
  if (diffDays < 7) return `Il y a ${diffDays} jours`;

  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
}

export const CompositionsView: React.FC<CompositionsViewProps> = ({ onContentPress }) => {
  const colors = useThemeColors();
  const { spacing, icon } = useResponsive();
  const listLayout = useListLayout();
  const { getAllCompositions } = useCompositionStorage();

  const [compositions, setCompositions] = useState<CompositionMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadCompositions = useCallback(async () => {
    try {
      setCompositions(await getAllCompositions());
    } catch (error) {
      console.error('❌ Erreur lors du chargement des compositions:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    void loadCompositions();
  }, [loadCompositions]);

  const handleRefresh = () => {
    setRefreshing(true);
    void loadCompositions();
  };

  const handleCompositionPress = (compositionId: string) => {
    if (!compositionId) return;

    if (onContentPress) {
      onContentPress(compositionId);
    } else {
      router.push(`/compositionPreview?id=${compositionId}`);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.sm }}>
        <ActivityIndicator size="large" color={colors.primary} />
        <TextComponent variante="body4" color={colors.text2}>
          Chargement des compositions...
        </TextComponent>
      </View>
    );
  }

  if (compositions.length === 0) {
    return (
      <EmptyState
        variant="plain"
        icon={Music}
        title="Aucune composition"
        subtitle="Créez votre première composition pour la voir apparaître ici."
        actionText="Composer"
        onActionPress={() => router.push('/compose')}
      />
    );
  }

  return (
    <FlatList
      data={compositions}
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
          leading={<Edit3 size={icon.md} color={colors.primary} />}
          onPress={() => handleCompositionPress(item.id)}
          meta={<Badge label={formatDate(item.updatedAt)} />}
        />
      )}
    />
  );
};
