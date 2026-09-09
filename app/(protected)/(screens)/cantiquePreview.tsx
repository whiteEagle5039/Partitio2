import { useLocalSearchParams, useRouter } from 'expo-router';
import { Download, Heart, Share2 } from 'lucide-react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

import { EmptyState } from '@/components/uxComponents/EmptyState';
import { Content, Screen } from '@/components/uxComponents/Screen';
import { ScreenHeader } from '@/components/uxComponents/ScreenHeader';
import { TextComponent } from '@/components/uxComponents/TextComponent';
import { MIN_TOUCH_TARGET, elevation, touchSlop } from '@/constants/layout';
import { useResponsive } from '@/hooks/useResponsive';
import { useSheetTheme } from '@/hooks/useSheetTheme';
import { useThemeColors } from '@/hooks/useThemeColors';
import { Cantique } from '@/types/cantique';
import { useCantiqueStorage } from '@/utils/CantiqueStorage';

type Voice = { label: string; measures: string[] };

const parseMeasures = (voiceContent: string): string[] => {
  if (!voiceContent || voiceContent.trim() === '') return [];
  return voiceContent.split('|').map((m) => m.trim()).filter((m) => m !== '');
};

const getMeasureMinWidth = (voices: Voice[], measureIndex: number): number => {
  const maxLength = voices.reduce(
    (max, voice) => Math.max(max, voice.measures[measureIndex]?.length ?? 0),
    0,
  );
  return Math.max(60, 40 + maxLength * 4);
};

export default function CantiquePreviewScreen() {
  const colors = useThemeColors();
  const sheet = useSheetTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  const { spacing, radius, icon, width, isTablet } = useResponsive();
  const { getCantiqueById, isFavorite, addToFavorites, removeFromFavorites } = useCantiqueStorage();

  const [cantique, setCantique] = useState<Cantique | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFav, setIsFav] = useState(false);
  const cantiqueId = params.id as string;

  // Nombre de mesures par système : dépend de la largeur réelle disponible.
  const measuresPerLine = width >= 900 ? 6 : width >= 700 ? 5 : width >= 480 ? 4 : width >= 380 ? 3 : 2;

  const loadCantiqueData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getCantiqueById(cantiqueId);

      if (data) {
        setCantique(data);
        setIsFav(await isFavorite(cantiqueId));
      } else {
        console.warn("⚠️ Aucun cantique trouvé pour l'ID:", cantiqueId);
      }
    } catch (error) {
      console.error('❌ Erreur chargement:', error);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cantiqueId]);

  useEffect(() => {
    void loadCantiqueData();
  }, [loadCantiqueData]);

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
    system: {
      flexDirection: 'row',
      borderBottomWidth: 2,
      borderColor: sheet.ruleStrong,
      paddingVertical: spacing.xs,
      marginBottom: spacing.md,
    },
    voiceLabels: {
      width: 28,
      justifyContent: 'space-around',
      borderRightWidth: 2,
      borderRightColor: sheet.ruleStrong,
      paddingRight: spacing.xxs,
    },
    voiceLabelCell: {
      flex: 1,
      justifyContent: 'center',
    },
    measureColumn: {
      borderRightWidth: 1,
      borderRightColor: sheet.rule,
      paddingHorizontal: spacing.xxs,
    },
    voiceInMeasure: {
      flex: 1,
      justifyContent: 'center',
      paddingVertical: spacing.xxs,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: sheet.rule,
    },
    emptySection: {
      padding: spacing.md,
      backgroundColor: sheet.highlight,
      borderRadius: radius.sm,
      alignItems: 'center',
    },
    lyricsBlock: {
      marginTop: spacing.xl,
      borderTopWidth: 2,
      borderTopColor: sheet.ruleStrong,
      paddingTop: spacing.lg,
      gap: spacing.md,
    },
    lyricsSection: {
      padding: spacing.sm,
      borderLeftWidth: 3,
      borderLeftColor: colors.primary,
      backgroundColor: sheet.highlight,
      borderRadius: radius.xs,
      gap: spacing.xxs,
    },
    footer: {
      marginTop: spacing.xl,
      paddingTop: spacing.md,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: sheet.rule,
      alignItems: 'center',
      gap: spacing.xxs,
    },
  });

  const renderSection = (section: any) => {
    const voices: Voice[] = (
      [
        ['S', section.soprano],
        ['A', section.alto],
        ['T', section.tenor],
        ['B', section.bass],
      ] as const
    )
      .filter(([, value]) => value && value.trim() !== '')
      .map(([label, value]) => ({ label, measures: parseMeasures(value) }));

    if (voices.length === 0) {
      return (
        <View style={styles.emptySection}>
          <TextComponent variante="body5" color={sheet.inkMuted} style={{ fontStyle: 'italic' }}>
            Cette partie ne contient pas de notes.
          </TextComponent>
        </View>
      );
    }

    const maxMeasures = Math.max(...voices.map((v) => v.measures.length));
    const numberOfLines = Math.ceil(maxMeasures / measuresPerLine);

    return (
      <View>
        {Array.from({ length: numberOfLines }).map((_, lineIndex) => {
          const startMeasure = lineIndex * measuresPerLine;
          const endMeasure = Math.min(startMeasure + measuresPerLine, maxMeasures);

          return (
            <View key={lineIndex} style={styles.system}>
              <View style={styles.voiceLabels}>
                {voices.map((voice) => (
                  <View key={voice.label} style={styles.voiceLabelCell}>
                    <TextComponent variante="body6" color={sheet.ink} style={{ textAlign: 'center' }}>
                      {voice.label}
                    </TextComponent>
                  </View>
                ))}
              </View>

              {Array.from({ length: endMeasure - startMeasure }).map((_, measureOffset) => {
                const measureIndex = startMeasure + measureOffset;

                return (
                  <View
                    key={measureIndex}
                    style={[
                      styles.measureColumn,
                      { flex: 1, minWidth: getMeasureMinWidth(voices, measureIndex) },
                    ]}
                  >
                    {voices.map((voice) => (
                      <View key={`${voice.label}-${measureIndex}`} style={styles.voiceInMeasure}>
                        <TextComponent
                          variante="subtitle4"
                          color={sheet.ink}
                          style={{ letterSpacing: 0.5 }}
                        >
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

  if (loading) {
    return (
      <Screen background={colors.card}>
        <ScreenHeader title="Cantique" />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.sm }}>
          <ActivityIndicator size="large" color={colors.primary} />
          <TextComponent variante="body4" color={colors.text2}>
            Chargement...
          </TextComponent>
        </View>
      </Screen>
    );
  }

  if (!cantique) {
    return (
      <Screen background={colors.card}>
        <ScreenHeader title="Cantique" />
        <EmptyState
          variant="plain"
          title="Cantique introuvable"
          subtitle="Ce cantique n'existe plus ou n'a pas pu être chargé."
          actionText="Retour"
          onActionPress={() => router.back()}
        />
      </Screen>
    );
  }

  return (
    <Screen background={colors.card}>
      <ScreenHeader
        title={`Cantique ${cantique.number}`}
        subtitle={cantique.title}
        right={
          <>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleToggleFavorite}
              hitSlop={touchSlop}
              accessibilityRole="button"
              accessibilityLabel={isFav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
            >
              <Heart
                size={icon.md}
                color={isFav ? colors.primary : colors.icon}
                fill={isFav ? colors.primary : 'transparent'}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => {}}
              hitSlop={touchSlop}
              accessibilityRole="button"
              accessibilityLabel="Partager"
            >
              <Share2 size={icon.md} color={colors.icon} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => {}}
              hitSlop={touchSlop}
              accessibilityRole="button"
              accessibilityLabel="Télécharger"
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
                  {cantique.key}
                </TextComponent>
                <TextComponent variante="body5" color={sheet.inkMuted}>
                  {cantique.tempo}
                </TextComponent>
              </View>

              <TextComponent variante="subtitle2" color={sheet.ink} style={{ textAlign: 'center' }}>
                {cantique.number} — {cantique.title}
              </TextComponent>
            </View>

            {cantique.sections.map((section) => (
              <View key={section.id} style={styles.section}>
                <TextComponent variante="subtitle3" color={sheet.ink}>
                  {section.name}
                </TextComponent>
                {renderSection(section)}
              </View>
            ))}

            {cantique.sections.some((s) => s.lyrics && s.lyrics.trim() !== '') && (
              <View style={styles.lyricsBlock}>
                <TextComponent variante="subtitle3" color={colors.primary} style={{ textAlign: 'center' }}>
                  Paroles
                </TextComponent>

                {cantique.sections.map(
                  (section) =>
                    section.lyrics &&
                    section.lyrics.trim() !== '' && (
                      <View key={`lyrics-${section.id}`} style={styles.lyricsSection}>
                        <TextComponent variante="body6" color={sheet.inkMuted}>
                          {section.name}
                        </TextComponent>
                        <TextComponent variante="body4" color={sheet.ink}>
                          {section.lyrics}
                        </TextComponent>
                      </View>
                    ),
                )}
              </View>
            )}

            <View style={styles.footer}>
              <TextComponent variante="body5" color={sheet.inkMuted}>
                Compositeur : {cantique.composer}
              </TextComponent>
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
