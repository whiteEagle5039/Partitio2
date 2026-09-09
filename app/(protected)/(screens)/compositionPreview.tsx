import { useLocalSearchParams, useRouter } from 'expo-router';
import { Download, Edit3, Share2 } from 'lucide-react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, Share, StyleSheet, TouchableOpacity, View } from 'react-native';

import { EmptyState } from '@/components/uxComponents/EmptyState';
import { Content, Screen } from '@/components/uxComponents/Screen';
import { ScreenHeader } from '@/components/uxComponents/ScreenHeader';
import { TextComponent } from '@/components/uxComponents/TextComponent';
import { MIN_TOUCH_TARGET, elevation, touchSlop } from '@/constants/layout';
import { useResponsive } from '@/hooks/useResponsive';
import { useSheetTheme } from '@/hooks/useSheetTheme';
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

const hasVoiceContent = (voice: string): boolean =>
  !!voice && voice.trim() !== '' && voice.trim() !== '(vide)';

const hasSectionContent = (section: Section): boolean =>
  hasVoiceContent(section.soprano) ||
  hasVoiceContent(section.alto) ||
  hasVoiceContent(section.tenor) ||
  hasVoiceContent(section.bass);

export default function CompositionPreviewScreen() {
  const colors = useThemeColors();
  const sheet = useSheetTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  const { spacing, radius, icon, isTablet } = useResponsive();
  const { loadComposition, exportComposition } = useCompositionStorage();

  const [composition, setComposition] = useState<Composition | null>(null);
  const [loading, setLoading] = useState(true);
  const compositionId = params.id as string;

  const loadCompositionData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await loadComposition(compositionId);

      if (data) {
        setComposition(data);
      } else {
        console.warn("⚠️ Aucune composition trouvée pour l'ID:", compositionId);
      }
    } catch (error) {
      console.error('❌ Erreur chargement:', error);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [compositionId]);

  useEffect(() => {
    void loadCompositionData();
  }, [loadCompositionData]);

  const handleShare = async () => {
    if (!composition) return;

    const lyrics = composition.sections
      .filter((section) => section.lyrics && section.lyrics.trim() !== '')
      .map((section) => `${section.name}\n${section.lyrics}`)
      .join('\n\n');

    const message = [
      composition.title,
      composition.composer ? `Compositeur : ${composition.composer}` : '',
      lyrics,
    ]
      .filter(Boolean)
      .join('\n\n');

    try {
      await Share.share({ title: composition.title, message });
    } catch (error) {
      console.error('❌ Erreur lors du partage:', error);
    }
  };

  const handleExport = async () => {
    try {
      const json = await exportComposition(compositionId);
      if (!json) {
        Alert.alert('Erreur', 'Impossible d\'exporter cette composition');
        return;
      }

      await Share.share({ title: `${composition?.title ?? 'Composition'}.json`, message: json });
    } catch (error) {
      console.error('❌ Erreur lors de l\'export:', error);
      Alert.alert('Erreur', 'Impossible d\'exporter la composition');
    }
  };

  const styles = StyleSheet.create({
    actionButton: {
      minWidth: MIN_TOUCH_TARGET,
      minHeight: MIN_TOUCH_TARGET,
      alignItems: 'center',
      justifyContent: 'center',
    },
    page: {
      backgroundColor: sheet.paper,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: sheet.ruleStrong,
      padding: isTablet ? spacing.xl : spacing.md,
      ...elevation(1),
    },
    pageHeader: {
      marginBottom: spacing.lg,
      borderBottomWidth: 2,
      borderBottomColor: sheet.ruleStrong,
      paddingBottom: spacing.sm,
      gap: spacing.xs,
    },
    metaRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    section: {
      marginBottom: spacing.xl,
      gap: spacing.sm,
    },
    voiceRow: {
      flexDirection: 'row',
      gap: spacing.xs,
      paddingVertical: spacing.xs,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: sheet.rule,
    },
    voiceLabel: {
      width: 22,
    },
    emptySection: {
      padding: spacing.md,
      backgroundColor: sheet.highlight,
      borderRadius: radius.sm,
      alignItems: 'center',
    },
    lyricsContainer: {
      backgroundColor: sheet.highlight,
      padding: spacing.sm,
      borderRadius: radius.xs,
      marginTop: spacing.sm,
      borderLeftWidth: 3,
      borderLeftColor: colors.primary,
    },
    footer: {
      marginTop: spacing.xl,
      paddingTop: spacing.md,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: sheet.rule,
      alignItems: 'center',
    },
  });

  if (loading) {
    return (
      <Screen background={colors.card}>
        <ScreenHeader title="Composition" />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.sm }}>
          <ActivityIndicator size="large" color={colors.primary} />
          <TextComponent variante="body4" color={colors.text2}>
            Chargement...
          </TextComponent>
        </View>
      </Screen>
    );
  }

  if (!composition) {
    return (
      <Screen background={colors.card}>
        <ScreenHeader title="Composition" />
        <EmptyState
          variant="plain"
          title="Composition introuvable"
          subtitle="Cette composition n'existe plus ou n'a pas pu être chargée."
          actionText="Retour"
          onActionPress={() => router.back()}
        />
      </Screen>
    );
  }

  return (
    <Screen background={colors.card}>
      <ScreenHeader
        title={composition.title}
        subtitle={composition.composer}
        right={
          <>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => router.push(`/compose?id=${compositionId}`)}
              hitSlop={touchSlop}
              accessibilityRole="button"
              accessibilityLabel="Modifier"
            >
              <Edit3 size={icon.md} color={colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleShare}
              hitSlop={touchSlop}
              accessibilityRole="button"
              accessibilityLabel="Partager"
            >
              <Share2 size={icon.md} color={colors.icon} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleExport}
              hitSlop={touchSlop}
              accessibilityRole="button"
              accessibilityLabel="Exporter"
            >
              <Download size={icon.md} color={colors.icon} />
            </TouchableOpacity>
          </>
        }
      />

      <ScrollView
        style={{ flex: 1, backgroundColor: colors.background }}
        contentContainerStyle={{ paddingVertical: spacing.md }}
        showsVerticalScrollIndicator={false}
      >
        <Content width="wide">
          <View style={styles.page}>
            <View style={styles.pageHeader}>
              <View style={styles.metaRow}>
                <TextComponent variante="body5" color={sheet.inkMuted}>
                  {composition.key}
                </TextComponent>
                <TextComponent variante="body5" color={sheet.inkMuted}>
                  {composition.tempo}
                </TextComponent>
              </View>

              <TextComponent variante="subtitle2" color={sheet.ink} style={{ textAlign: 'center' }}>
                {composition.title}
              </TextComponent>
            </View>

            {composition.sections.map((section) => (
              <View key={section.id} style={styles.section}>
                <TextComponent variante="subtitle3" color={sheet.ink}>
                  {section.name}
                </TextComponent>

                {!hasSectionContent(section) ? (
                  <View style={styles.emptySection}>
                    <TextComponent variante="body5" color={sheet.inkMuted} style={{ fontStyle: 'italic' }}>
                      Cette partie ne contient pas de notes.
                    </TextComponent>
                  </View>
                ) : (
                  <View>
                    {(
                      [
                        ['S', section.soprano],
                        ['A', section.alto],
                        ['T', section.tenor],
                        ['B', section.bass],
                      ] as const
                    )
                      .filter(([, value]) => hasVoiceContent(value))
                      .map(([label, value]) => (
                        <View key={label} style={styles.voiceRow}>
                          <TextComponent variante="body6" color={sheet.ink} style={styles.voiceLabel}>
                            {label}
                          </TextComponent>
                          <TextComponent
                            variante="subtitle4"
                            color={sheet.ink}
                            style={{ flex: 1, letterSpacing: 1.5 }}
                          >
                            {value}
                          </TextComponent>
                        </View>
                      ))}
                  </View>
                )}

                {!!section.lyrics && section.lyrics.trim() !== '' && (
                  <View style={styles.lyricsContainer}>
                    <TextComponent variante="body4" color={sheet.ink}>
                      {section.lyrics}
                    </TextComponent>
                  </View>
                )}
              </View>
            ))}

            <View style={styles.footer}>
              <TextComponent variante="caption" color={colors.primary}>
                Le {new Date().toLocaleDateString('fr-FR')}
              </TextComponent>
            </View>
          </View>
        </Content>
      </ScrollView>
    </Screen>
  );
}
