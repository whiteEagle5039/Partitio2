import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Menu, 
  TableConfig,
  Search, 
  Library, 
  PenTool, 
  Music,
  WifiOff,
  CloudOff,
  Heart,
  TrendingUp,
  Clock
} from 'lucide-react-native';
import { TextComponent, TextComponentHeading } from '@/components/TextComponent';
import { SheetMusicCard } from '@/components/SheetMusicCard';
import { WrapperComponent } from '@/components/WrapperComponent';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useAppStore } from '@/stores/appStore';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const colors = useThemeColors();
  const router = useRouter();
  
  // ✅ CORRECTION: Utiliser les états du store
  const { 
    sheetMusic, 
    setDrawerOpen, 
    downloadedSheets, 
    isDrawerOpen, 
    user,
    isOnline,           // ✅ Du store
    setOnline,          // ✅ Du store
    isAuthenticated,    // ✅ Du store
    setAuthenticated    // ✅ Du store
  } = useAppStore();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.card,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 10,
      paddingVertical: 10,
      backgroundColor: colors.card,
    },
    logo: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    logoText: {
      marginLeft: 12,
    },
    menuButton: {
      padding: 8,
    },
    scrollView: {
      flex: 1,
      backgroundColor: colors.background
    },
    connectionStatus: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 12,
      paddingVertical: 6,
      marginHorizontal: 20,
      marginBottom: 10,
      borderRadius: 20,
      borderWidth: 1,
      gap: 8,
    },
    quickActions: {
      flexDirection: 'column',
      paddingHorizontal: 20,
      paddingVertical: 24,
      gap: 12,
    },
    quickActionCard: {
      flex: 1,
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 15,
      gap: 12,
      flexDirection: 'row',
      alignItems: 'center',
      textAlign: 'center',
      borderColor: colors.border,
      borderWidth: 1,
    },
    quickActionIcon: {
      marginBottom: 8,
    },
    section: {
      paddingVertical: 16,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      marginBottom: 16,
    },
    seeAllButton: {
      padding: 8,
    },
    horizontalScroll: {
      paddingLeft: 20,
    },
    emptyWrapper: {
      width: '100%',         
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 20,
      flexDirection: 'row', 
      gap: 20
    },
    emptyStateCard: {
      marginHorizontal: 20,
      padding: 24,
      borderRadius: 16,
      borderWidth: 1,
      alignItems: 'center',
      marginBottom: 8,
    },
    emptyStateIcon: {
      width: 64,
      height: 64,
      borderRadius: 32,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 16,
    },
    emptyStateTitle: {
      textAlign: 'center',
      marginBottom: 8,
    },
    emptyStateSubtitle: {
      textAlign: 'center',
      marginBottom: 16,
      lineHeight: 20,
    },
    emptyStateButton: {
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 20,
      marginTop: 8,
    },
  });

  // Composant pour l'état vide
  const EmptyStateCard = ({ 
    icon: IconComponent, 
    title, 
    subtitle, 
    actionText, 
    onActionPress, 
    colors 
  }: any) => {
    return (
      <View 
        style={[
          styles.emptyStateCard, 
          { 
            backgroundColor: colors.card,
            borderColor: colors.border,
          }
        ]}
      >
        <View style={[styles.emptyStateIcon, { backgroundColor: `${colors.primary}15` }]}>
          <IconComponent size={32} color={colors.primary2} />
        </View>
        <TextComponent variante="subtitle2" style={styles.emptyStateTitle}>
          {title}
        </TextComponent>
        <TextComponent variante="body3" color={colors.textSecondary} style={styles.emptyStateSubtitle}>
          {subtitle}
        </TextComponent>
        {actionText && onActionPress && (
          <TouchableOpacity 
            style={[styles.emptyStateButton, { backgroundColor: colors.cardForeground }]}
            onPress={onActionPress}
          >
            <TextComponent variante="body3" color={colors.primaryForeground}>
              {actionText}
            </TextComponent>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  // Composant pour l'indicateur de connexion
  const ConnectionStatus = ({ isOnline, colors }: any) => {
    if (isOnline) return null;

    return (
      <View 
        style={[
          styles.connectionStatus, 
          { 
            backgroundColor: `${colors.blueSingle}20`,
            borderColor: colors.blueSingle
            ,
          }
        ]}
      >
        <WifiOff size={16} color={colors.blueSingle} />
        <TextComponent variante="body4" color={colors.blueSingle}>
          Hors connexion
        </TextComponent>
      </View>
    );
  };

  const quickActions = [
    {
      icon: Search,
      label: 'Rechercher',
      color: colors.primary2,
      onPress: () => router.push('/search'),
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
      onPress: () => router.push('/library'),
    },
  ];

  const recentSheets = sheetMusic.slice(0, 5);
  const hasTrendingContent = sheetMusic && sheetMusic.length > 0;
  const hasRecentContent = recentSheets && recentSheets.length > 0;

  const renderTrendingSection = () => {
    if (!isOnline) {
      return (
        <EmptyStateCard
          icon={WifiOff}
          title="Connexion requise"
          subtitle="Les tendances ne sont disponibles qu'en ligne. Vérifiez votre connexion internet."
          actionText="Réessayer"
          onActionPress={() => setOnline(true)} // ✅ CORRECTION: Utilise setOnline du store
          colors={colors}
        />
      );
    }

    if (!isAuthenticated) {
      return (
        <EmptyStateCard
          icon={TrendingUp}
          title="Découvrez les tendances"
          subtitle="Connectez-vous pour voir les partitions les plus populaires de la communauté."
          actionText="Se connecter"
          onActionPress={() => router.push('/homescreen')} // ✅ CORRECTION: Route vers login
          colors={colors}
        />
      );
    }

    if (!hasTrendingContent) {
      return (
        <EmptyStateCard
          icon={Heart}
          title="Aucune tendance pour le moment"
          subtitle="Soyez le premier à découvrir de nouvelles partitions populaires."
          actionText="Explorer"
          onActionPress={() => router.push('/search')}
          colors={colors}
        />
      );
    }

    return (
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.horizontalScroll}
      >
        {sheetMusic.map((sheet: any) => (
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
  };

  const renderRecentSection = () => {
    if (!hasRecentContent) {
      return (
        <EmptyStateCard
          icon={Clock}
          title="Aucune partition récente"
          subtitle="Commencez à explorer notre bibliothèque pour voir vos dernières découvertes ici."
          actionText="Découvrir"
          onActionPress={() => router.push('/search')}
          colors={colors}
        />
      );
    }

    return (
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.horizontalScroll}
      >
        {recentSheets.map((sheet: any) => (
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
  };

  return (
    <WrapperComponent>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logo}>
            <TextComponent variante='body1' style={styles.logoText}>
              Partitio
            </TextComponent>
          </View>
          
          <TouchableOpacity 
            style={styles.menuButton}
            onPress={() => setDrawerOpen(!isDrawerOpen)}
          >
            <Menu size={32} color={colors.icon} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Statut de connexion */}
          <ConnectionStatus isOnline={isOnline} colors={colors} />

          {/* Actions rapides */}
          <View style={styles.quickActions}>
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={styles.quickActionCard}
                onPress={action.onPress}
              >
                <action.icon 
                  size={32} 
                  color={action.color} 
                  style={styles.quickActionIcon} 
                />
                <TextComponent variante="subtitle1" style={{ textAlign: 'center' }}>
                  {action.label}
                </TextComponent>
              </TouchableOpacity>
            ))}
          </View>

          {/* Partitions populaires */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <TextComponent variante="subtitle1">
                Tendances
              </TextComponent>
              {(isOnline && isAuthenticated && hasTrendingContent) && (
                <TouchableOpacity 
                  style={styles.seeAllButton}
                  onPress={() => router.push('/search')}
                >
                  <TextComponent variante="body3" color={colors.primary}>
                    Explorer
                  </TextComponent>
                </TouchableOpacity>
              )}
            </View>
            
            {renderTrendingSection()}
          </View>

          {/* Partitions récentes */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <TextComponent variante="subtitle1">
                Récemment ajoutées
              </TextComponent>
            </View>
            
            {renderRecentSection()}
          </View>
        </ScrollView>
      </SafeAreaView>
    </WrapperComponent>
  );
}