import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Edit3, Music } from 'lucide-react-native';
import { TextComponent } from '@/components/uxComponents/TextComponent';
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

export const CompositionsView: React.FC<CompositionsViewProps> = ({ onContentPress }) => {
  const colors = useThemeColors();
  const { getAllCompositions } = useCompositionStorage();
  
  const [compositions, setCompositions] = useState<CompositionMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Charger les compositions au montage du composant
  useEffect(() => {
    loadCompositions();
  }, []);

  const loadCompositions = async () => {
    try {
      setLoading(true);
      const data = await getAllCompositions();
      setCompositions(data);
    } catch (error) {
      console.error('❌ Erreur lors du chargement des compositions:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadCompositions();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return "Aujourd'hui";
    } else if (diffDays === 1) {
      return "Hier";
    } else if (diffDays < 7) {
      return `Il y a ${diffDays} jours`;
    } else {
      return date.toLocaleDateString('fr-FR', { 
        day: 'numeric', 
        month: 'short',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  const styles = StyleSheet.create({
    container: {
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
  });

  // État de chargement
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <TextComponent variante="body3" color={colors.text2} style={{ marginTop: 12 }}>
          Chargement des compositions...
        </TextComponent>
      </View>
    );
  }

  // Aucune composition
  if (compositions.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Music size={64} color={colors.text2} style={styles.emptyIcon} />
        <TextComponent variante="subtitle2" color={colors.text}>
          Aucune composition
        </TextComponent>
        <TextComponent variante="body3" color={colors.text2} style={{ marginTop: 8, textAlign: 'center' }}>
          Créez votre première composition{'\n'}pour la voir apparaître ici
        </TextComponent>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {compositions.map((composition) => (
        <TouchableOpacity
          key={composition.id}
          style={styles.listItem}
          onPress={() => onContentPress?.(composition.id)}
          activeOpacity={0.7}
        >
          <View style={[styles.listThumbnail, { backgroundColor: `${colors.primary}15` }]}>
            <Edit3 size={24} color={colors.primary} />
          </View>
          
          <View style={styles.listContent}>
            <TextComponent variante="subtitle3" style={styles.listTitle}>
              {composition.title}
            </TextComponent>
            
            <TextComponent variante="body4" color={colors.text2}>
              {composition.composer}
            </TextComponent>
            
            <View style={styles.contentInfo}>
              <View style={styles.metricItem}>
                <TextComponent variante="caption" color={colors.text2}>
                  {formatDate(composition.updatedAt)}
                </TextComponent>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};