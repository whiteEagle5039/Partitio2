import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Download, Share2, Heart } from 'lucide-react-native';
import { TextComponent } from '@/components/uxComponents/TextComponent';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useCantiqueStorage } from '@/utils/CantiqueStorage';
import { Cantique } from '@/types/cantique';

export default function CantiquePreviewScreen() {
  const colors = useThemeColors();
  const router = useRouter();
  const params = useLocalSearchParams();
  const { getCantiqueById, isFavorite, addToFavorites, removeFromFavorites } = useCantiqueStorage();
  
  const [cantique, setCantique] = useState<Cantique | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFav, setIsFav] = useState(false);
  const cantiqueId = params.id as string;

  useEffect(() => {
    loadCantiqueData();
  }, [cantiqueId]);

  const loadCantiqueData = async () => {
    try {
      setLoading(true);
      const data = await getCantiqueById(cantiqueId);
      if (data) {
        console.log('📄 Cantique chargé:', data);
        setCantique(data);
        
        const favStatus = await isFavorite(cantiqueId);
        setIsFav(favStatus);
      } else {
        console.warn('⚠️ Aucun cantique trouvé pour l\'ID:', cantiqueId);
      }
    } catch (error) {
      console.error('❌ Erreur chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async () => {
    try {
      if (isFav) {
        await removeFromFavorites(cantiqueId);
        setIsFav(false);
      } else {
        await addToFavorites(cantiqueId);
        setIsFav(true);
      }
    } catch (error) {
      console.error('❌ Erreur toggle favori:', error);
    }
  };

  // ✅ Parser les mesures d'une voix
  const parseMeasures = (voiceContent: string): string[] => {
    if (!voiceContent || voiceContent.trim() === '') return [];
    return voiceContent.split('|').map(m => m.trim()).filter(m => m !== '');
  };

  // ✅ Calculer la largeur minimale d'une mesure basée sur le contenu le plus long
  const getMeasureMinWidth = (voices: Array<{ label: string; measures: string[] }>, measureIndex: number): number => {
    let maxLength = 0;
    voices.forEach(voice => {
      const measure = voice.measures[measureIndex];
      if (measure) {
        maxLength = Math.max(maxLength, measure.length);
      }
    });
    // Largeur de base + largeur proportionnelle au contenu
    return Math.max(60, 40 + maxLength * 4);
  };

  // ✅ Fonction pour rendre une section avec les voix alignées
  const renderSection = (section: any) => {
    // Récupérer toutes les voix présentes
    const voices: Array<{ label: string; measures: string[] }> = [];
    
    if (section.soprano && section.soprano.trim() !== '') {
      voices.push({ label: 'S', measures: parseMeasures(section.soprano) });
    }
    if (section.alto && section.alto.trim() !== '') {
      voices.push({ label: 'A', measures: parseMeasures(section.alto) });
    }
    if (section.tenor && section.tenor.trim() !== '') {
      voices.push({ label: 'T', measures: parseMeasures(section.tenor) });
    }
    if (section.bass && section.bass.trim() !== '') {
      voices.push({ label: 'B', measures: parseMeasures(section.bass) });
    }

    // Si aucune voix, afficher message vide
    if (voices.length === 0) {
      return (
        <View style={styles.emptySectionMessage}>
          <TextComponent style={styles.emptySectionText}>
            Cette partie ne contient pas de notes.
          </TextComponent>
        </View>
      );
    }

    // Trouver le nombre maximum de mesures
    const maxMeasures = Math.max(...voices.map(v => v.measures.length));

    // Grouper par lignes de 4 mesures
    const measuresPerLine = 4;
    const numberOfLines = Math.ceil(maxMeasures / measuresPerLine);

    return (
      <View>
        {Array.from({ length: numberOfLines }).map((_, lineIndex) => {
          const startMeasure = lineIndex * measuresPerLine;
          const endMeasure = Math.min(startMeasure + measuresPerLine, maxMeasures);
          
          return (
            <View key={lineIndex} style={styles.systemContainer}>
              {/* Labels des voix au début de la ligne */}
              <View style={styles.voiceLabelsColumn}>
                {voices.map((voice) => (
                  <View key={voice.label} style={styles.voiceLabelCell}>
                    <TextComponent variante='body6' style={styles.voiceLabel}>
                      {voice.label}:
                    </TextComponent>
                  </View>
                ))}
              </View>

              {/* Pour chaque mesure de cette ligne */}
              {Array.from({ length: endMeasure - startMeasure }).map((_, measureOffset) => {
                const measureIndex = startMeasure + measureOffset;
                const minWidth = getMeasureMinWidth(voices, measureIndex);
                
                return (
                  <View key={measureIndex} style={[styles.measureColumn, { minWidth }]}>
                    {/* Afficher toutes les voix pour cette mesure */}
                    {voices.map((voice) => (
                      <View key={`${voice.label}-${measureIndex}`} style={styles.voiceInMeasure}>
                        <TextComponent variante='subtitle4' style={styles.measureContent}>
                          {voice.measures[measureIndex] || ''}
                        </TextComponent>
                      </View>
                    ))}
                  </View>
                );
              })}
            </View>
          );
        })}
      </View>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      paddingTop: 10,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      backgroundColor: colors.card,
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    headerTitle: {
      marginLeft: 12,
      marginTop: 8,
    },
    headerActions: {
      flexDirection: 'row',
      gap: 12,
    },
    actionButton: {
      padding: 8,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    scrollContent: {
      padding: 8,
    },
    pageContainer: {
      backgroundColor: 'white',
      borderRadius: 8,
      padding: 15,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    pageHeader: {
      marginBottom: 24,
      borderBottomWidth: 2,
      borderBottomColor: '#333',
      paddingBottom: 16,
    },
    cantiqueNumber: {
      textAlign: 'center',
      marginBottom: 8,
    },
    cantiqueMeta: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 8,
      marginBottom: 12,
    },
    metaItem: {
      color: '#666',
      fontSize: 14,
    },
    sectionContainer: {
      marginBottom: 32,
    },
    sectionHeader: {
      marginBottom: 15,
    },
    // ✅ Styles pour l'affichage en système (4 mesures par ligne)
    systemContainer: {
      flexDirection: 'row',
      marginBottom: 20,
    //   borderTopWidth: 0.5,
      borderBottomWidth: 2,
      borderColor: '#333',
      paddingVertical: 8,
    },
    voiceLabelsColumn: {
      width: 30,
      justifyContent: 'space-around',
      borderRightWidth: 2,
      borderRightColor: '#333',
      paddingRight: 8,
    },
    voiceLabelCell: {
      flex: 1,
      justifyContent: 'center',
    },
    measureColumn: {
      borderRightWidth: 1,
      borderRightColor: '#999',
      paddingHorizontal: 4,
    },
    voiceInMeasure: {
      flex: 1,
      justifyContent: 'center',
      paddingVertical: 4,
      borderBottomWidth: 1,
      borderBottomColor: '#eee',
    },
    voiceLabel: {
      color: '#000',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    measureContent: {
      color: '#333',
      letterSpacing: 0.5,
    },
    emptySectionMessage: {
      padding: 16,
      backgroundColor: '#f5f5f5',
      borderRadius: 8,
      alignItems: 'center',
    },
    emptySectionText: {
      color: '#999',
      fontSize: 14,
      fontStyle: 'italic',
    },
    // Styles pour les paroles regroupées en bas
    allLyricsContainer: {
      marginTop: 32,
      borderTopWidth: 2,
      borderTopColor: '#333',
      paddingTop: 24,
    },
    lyricsHeaderContainer: {
      marginBottom: 16,
      alignItems: 'center',
    },
    lyricsHeader: {
      color: colors.primary,
      fontWeight: 'bold',
    },
    lyricsSection: {
      marginBottom: 20,
      padding: 12,
      borderLeftWidth: 3,
      borderLeftColor: colors.primary,
      backgroundColor: '#f9f9f9',
    },
    lyricsSectionTitle: {
      fontWeight: 'bold',
      color: '#666',
      marginBottom: 8,
    },
    lyricsText: {
      fontSize: 14,
      color: '#333',
      lineHeight: 20,
    },
    footer: {
      marginTop: 32,
      paddingTop: 16,
      borderTopWidth: 1,
      borderTopColor: '#e0e0e0',
      alignItems: 'center',
    },
    footerText: {
      fontSize: 12,
    },
  });

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <TextComponent variante="body3" color={colors.text2} style={{ marginTop: 12 }}>
            Chargement...
          </TextComponent>
        </View>
      </View>
    );
  }

  if (!cantique) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
        <View style={styles.loadingContainer}>
          <TextComponent variante="subtitle2">
            Cantique introuvable
          </TextComponent>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <View style={{ flexShrink: 1, overflow: 'hidden' }}>
            <TextComponent variante="subtitle2" style={styles.headerTitle} numberOfLines={1}>
              Cantique {cantique.number}
            </TextComponent>
          </View>
        </View>
        
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.actionButton} onPress={handleToggleFavorite}>
            <Heart 
              size={20} 
              color={isFav ? colors.primary : colors.text} 
              fill={isFav ? colors.primary : 'transparent'}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={() => {}}>
            <Share2 size={20} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={() => {}}>
            <Download size={20} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <ScrollView style={styles.container}>
        <View style={styles.scrollContent}>
          <View style={styles.pageContainer}>
            {/* Page Header */}
            <View style={styles.pageHeader}>
              <View style={styles.cantiqueMeta}>
                <TextComponent style={styles.metaItem}>
                  {cantique.key}
                </TextComponent>
                <TextComponent style={styles.metaItem}>
                  {cantique.tempo}
                </TextComponent>
              </View>

              <TextComponent variante="subtitle3" style={styles.cantiqueNumber}>
                {cantique.number} - {cantique.title}
              </TextComponent>
            </View>

            {/* Sections */}
            {cantique.sections.map((section) => (
              <View key={section.id} style={styles.sectionContainer}>
                <View style={styles.sectionHeader}>
                  <TextComponent variante='subtitle3'>
                    {section.name} 
                  </TextComponent>
                </View>

                {renderSection(section)}
              </View>
            ))}

            {/* Lyrics regroupées en bas */}
            {cantique.sections.some(s => s.lyrics && s.lyrics.trim() !== '') && (
              <View style={styles.allLyricsContainer}>
                <View style={styles.lyricsHeaderContainer}>
                  <TextComponent variante='subtitle3' style={styles.lyricsHeader}>
                    Paroles
                  </TextComponent>
                </View>
                
                {cantique.sections.map((section) => (
                  section.lyrics && section.lyrics.trim() !== '' && (
                    <View key={`lyrics-${section.id}`} style={styles.lyricsSection}>
                      <TextComponent variante='body6' style={styles.lyricsSectionTitle}>
                        {section.name}
                      </TextComponent>
                      <TextComponent style={styles.lyricsText}>
                        {section.lyrics}
                      </TextComponent>
                    </View>
                  )
                ))}
              </View>
            )}

            {/* Footer */}
            <View style={styles.footer}>
              <TextComponent style={styles.metaItem}>
                Compositeur: {cantique.composer}
              </TextComponent>
              <TextComponent color={colors.primary} style={styles.footerText}>
                Le {new Date().toLocaleDateString('fr-FR')}
              </TextComponent>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}