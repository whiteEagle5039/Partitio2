import { Download, HardDrive, Trash2 } from 'lucide-react-native';
import React from 'react';
import { Alert, FlatList, TouchableOpacity, View } from 'react-native';

import { CardComponent } from '@/components/uxComponents/CardComponent';
import { EmptyState } from '@/components/uxComponents/EmptyState';
import { Badge, ListItemCard } from '@/components/uxComponents/ListItemCard';
import { Screen } from '@/components/uxComponents/Screen';
import { ScreenHeader } from '@/components/uxComponents/ScreenHeader';
import { TextComponent } from '@/components/uxComponents/TextComponent';
import { MIN_TOUCH_TARGET, touchSlop } from '@/constants/layout';
import { useListLayout } from '@/hooks/useListLayout';
import { useResponsive } from '@/hooks/useResponsive';
import { useThemeColors } from '@/hooks/useThemeColors';
import { SheetMusic, useAppStore } from '@/stores/appStore';

export default function DownloadsScreen() {
  const colors = useThemeColors();
  const { spacing, radius, icon } = useResponsive();
  const listLayout = useListLayout();
  const { sheetMusic, user, removeDownload } = useAppStore();

  const downloadedSheets: SheetMusic[] = sheetMusic.filter((sheet: SheetMusic) => sheet.isDownloaded);

  const totalSize = downloadedSheets.reduce(
    (sum: number, sheet: SheetMusic) => sum + (sheet.fileSize || 0),
    0,
  );

  const storagePercentage = user
    ? Math.min(100, Math.max(0, (user.storageUsed / user.storageLimit) * 100))
    : 0;

  const handleDeleteDownload = (sheetId: string, title: string) => {
    Alert.alert(
      'Supprimer le téléchargement',
      `Êtes-vous sûr de vouloir supprimer "${title}" de vos téléchargements ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Supprimer', style: 'destructive', onPress: () => removeDownload(sheetId) },
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
              Stockage local
            </TextComponent>
            <TextComponent variante="body5" color={colors.text2}>
              {totalSize.toFixed(1)} MB utilisés
            </TextComponent>
          </View>
        </View>

        <View
          style={{
            height: 8,
            borderRadius: radius.pill,
            backgroundColor: colors.muted,
            overflow: 'hidden',
          }}
        >
          <View
            style={{
              width: `${storagePercentage}%`,
              height: '100%',
              borderRadius: radius.pill,
              backgroundColor: colors.primary,
            }}
          />
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <TextComponent variante="body5" color={colors.text2}>
            {user?.storageUsed || 0} MB
          </TextComponent>
          <TextComponent variante="body5" color={colors.text2}>
            {user?.storageLimit || 100} MB
          </TextComponent>
        </View>
      </CardComponent>

      <TextComponent variante="subtitle2" color={colors.text}>
        Fichiers téléchargés ({downloadedSheets.length})
      </TextComponent>
    </View>
  );

  return (
    <Screen background={colors.card}>
      <ScreenHeader title="Téléchargements" />

      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <FlatList
          data={downloadedSheets}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[
            listLayout.contentContainerStyle,
            downloadedSheets.length === 0 && { flexGrow: 1 },
          ]}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={StorageCard}
          ListEmptyComponent={
            <EmptyState
              variant="plain"
              icon={Download}
              title="Aucun téléchargement"
              subtitle="Les partitions que vous téléchargez apparaîtront ici."
            />
          }
          renderItem={({ item }) => (
            <ListItemCard
              title={item.title}
              subtitle={item.composer}
              leading={<Download size={icon.md} color={colors.primary} />}
              onPress={() => console.log(`Ouvrir ${item.title}`)}
              meta={item.fileSize ? <Badge label={`${item.fileSize.toFixed(1)} MB`} /> : undefined}
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
