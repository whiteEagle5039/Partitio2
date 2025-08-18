import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Download, Trash2, FolderOpen, HardDrive } from 'lucide-react-native';
import { TextComponent } from '@/components/TextComponent';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useAppStore } from '@/stores/appStore';
import { useRouter } from 'expo-router';
import { SheetMusic

 } from '@/stores/appStore';
export default function DownloadsScreen() {
  const colors = useThemeColors();
  const router = useRouter();
  const { sheetMusic, user, removeDownload } = useAppStore();

  const downloadedSheets: SheetMusic[] = sheetMusic.filter(
    (sheet: SheetMusic) => sheet.isDownloaded
  );

  const totalSize = downloadedSheets.reduce(
    (sum: number, sheet: SheetMusic) => sum + (sheet.fileSize || 0),
    0
  );
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.card,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 10,
      paddingVertical: 16,
      backgroundColor: colors.card,
    },
    backButton: {
      marginRight: 16,
      padding: 8,
    },
    headerTitle: {
      flex: 1,
    },
    storageCard: {
      backgroundColor: colors.card,
      margin: 20,
      borderRadius: 16,
      padding: 20,
    },
    storageHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
    storageIcon: {
      marginRight: 12,
    },
    storageBar: {
      height: 10,
      backgroundColor: colors.muted,
      borderRadius: 4,
      marginTop: 12,
    },
    storageProgress: {
      height: '100%',
      backgroundColor: colors.primary,
      borderRadius: 4,
    },
    storageStats: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 8,
    },
    content: {
      flex: 1,
      backgroundColor:colors.background
    },
    sectionHeader: {
      paddingHorizontal: 20,
      paddingVertical: 16,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    downloadItem: {
      backgroundColor: colors.card,
      marginHorizontal: 20,
      marginBottom: 12,
      borderRadius: 12,
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
    },
    downloadIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: colors.primary + '20',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
    },
    downloadInfo: {
      flex: 1,
    },
    downloadTitle: {
      marginBottom: 4,
    },
    downloadMeta: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    downloadActions: {
      flexDirection: 'row',
      gap: 8,
    },
    actionButton: {
      padding: 8,
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 40,
    },
  });

  const handleDeleteDownload = (sheetId: string, title: string) => {
    Alert.alert(
      'Supprimer le téléchargement',
      `Êtes-vous sûr de vouloir supprimer "${title}" de vos téléchargements ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Supprimer', 
          style: 'destructive',
          onPress: () => removeDownload(sheetId)
        },
      ]
    );
  };

  const storagePercentage = user ? (user.storageUsed / user.storageLimit) * 100 : 0;

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={32} color={colors.icon} />
          </TouchableOpacity>
          
          <View style={styles.headerTitle}>
            <TextComponent variante="subtitle1">
              Téléchargements
            </TextComponent>
          </View>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Carte de stockage */}
          <View style={styles.storageCard}>
            <View style={styles.storageHeader}>
              <HardDrive size={32} color={colors.primary} style={styles.storageIcon} />
              <View style={{ flex: 1 }}>
                <TextComponent variante="subtitle1">
                  Stockage local
                </TextComponent>
                <TextComponent variante="body2" color={colors.text2}>
                  {totalSize.toFixed(1)} MB utilisés
                </TextComponent>
              </View>
            </View>
            
            <View style={styles.storageBar}>
              <View 
                style={[
                  styles.storageProgress, 
                  { width: `${storagePercentage}%` }
                ]} 
              />
            </View>
            
            <View style={styles.storageStats}>
              <TextComponent variante="body3" color={colors.text2}>
                {user?.storageUsed || 0} MB
              </TextComponent>
              <TextComponent variante="body3" color={colors.text2}>
                {user?.storageLimit || 100} MB
              </TextComponent>
            </View>
          </View>

          {/* Section des téléchargements */}
          <View style={styles.sectionHeader}>
            <TextComponent variante="subtitle2">
              Fichiers téléchargés ({downloadedSheets.length})
            </TextComponent>
          </View>

          {downloadedSheets.length > 0 ? (
            downloadedSheets.map((sheet: any) => (
              <TouchableOpacity 
                key={sheet.id}   // ✅ le key doit être ici
                onPress={() => console.log(`Ouvrir ${sheet.title}`)}
              >
                <View style={styles.downloadItem}>
                  <View style={styles.downloadIcon}>
                    <Download size={24} color={colors.primary} />
                  </View>
                  
                  <View style={styles.downloadInfo}>
                    <TextComponent variante="subtitle2" style={styles.downloadTitle}>
                      {sheet.title}
                    </TextComponent>
                    <View style={styles.downloadMeta}>
                      <TextComponent variante="body4" color={colors.text2}>
                        {sheet.composer}
                      </TextComponent>
                      <TextComponent variante="body4" color={colors.text2}>
                        •
                      </TextComponent>
                      <TextComponent variante="body4" color={colors.text2}>
                        {sheet.fileSize?.toFixed(1)} MB
                      </TextComponent>
                    </View>
                  </View>
                  
                  <View style={styles.downloadActions}>
                    <TouchableOpacity 
                      style={styles.actionButton}
                      onPress={() => handleDeleteDownload(sheet.id, sheet.title)}
                    >
                      <Trash2 size={20} color={colors.destructive} />
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Download size={48} color={colors.text2} />
              <TextComponent variante="subtitle2" style={{ marginTop: 16, textAlign: 'center' }}>
                Aucun téléchargement
              </TextComponent>
              <TextComponent variante="body4" color={colors.text2} style={{ textAlign: 'center', marginTop: 8 }}>
                Les partitions que vous téléchargez apparaîtront ici
              </TextComponent>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}