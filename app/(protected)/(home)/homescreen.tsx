import { useFocusEffect, useRouter } from 'expo-router';
import { BookOpen, Clock, Heart, Library, Menu, Music, PenTool, Search, TrendingUp, WifiOff } from 'lucide-react-native';
import React, { useCallback, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

import { SheetMusicCard } from '@/components/musicComponents/SheetMusicCard';
import { EmptyState } from '@/components/uxComponents/EmptyState';
import { Content, Screen } from '@/components/uxComponents/Screen';
import { TextComponent } from '@/components/uxComponents/TextComponent';
import { WrapperComponent } from '@/components/WrapperComponent';
import { MIN_TOUCH_TARGET, elevation, touchSlop } from '@/constants/layout';
import { useResponsive } from '@/hooks/useResponsive';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useAppStore } from '@/stores/appStore';
import { Cantique } from '@/types/cantique';
import { useCantiqueStorage } from '@/utils/CantiqueStorage';

/** La section « Tendances » est masquée en attendant le back-end. */
const SHOW_TRENDING = false;

export default function HomeScreen() {
  const colors = useThemeColors();
  const router = useRouter();
  const { spacing, radius, icon, gutter, isTablet, width, maxWideWidth } = useResponsive();

  const {
    sheetMusic,
    setDrawerOpen,
    isDrawerOpen,
    isOnline,
    setOnline,
    isAuthenticated,
    categories,
    setCurrentCategory,
  } = useAppStore();
  const { getRecentlyViewedCantiques } = useCantiqueStorage();

  const [recentCantiques, setRecentCantiques] = useState<Cantique[]>([]);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      getRecentlyViewedCantiques(5).then((data) => {
        if (isActive) setRecentCantiques(data);
      });

      return () => {
        isActive = false;
      };
      // getRecentlyViewedCantiques provient d'un hook de stockage recréé à chaque rendu.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  // Les cartes d'action passent d'une colonne (téléphone) à une grille dès que
  // la largeur le permet. La largeur est calculée explicitement (et non en
  // pourcentages) pour que les gouttières n'entraînent pas de retour à la ligne.
  const MIN_ACTION_WIDTH = 220;
  const availableWidth = Math.min(width, maxWideWidth) - gutter * 2;
  const actionColumns = Math.max(
    1,
    Math.min(3, Math.floor((availableWidth + spacing.sm) / (MIN_ACTION_WIDTH + spacing.sm))),
  );
  const actionCardWidth =
    (availableWidth - spacing.sm * (actionColumns - 1)) / actionColumns;

  const styles = useMemo(
    () =>
      StyleSheet.create({
        header: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: gutter - spacing.xs,
          paddingVertical: spacing.xs,
          backgroundColor: colors.card,
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: colors.border,
        },
        headerRight: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing.xxs,
        },
        iconButton: {
          minWidth: MIN_TOUCH_TARGET,
          minHeight: MIN_TOUCH_TARGET,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: radius.md,
        },
        scrollView: {
          flex: 1,
          backgroundColor: colors.background,
        },
        scrollContent: {
          paddingBottom: spacing.xxl,
        },
        quickActions: {
          flexDirection: 'row',
          flexWrap: 'wrap',
          paddingVertical: spacing.lg,
          gap: spacing.sm,
        },
        quickActionCard: {
          width: actionCardWidth,
          backgroundColor: colors.card,
          borderRadius: radius.lg,
          padding: spacing.md,
          gap: spacing.sm,
          flexDirection: actionColumns === 1 ? 'row' : 'column',
          alignItems: 'center',
          justifyContent: actionColumns === 1 ? 'flex-start' : 'center',
          borderColor: colors.border,
          borderWidth: 1,
          minHeight: actionColumns === 1 ? MIN_TOUCH_TARGET + spacing.md : 112,
        },
        section: {
          paddingBottom: spacing.lg,
        },
        sectionHeader: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: spacing.sm,
        },
        horizontalScroll: {
          paddingHorizontal: gutter,
          gap: spacing.sm,
          paddingBottom: spacing.xxs,
        },
        recentCard: {
          width: 160,
          backgroundColor: colors.card,
          borderRadius: radius.lg,
          borderWidth: 1,
          borderColor: colors.border,
          padding: spacing.sm,
          gap: spacing.xxs,
          ...elevation(1),
        },
        recentIconBadge: {
          width: 36,
          height: 36,
          borderRadius: radius.md,
          backgroundColor: `${colors.primary}18`,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: spacing.xxs,
        },
      }),
    [actionCardWidth, actionColumns, colors, gutter, radius, spacing],
  );

  const quickActions = [
    {
      icon: BookOpen,
      label: 'Cantiques',
      color: colors.primary2,
      onPress: () => {
        const cantiquesCategory = categories.find((cat) => cat.id === '2');
        if (cantiquesCategory) {
          setCurrentCategory(cantiquesCategory);
        }
        router.push('/library');
      },
    },
    {
      icon: PenTool,
      label: 'Composer',
      color: colors.primary2,
      onPress: () => router.push('/compose'),
    },
    {
      icon: Library,
      label: 'Bibliothèque',
      color: colors.primary2,
      onPress: () => {
        setCurrentCategory(null);
        router.push('/library');
      },
    },
  ];

  const hasTrendingContent = sheetMusic && sheetMusic.length > 0;
  const hasRecentContent = recentCantiques.length > 0;

  const renderHorizontalList = (sheets: any[]) => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.horizontalScroll}
    >
      {sheets.map((sheet: any) => (
        <SheetMusicCard
          key={sheet.id}
          title={sheet.title}
          composer={sheet.composer}
          thumbnail={sheet.thumbnail}
          isDownloaded={sheet.isDownloaded}
          onPress={() => console.log(`Ouvrir ${sheet.title}`)}
        />
      ))}
    </ScrollView>
  );

  const renderRecentCantiques = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.horizontalScroll}
    >
      {recentCantiques.map((cantique) => (
        <TouchableOpacity
          key={cantique.id}
          style={styles.recentCard}
          activeOpacity={0.85}
          accessibilityRole="button"
          onPress={() => router.push(`/cantiquePreview?id=${cantique.id}`)}
        >
          <View style={styles.recentIconBadge}>
            <Music size={icon.sm} color={colors.primary} />
          </View>
          <TextComponent variante="subtitle3" color={colors.text} numberOfLines={1}>
            {cantique.number} — {cantique.title}
          </TextComponent>
          <TextComponent variante="caption" color={colors.text2} numberOfLines={1}>
            {cantique.composer}
          </TextComponent>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderTrendingSection = () => {
    if (!isOnline) {
      return (
        <Content>
          <EmptyState
            icon={WifiOff}
            title="Connexion requise"
            subtitle="Les tendances ne sont disponibles qu'en ligne. Vérifiez votre connexion internet."
            actionText="Réessayer"
            onActionPress={() => setOnline(true)}
          />
        </Content>
      );
    }

    if (!isAuthenticated) {
      return (
        <Content>
          <EmptyState
            icon={TrendingUp}
            title="Découvrez les tendances"
            subtitle="Connectez-vous pour voir les notes les plus populaires de la communauté."
            actionText="Se connecter"
            onActionPress={() => router.push('/homescreen')}
          />
        </Content>
      );
    }

    if (!hasTrendingContent) {
      return (
        <Content>
          <EmptyState
            icon={Heart}
            title="Aucune tendance pour le moment"
            subtitle="Soyez le premier à découvrir de nouvelles partitions populaires."
            actionText="Explorer"
            onActionPress={() => router.push('/search')}
          />
        </Content>
      );
    }

    return renderHorizontalList(sheetMusic);
  };

  const renderRecentSection = () => {
    if (!hasRecentContent) {
      return (
        <Content>
          <EmptyState
            icon={Clock}
            title="Aucune partition récente"
            subtitle="Commencez à explorer notre bibliothèque pour voir vos dernières découvertes ici."
            actionText="Découvrir"
            onActionPress={() => router.push('/search')}
          />
        </Content>
      );
    }

    return renderRecentCantiques();
  };

  return (
    <WrapperComponent>
      <Screen background={colors.card}>
        <View style={styles.header}>
          <TextComponent variante={isTablet ? 'subtitle0' : 'subtitle1'} color={colors.text}>
            Harmonia
          </TextComponent>

          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => router.push('/search')}
              hitSlop={touchSlop}
              accessibilityRole="button"
              accessibilityLabel="Rechercher"
            >
              <Search size={icon.lg} color={colors.icon} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => setDrawerOpen(!isDrawerOpen)}
              hitSlop={touchSlop}
              accessibilityRole="button"
              accessibilityLabel="Ouvrir le menu"
            >
              <Menu size={icon.xl} color={colors.icon} />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Actions rapides */}
          <Content width="wide">
            <View style={styles.quickActions}>
              {quickActions.map((action) => (
                <TouchableOpacity
                  key={action.label}
                  style={styles.quickActionCard}
                  onPress={action.onPress}
                  activeOpacity={0.85}
                  accessibilityRole="button"
                >
                  <action.icon size={icon.lg} color={action.color} />
                  <TextComponent variante="subtitle2" color={colors.text} style={{ textAlign: 'center' }}>
                    {action.label}
                  </TextComponent>
                </TouchableOpacity>
              ))}
            </View>
          </Content>

          {/* Partitions récentes */}
          <View style={styles.section}>
            <Content>
              <View style={styles.sectionHeader}>
                <TextComponent variante="subtitle1" color={colors.text}>
                  Récents
                </TextComponent>
              </View>
            </Content>

            {renderRecentSection()}
          </View>

          {/* Tendances */}
          {SHOW_TRENDING && (
            <View style={styles.section}>
              <Content>
                <View style={styles.sectionHeader}>
                  <TextComponent variante="subtitle1" color={colors.text}>
                    Tendances
                  </TextComponent>
                  {isOnline && isAuthenticated && hasTrendingContent && (
                    <TouchableOpacity onPress={() => router.push('/search')} hitSlop={touchSlop}>
                      <TextComponent variante="body4" color={colors.primary}>
                        Explorer
                      </TextComponent>
                    </TouchableOpacity>
                  )}
                </View>
              </Content>

              {renderTrendingSection()}
            </View>
          )}
        </ScrollView>
      </Screen>
    </WrapperComponent>
  );
}
