import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { Music } from 'lucide-react-native';
import { TextComponent } from '@/components/uxComponents/TextComponent';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useCantiqueStorage } from '@/utils/CantiqueStorage';
import { router } from 'expo-router';

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
  const { getAllMetadata } = useCantiqueStorage();
  
  const [cantiques, setCantiques] = useState<CantiqueMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Charger les cantiques au montage du composant
  useEffect(() => {
    loadCantiques();
  }, []);

  const loadCantiques = async () => {
    try {
      setLoading(true);
      const data = await getAllMetadata();
      // Trier par numéro de cantique
      const sorted = data.sort((a, b) => a.number - b.number);
      setCantiques(sorted);
      console.log('✅ Cantiques chargés:', sorted.length);
    } catch (error) {
      console.error('❌ Erreur lors du chargement des cantiques:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadCantiques();
  };

  const handleCantiquePress = (cantiqueId: string) => {
    console.log('🎵 Cantique cliqué, ID:', cantiqueId);
    console.log('📍 onContentPress existe?', !!onContentPress);
    console.log('📍 router existe?', !!router);
    
    if (!cantiqueId) {
      console.error('❌ ID de cantique invalide');
      return;
    }
    
    if (onContentPress) {
      console.log('✅ Appel de onContentPress');
      onContentPress(cantiqueId);
    } else {
      console.log('✅ Navigation par défaut');
      console.log('📍 Navigation vers /cantiquePreview?id=' + cantiqueId);
      router.push(`/cantiquePreview?id=${cantiqueId}`);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    scrollContainer: {
      paddingHorizontal: 20,
      paddingTop: 20,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 40,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 60,
    },
    emptyIcon: {
      marginBottom: 16,
      opacity: 0.3,
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
      alignItems: 'center',
      justifyContent: 'center',
    },
    listContent: {
      flex: 1,
    },
    listTitle: {
      marginBottom: 4,
    },
    contentInfo: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: 8,
      marginTop: 8,
    },
    metricItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    infoSeparator: {
      width: 4,
      height: 4,
      borderRadius: 2,
      backgroundColor: colors.text2,
    },
    categoryBadge: {
      backgroundColor: colors.primary + '20',
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 8,
    },
  });

  // État de chargement
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <TextComponent variante="body3" color={colors.text2} style={{ marginTop: 12 }}>
          Chargement des cantiques...
        </TextComponent>
      </View>
    );
  }

  // Aucun cantique
  if (cantiques.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Music size={64} color={colors.text2} style={styles.emptyIcon} />
        <TextComponent variante="subtitle2" color={colors.text}>
          Aucun cantique disponible
        </TextComponent>
        <TextComponent variante="body3" color={colors.text2} style={{ marginTop: 8, textAlign: 'center' }}>
          La bibliothèque de cantiques{'\n'}ne contient pas encore de contenu
        </TextComponent>
      </View>
    );
  }

  // Liste des cantiques
  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.scrollContainer}
      showsVerticalScrollIndicator={false}
    >
      {cantiques.map((cantique) => (
        <TouchableOpacity
          key={cantique.id}
          style={styles.listItem}
          onPress={() => handleCantiquePress(cantique.id)}
          activeOpacity={0.7}
        >
          <View style={[styles.listThumbnail, { backgroundColor: `${colors.primary}15` }]}>
            <TextComponent variante="subtitle3" color={colors.primary}>
              {cantique.number}
            </TextComponent>
          </View>
          
          <View style={styles.listContent}>
            <TextComponent variante="subtitle3" style={styles.listTitle}>
              {cantique.title}
            </TextComponent>
            
            <TextComponent variante="body4" color={colors.text2}>
              {cantique.composer}
            </TextComponent>
            
            <View style={styles.contentInfo}>
              {cantique.category && (
                <>
                  <View style={styles.categoryBadge}>
                    <TextComponent variante="caption" color={colors.primary}>
                      {cantique.category}
                    </TextComponent>
                  </View>
                  {cantique.tags && cantique.tags.length > 0 && (
                    <View style={styles.infoSeparator} />
                  )}
                </>
              )}
              
              {cantique.tags && cantique.tags.length > 0 && (
                <View style={styles.metricItem}>
                  <TextComponent variante="caption" color={colors.text2}>
                    {cantique.tags.slice(0, 2).join(', ')}
                    {cantique.tags.length > 2 ? '...' : ''}
                  </TextComponent>
                </View>
              )}
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};