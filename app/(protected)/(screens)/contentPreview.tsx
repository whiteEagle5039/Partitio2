import { useLocalSearchParams, useRouter } from 'expo-router';
import { Music, Share2, User } from 'lucide-react-native';
import React from 'react';
import { ScrollView, Share, StyleSheet, TouchableOpacity, View } from 'react-native';

import { EmptyState } from '@/components/uxComponents/EmptyState';
import { Badge } from '@/components/uxComponents/ListItemCard';
import { Content, Screen } from '@/components/uxComponents/Screen';
import { ScreenHeader } from '@/components/uxComponents/ScreenHeader';
import { TextComponent } from '@/components/uxComponents/TextComponent';
import { MIN_TOUCH_TARGET, elevation, touchSlop } from '@/constants/layout';
import { useResponsive } from '@/hooks/useResponsive';
import { useSheetTheme } from '@/hooks/useSheetTheme';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useAppStore } from '@/stores/appStore';

export default function ContentPreviewScreen() {
  const colors = useThemeColors();
  const sheet = useSheetTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  const { spacing, radius, icon, isTablet } = useResponsive();
  const { currentContent } = useAppStore();

  const contentId = params.id as string;
  const content = currentContent && currentContent.id === contentId ? currentContent : null;

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
      flexWrap: 'wrap',
      gap: spacing.xs,
    },
    body: {
      gap: spacing.sm,
    },
  });

  const handleShare = async () => {
    if (!content) return;

    const message = [content.title, content.description, content.content]
      .filter((part) => !!part && part.trim() !== '')
      .join('\n\n');

    try {
      await Share.share({ title: content.title, message });
    } catch (error) {
      console.error('❌ Erreur lors du partage:', error);
    }
  };

  if (!content) {
    return (
      <Screen background={colors.card}>
        <ScreenHeader title="Contenu" onBack={() => router.back()} />
        <EmptyState
          variant="plain"
          title="Contenu introuvable"
          subtitle="Ce contenu n'existe plus ou n'a pas pu être chargé."
          actionText="Retour"
          onActionPress={() => router.back()}
        />
      </Screen>
    );
  }

  return (
    <Screen background={colors.card}>
      <ScreenHeader
        title={content.title}
        onBack={() => router.back()}
        right={
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleShare}
            hitSlop={touchSlop}
            accessibilityRole="button"
            accessibilityLabel="Partager"
          >
            <Share2 size={icon.md} color={colors.icon} />
          </TouchableOpacity>
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
              <TextComponent variante="subtitle2" color={sheet.ink}>
                {content.title}
              </TextComponent>

              <View style={styles.metaRow}>
                {!!content.composer && (
                  <Badge label={content.composer} icon={<Music size={12} color={colors.primary} />} />
                )}
                {!!content.author && (
                  <Badge label={content.author} icon={<User size={12} color={colors.primary} />} />
                )}
              </View>
            </View>

            <View style={styles.body}>
              {!!content.description && (
                <TextComponent variante="body4" color={sheet.inkMuted} style={{ fontStyle: 'italic' }}>
                  {content.description}
                </TextComponent>
              )}

              {!!content.content && content.content.trim() !== '' ? (
                <TextComponent variante="body3" color={sheet.ink}>
                  {content.content}
                </TextComponent>
              ) : (
                <TextComponent variante="body5" color={sheet.inkMuted} style={{ fontStyle: 'italic' }}>
                  Ce contenu ne contient pas encore de texte.
                </TextComponent>
              )}
            </View>
          </View>
        </Content>
      </ScrollView>
    </Screen>
  );
}
