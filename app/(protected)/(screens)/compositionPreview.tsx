import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Download, Share2, Edit3 } from 'lucide-react-native';
import { TextComponent } from '@/components/uxComponents/TextComponent';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useCompositionStorage } from '@/utils/CompositionStorage';

interface Section {
  id: string;
  name: string;
  soprano: string;
  alto: string;
  tenor: string;
  bass: string;
  lyrics?: string;
}

interface Composition {
  title: string;
  tempo: string;
  key: string;
  sections: Section[];
  composer?: string;
}

export default function CompositionPreviewScreen() {
  const colors = useThemeColors();
  const router = useRouter();
  const params = useLocalSearchParams();
  const { loadComposition } = useCompositionStorage();
  
  const [composition, setComposition] = useState<Composition | null>(null);
  const [loading, setLoading] = useState(true);
  const compositionId = params.id as string;

  useEffect(() => {
    loadCompositionData();
  }, [compositionId]);

  const loadCompositionData = async () => {
    try {
      setLoading(true);
      const data = await loadComposition(compositionId);
      if (data) {
        console.log('📄 Composition chargée:', data);
        setComposition(data);
      } else {
        console.warn('⚠️ Aucune composition trouvée pour l\'ID:', compositionId);
      }
    } catch (error) {
      console.error('❌ Erreur chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    router.push(`/compose?id=${compositionId}`);
  };

  const handleShare = () => {
    console.log('📤 Partage de la composition');
  };

  const handleExport = () => {
    console.log('💾 Export en PDF');
  };

  // ✅ Fonction pour vérifier si une voix a du contenu
  const hasVoiceContent = (voice: string): boolean => {
    return voice && voice.trim() !== '' && voice.trim() !== '(vide)';
  };

  // ✅ Fonction pour vérifier si une section a au moins une voix non vide
  const hasSectionContent = (section: Section): boolean => {
    return hasVoiceContent(section.soprano) ||
           hasVoiceContent(section.alto) ||
           hasVoiceContent(section.tenor) ||
           hasVoiceContent(section.bass);
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
    compositionTitle: {
      textAlign: 'center',
    },
    compositionMeta: {
      flexDirection: 'row',
      justifyContent: 'space-between'
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
    lyricsContainer: {
      backgroundColor: '#f9f9f9',
      padding: 12,
      borderRadius: 4,
      marginBottom: 16,
      borderLeftWidth: 3,
      borderLeftColor: colors.primary,
      marginTop: 15,
    },
    lyricsText: {
      fontSize: 14,
      color: '#333',
      lineHeight: 20,
    },
    voiceRow: {
      flexDirection: 'row',
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#e0e0e0',
    },
    voiceLabel: {
      width: 60,
      fontSize: 14,
      fontWeight: '600',
      color: '#000',
    },
    voiceContent: {
      flex: 1,
      fontSize: 13,
      color: '#333',
      fontFamily: 'monospace',
      letterSpacing: 2,
    },
    emptyVoice: {
      color: '#999',
      fontStyle: 'italic',
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

  if (!composition) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
        <View style={styles.loadingContainer}>
          <TextComponent variante="subtitle2">
            Composition introuvable
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
              {composition.title}
            </TextComponent>
          </View>
        </View>
        
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.actionButton} onPress={handleEdit}>
            <Edit3 size={20} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
            <Share2 size={20} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleExport}>
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
              <View style={styles.compositionMeta}>
                <TextComponent style={styles.metaItem}>
                  {composition.key}
                </TextComponent>
                <TextComponent style={styles.metaItem}>
                  {composition.tempo}
                </TextComponent>
              </View>
              <View>
                <TextComponent variante="subtitle2" style={styles.compositionTitle}>
                  {composition.title}
                </TextComponent>
              </View>
            </View>

            {/* Sections */}
            {composition.sections.map((section, index) => (
              <View key={section.id} style={styles.sectionContainer}>
                <View style={styles.sectionHeader}>
                  <TextComponent variante='subtitle3'>
                    {section.name} :
                  </TextComponent>
                </View>

                {/* ✅ Vérifier si la section a du contenu */}
                {!hasSectionContent(section) ? (
                  <View style={styles.emptySectionMessage}>
                    <TextComponent style={styles.emptySectionText}>
                      Cette partie ne contient pas de notes.
                    </TextComponent>
                  </View>
                ) : (
                  <View>
                    {/* ✅ Soprano - Afficher seulement si non vide */}
                    {hasVoiceContent(section.soprano) && (
                      <View style={styles.voiceRow}>
                        <TextComponent style={styles.voiceLabel}>
                          Soprano
                        </TextComponent>
                        <TextComponent style={styles.voiceContent}>
                          {section.soprano}
                        </TextComponent>
                      </View>
                    )}

                    {/* ✅ Alto - Afficher seulement si non vide */}
                    {hasVoiceContent(section.alto) && (
                      <View style={styles.voiceRow}>
                        <TextComponent style={styles.voiceLabel}>
                          Alto
                        </TextComponent>
                        <TextComponent style={styles.voiceContent}>
                          {section.alto}
                        </TextComponent>
                      </View>
                    )}

                    {/* ✅ Tenor - Afficher seulement si non vide */}
                    {hasVoiceContent(section.tenor) && (
                      <View style={styles.voiceRow}>
                        <TextComponent style={styles.voiceLabel}>
                          Ténor
                        </TextComponent>
                        <TextComponent style={styles.voiceContent}>
                          {section.tenor}
                        </TextComponent>
                      </View>
                    )}

                    {/* ✅ Bass - Afficher seulement si non vide */}
                    {hasVoiceContent(section.bass) && (
                      <View style={styles.voiceRow}>
                        <TextComponent style={styles.voiceLabel}>
                          Basse
                        </TextComponent>
                        <TextComponent style={styles.voiceContent}>
                          {section.bass}
                        </TextComponent>
                      </View>
                    )}
                  </View>
                )}

                {/* Lyrics if available */}
                {section.lyrics && section.lyrics.trim() !== '' && (
                  <View style={styles.lyricsContainer}>
                    <TextComponent style={styles.lyricsText}>
                      {section.lyrics}
                    </TextComponent>
                  </View>
                )}
              </View>
            ))}

            {/* Footer */}
            <View style={styles.footer}>
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