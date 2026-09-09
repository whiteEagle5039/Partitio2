import { useFocusEffect, useRouter } from 'expo-router';
import { Download, HardDrive, Trash2 } from 'lucide-react-native';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, TouchableOpacity, View } from 'react-native';

import { CardComponent } from '@/components/uxComponents/CardComponent';
import { EmptyState } from '@/components/uxComponents/EmptyState';
import { ListItemCard } from '@/components/uxComponents/ListItemCard';
import { Screen } from '@/components/uxComponents/Screen';
import { ScreenHeader } from '@/components/uxComponents/ScreenHeader';
import { TextComponent } from '@/components/uxComponents/TextComponent';
import { MIN_TOUCH_TARGET, touchSlop } from '@/constants/layout';
import { useListLayout } from '@/hooks/useListLayout';
import { useResponsive } from '@/hooks/useResponsive';
import { useThemeColors } from '@/hooks/useThemeColors';
import { Cantique } from '@/types/cantique';
import { useCantiqueStorage } from '@/utils/CantiqueStorage';

export default function DownloadsScreen() {
  const colors = useThemeColors();
  const router = useRouter();
  const { spacing, radius, icon } = useResponsive();
  const listLayout = useListLayout();
  const { getDownloadedCantiques, removeDownloadedCantique } = useCantiqueStorage();

  const [downloadedCantiques, setDownloadedCantiques] = useState<Cantique[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      getDownloadedCantiques().then((data) => {
        if (isActive) {
          setDownloadedCantiques(data);
          setLoading(false);
        }
      });

      return () => {
        isActive = false;
      };
      // getDownloadedCantiques provient d'un hook de stockage recréé à chaque rendu.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  const handleDeleteDownload = (cantiqueId: string, title: string) => {
    Alert.alert(
      'Supprimer le téléchargement',
      `Êtes-vous sûr de vouloir retirer "${title}" de vos téléchargements ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            await removeDownloadedCantique(cantiqueId);
            setDownloadedCantiques((current) => current.filter((c) => c.id !== cantiqueId));
          },
        },
      ],
    );
  };

  const StorageCard = (
    <View style={{ gap: spacing.md }}>
      <CardComponent style={{ gap: spacing.sm }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
          <View
            style={{
              width: 44,
              height: 44,
              borderRadius: radius.md,
              backgroundColor: `${colors.primary}18`,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <HardDrive size={icon.md} color={colors.primary} />
          </View>

          <View style={{ flex: 1, minWidth: 0 }}>
            <TextComponent variante="subtitle2" color={colors.text}>
              Disponible hors-ligne
            </TextComponent>
            <TextComponent variante="body5" color={colors.text2}>
              {downloadedCantiques.length} cantique{downloadedCantiques.length > 1 ? 's' : ''} enregistré
              {downloadedCantiques.length > 1 ? 's' : ''}
            </TextComponent>
          </View>
        </View>
      </CardComponent>

      <TextComponent variante="subtitle2" color={colors.text}>
        Fichiers téléchargés ({downloadedCantiques.length})
      </TextComponent>
    </View>
  );

  if (loading) {
    return (
      <Screen background={colors.card}>
        <ScreenHeader title="Téléchargements" />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </Screen>
    );
  }

  return (
    <Screen background={colors.card}>
      <ScreenHeader title="Téléchargements" />

      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <FlatList
          data={downloadedCantiques}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[
            listLayout.contentContainerStyle,
            downloadedCantiques.length === 0 && { flexGrow: 1 },
          ]}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={StorageCard}
          ListEmptyComponent={
            <EmptyState
              variant="plain"
              icon={Download}
              title="Aucun téléchargement"
              subtitle="Les cantiques que vous téléchargez apparaîtront ici."
            />
          }
          renderItem={({ item }) => (
            <ListItemCard
              title={`${item.number} — ${item.title}`}
              subtitle={item.composer}
              leading={<Download size={icon.md} color={colors.primary} />}
              onPress={() => router.push(`/cantiquePreview?id=${item.id}`)}
              trailing={
                <TouchableOpacity
                  onPress={() => handleDeleteDownload(item.id, item.title)}
                  hitSlop={touchSlop}
                  accessibilityRole="button"
                  accessibilityLabel={`Supprimer ${item.title}`}
                  style={{
                    minWidth: MIN_TOUCH_TARGET,
                    minHeight: MIN_TOUCH_TARGET,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Trash2 size={icon.sm} color={colors.destructive} />
                </TouchableOpacity>
              }
            />
          )}
        />
      </View>
    </Screen>
  );
}
