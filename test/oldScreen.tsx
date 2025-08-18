import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Grid, List, SortAsc, Folder, Music, Download, Edit3, Library, Search } from 'lucide-react-native';
import { TextComponent } from '@/components/TextComponent';
import { SheetMusicCard } from '@/components/SheetMusicCard';
import { WrapperComponent } from '@/components/WrapperComponent';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useAppStore } from '@/stores/appStore';
import { useRouter } from 'expo-router';
import { SheetMusic } from '@/stores/appStore';

export default function LibraryScreen() {
  const colors = useThemeColors();
  const router = useRouter();
  const { sheetMusic } = useAppStore();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
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
    },
    backButton: {
      padding: 8,
      marginRight: 8,
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
    scrollView: {
      flex: 1,
      backgroundColor: colors.background
    },
    categoriesContainer: {
      paddingVertical: 16,
      backgroundColor: colors.background,
    },
    categoriesScroll: {
      paddingLeft: 20,
    },
    categoryChip: {
      backgroundColor: colors.card,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      marginRight: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    categoryChipActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    statsContainer: {
      flexDirection: 'row',
      paddingHorizontal: 20,
      paddingVertical: 16,
      gap: 12,
    },
    statCard: {
      flex: 1,
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 16,
      alignItems: 'center',
      borderColor: colors.border,
      borderWidth: 1,
    },
    statIcon: {
      marginBottom: 8,
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    content: {
      flex: 1,
      paddingTop: 10,
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
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      alignItems: 'center',
      borderColor: colors.border,
      borderWidth: 1,
    },
    listThumbnail: {
      width: 60,
      height: 60,
      borderRadius: 12,
      marginRight: 16,
      backgroundColor: `${colors.primary}15`,
      alignItems: 'center',
      justifyContent: 'center',
    },
    listContent: {
      flex: 1,
    },
    listTitle: {
      marginBottom: 4,
    },
    emptyStateCard: {
      marginHorizontal: 20,
      padding: 32,
      borderRadius: 16,
      borderWidth: 1,
      alignItems: 'center',
      backgroundColor: colors.card,
      borderColor: colors.border,
    },
    emptyStateIcon: {
      width: 80,
      height: 80,
      borderRadius: 40,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 20,
    },
    emptyStateTitle: {
      textAlign: 'center',
      marginBottom: 8,
    },
    emptyStateSubtitle: {
      textAlign: 'center',
      marginBottom: 20,
      lineHeight: 20,
    },
    emptyStateButton: {
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 24,
      marginTop: 8,
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

  // Composant pour l'état vide
  const EmptyStateCard = ({ 
    icon: IconComponent, 
    title, 
    subtitle, 
    actionText, 
    onActionPress 
  }: any) => {
    return (
      <View style={styles.emptyStateCard}>
        <View style={[styles.emptyStateIcon, { backgroundColor: `${colors.primary}15` }]}>
          <IconComponent size={40} color={colors.primary2} />
        </View>
        <TextComponent variante="subtitle2" style={styles.emptyStateTitle}>
          {title}
        </TextComponent>
        <TextComponent variante="body3" color={colors.textSecondary} style={styles.emptyStateSubtitle}>
          {subtitle}
        </TextComponent>
        {actionText && onActionPress && (
          <TouchableOpacity 
            style={[styles.emptyStateButton, { backgroundColor: colors.primary }]}
            onPress={onActionPress}
          >
            <TextComponent variante="body3" color="#FFFFFF">
              {actionText}
            </TextComponent>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  // Composant pour les statistiques
  const StatCard = ({ icon: IconComponent, value, label, iconColor }: any) => {
    return (
      <View style={styles.statCard}>
        <View style={[styles.statIcon, { backgroundColor: `${iconColor}15` }]}>
          <IconComponent size={20} color={iconColor} />
        </View>
        <TextComponent variante="subtitle1">{value}</TextComponent>
        <TextComponent variante="caption" color={colors.textSecondary}>{label}</TextComponent>
      </View>
    );
  };

  return (
    <WrapperComponent>
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

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
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
                    color={selectedCategory === category ? "#FFFFFF" : colors.text}
                  >
                    {category}
                  </TextComponent>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Statistiques */}
          <View style={styles.statsContainer}>
            <StatCard 
              icon={Library}
              value={stats.total}
              label="Total"
              iconColor={colors.primary2}
            />
            <StatCard 
              icon={Download}
              value={stats.downloaded}
              label="Téléchargées"
              iconColor={colors.primary2}
            />
            <StatCard 
              icon={Edit3}
              value={stats.compositions}
              label="Compositions"
              iconColor={colors.primary2}
            />
          </View>

          {/* Contenu */}
          <View style={styles.content}>
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
                        <Music size={24} color={colors.primary2} />
                      </View>
                      <View style={styles.listContent}>
                        <TextComponent variante="subtitle3" style={styles.listTitle}>
                          {sheet.title}
                        </TextComponent>
                        <TextComponent variante="caption" color={colors.textSecondary}>
                          {sheet.composer} • {sheet.genre}
                        </TextComponent>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              )
            ) : (
              <EmptyStateCard
                icon={Library}
                title="Aucune partition trouvée"
                subtitle={`Votre collection "${selectedCategory}" est vide. Explorez notre catalogue pour découvrir de nouvelles partitions.`}
                actionText="Explorer"
                onActionPress={() => router.push('/search')}
              />
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </WrapperComponent>
  );
}