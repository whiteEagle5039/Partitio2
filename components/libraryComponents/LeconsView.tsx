import { TextComponent } from '@/components/uxComponents/TextComponent';
import { useThemeColors } from '@/hooks/useThemeColors';
import { Category, Content, Folder as FolderType } from '@/stores/appStore';
import { Folder, Music, Play, User } from 'lucide-react-native';
import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

interface LeconsViewProps {
  category: Category;
  currentFolder: FolderType | null;
  onFolderPress: (folder: FolderType) => void;
  onContentPress: (content: Content) => void;
  onBack: () => void;
}

export const LeconsView: React.FC<LeconsViewProps> = ({ 
  category, 
  currentFolder, 
  onFolderPress, 
  onContentPress,
  onBack
}) => {
  const colors = useThemeColors();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    scrollContainer: {
      paddingHorizontal: 20,
      paddingBottom: 20,
    },
    // Stats Container
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
      padding: 40,
      alignItems: 'center',
      borderColor: colors.border,
      borderWidth: 1,
    },
    statIcon: {
      marginBottom: 8,
      width: 50,
      height: 50,
      borderRadius: 30,
      alignItems: 'center',
      justifyContent: 'center',
    },
    // List Items
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
    packageDetails: {
      marginTop: 4,
    },
    packageInfo: {
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
    contentStatus: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginTop: 8,
    },
    // Empty State
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
      backgroundColor: colors.primary,
    },
  });

  // Gestionnaires d'événements
  const handleFolderPress = (folder: FolderType) => {
    console.log(`Ouvrir le dossier: ${folder.name}`);
    onFolderPress(folder);
  };

  const handleContentPress = (content: Content) => {
    console.log(`Ouvrir le contenu: ${content.title}`);
    onContentPress(content);
  };

  // Composants pour l'état vide
  const EmptyFoldersCard = () => (
    <View style={styles.emptyStateCard}>
      <View style={[styles.emptyStateIcon, { backgroundColor: `${colors.primary}15` }]}>
        <Folder size={40} color={colors.primary2} />
      </View>
      <TextComponent variante="subtitle2" style={styles.emptyStateTitle}>
        Aucune leçon disponible
      </TextComponent>
      <TextComponent variante="body3" color={colors.text2} style={styles.emptyStateSubtitle}>
        La catégorie "Leçons" ne contient pas encore de leçons. Revenez plus tard pour découvrir de nouvelles leçons.
      </TextComponent>
      <TouchableOpacity 
        style={styles.emptyStateButton}
        onPress={onBack}
      >
        <TextComponent variante="body3" color="#FFFFFF">
          Retour aux catégories
        </TextComponent>
      </TouchableOpacity>
    </View>
  );

  const EmptyCoursesCard = () => (
    <View style={styles.emptyStateCard}>
      <View style={[styles.emptyStateIcon, { backgroundColor: `${colors.primary}15` }]}>
        <Play size={40} color={colors.primary2} />
      </View>
      <TextComponent variante="subtitle2" style={styles.emptyStateTitle}>
        Aucun cours disponible
      </TextComponent>
      <TextComponent variante="body3" color={colors.text2} style={styles.emptyStateSubtitle}>
        Cette leçon ne contient pas encore de cours. L'auteur ajoutera prochainement du contenu.
      </TextComponent>
      <TouchableOpacity 
        style={styles.emptyStateButton}
        onPress={() => onFolderPress(null as any)} // Retour aux dossiers
      >
        <TextComponent variante="body3" color="#FFFFFF">
          Retour aux leçons
        </TextComponent>
      </TouchableOpacity>
    </View>
  );

  // Rendu des statistiques selon le contexte
  const renderStats = () => {
    if (!currentFolder) {
      // Statistiques pour la vue des dossiers
      return (
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, { flex: 1, alignItems: 'center' }]}>
            <TextComponent variante="subtitle1">{category.folderCount}</TextComponent>
            <TextComponent variante="body4" color={colors.text2}>Leçons</TextComponent>
          </View>
        </View>
      );
    } else {
      // Statistiques pour la vue des cours dans un dossier
      return (
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, { flex: 2 }]}>
            <View style={[styles.statIcon, { backgroundColor: `${colors.primary}15` }]}>
              <User size={20} color={colors.primary} />
            </View>
            <TextComponent variante="body3" color={colors.text2}>Auteur</TextComponent>
            <TextComponent variante="subtitle3">{currentFolder.author || "Non spécifié"}</TextComponent>
          </View>
          
          <View style={[styles.statCard, { flex: 1 }]}>
            <View style={[styles.statIcon, { backgroundColor: `${colors.primary}15` }]}>
              <Music size={20} color={colors.primary} />
            </View>
            <TextComponent variante="subtitle1">{currentFolder.courseCount}</TextComponent>
            <TextComponent variante="body4" color={colors.text2}>Cours</TextComponent>
          </View>
        </View>
      );
    }
  };

  // Rendu des dossiers
  const renderFolders = () => (
    <ScrollView 
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContainer}
    >
      {category.folders.map((folder: FolderType) => (
        <TouchableOpacity
          key={folder.id}
          style={styles.listItem}
          onPress={() => handleFolderPress(folder)}
        >
          <View style={[styles.listThumbnail, { backgroundColor: `${colors.primary}15` }]}>
            <Folder size={24} color={colors.primary2} />
          </View>
          <View style={styles.listContent}>
            <TextComponent variante="subtitle2" style={styles.listTitle}>
              {folder.name}
            </TextComponent>
            <TextComponent variante="body4" color={colors.text2}>
              {folder.description}
            </TextComponent>
            
            <View style={styles.packageDetails}>
              <View style={styles.packageInfo}>
                {folder.author && (
                  <>
                    <View style={styles.metricItem}>
                      <User size={14} color={colors.blueSingle} />
                      <TextComponent variante="body4" color={colors.text2}>
                        {folder.author}
                      </TextComponent>
                    </View>
                    <View style={styles.infoSeparator} />
                  </>
                )}
                <View style={styles.metricItem}>
                  <Music size={14} color={colors.blueSingle} />
                  <TextComponent variante="body4" color={colors.text2}>
                    {folder.courseCount} cours
                  </TextComponent>
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  // Rendu des cours dans un dossier
  const renderCourses = () => {
    if (!currentFolder || !currentFolder.content) return null;

    return (
      <ScrollView 
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {currentFolder.content.map((content: Content) => (
          <TouchableOpacity
            key={content.id}
            style={styles.listItem}
            onPress={() => handleContentPress(content)}
          >
            <View style={[styles.listThumbnail, { backgroundColor: `${colors.primary}15` }]}>
              <Play size={24} color={colors.primary2} />
            </View>
            <View style={styles.listContent}>
              <TextComponent variante="subtitle3" style={styles.listTitle}>
                {content.title}
              </TextComponent>
              <TextComponent variante="body4" color={colors.text2}>
                {content.description}
              </TextComponent>
              
              <View style={styles.contentStatus}>
                <View style={styles.packageInfo}>
                  {content.author && (
                    <View style={styles.metricItem}>
                      <User size={12} color={colors.text2} />
                      <TextComponent variante="caption" color={colors.text2}>
                        {content.author}
                      </TextComponent>
                    </View>
                  )}

                  {/* {content.duration && (
                    <>
                      {content.author && <View style={styles.infoSeparator} />}
                      <View style={styles.metricItem}>
                        <TextComponent variante="caption" color={colors.text2}>
                          {content.duration}
                        </TextComponent>
                      </View>
                    </>
                  )} */}
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

  // Logique de rendu principal
  const renderContent = () => {
    if (!currentFolder) {
      // Vue des dossiers
      if (category.folders.length === 0) {
        return <EmptyFoldersCard />;
      }
      return renderFolders();
    } else {
      // Vue des cours dans un dossier
      if (!currentFolder.content || currentFolder.content.length === 0) {
        return <EmptyCoursesCard />;
      }
      return renderCourses();
    }
  };

  return (
    <View style={styles.container}>
      {renderStats()}
      {renderContent()}
    </View>
  );
};