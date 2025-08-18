import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  ArrowLeft, 
  Folder, 
  Music, 
  Library, 
  BookOpen, 
  Edit3, 
  Users, 
  Play,
  FileText
} from 'lucide-react-native';
import { TextComponent } from '@/components/TextComponent';
import { WrapperComponent } from '@/components/WrapperComponent';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useAppStore } from '@/stores/appStore';
import { useRouter } from 'expo-router';
import { Category, Folder as FolderType, Course } from '@/stores/appStore';

export default function LibraryScreen() {
  const colors = useThemeColors();
  const router = useRouter();
  const { 
    categories, 
    currentCategory, 
    currentFolder, 
    navigationLevel,
    setCurrentCategory,
    setCurrentFolder,
  } = useAppStore();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.card,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 10,
      paddingVertical: 15,
      backgroundColor: colors.card,
    },
    backButton: {
      padding: 8,
      marginRight: 8,
    },
    headerTitle: {
      flex: 1,
    },
    scrollView: {
      flex: 1,
      backgroundColor: colors.background
    },
    breadcrumb: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 12,
      backgroundColor: colors.background,
    },
    breadcrumbText: {
      marginHorizontal: 4,
    },
    breadcrumbSeparator: {
      marginHorizontal: 8,
    },
    content: {
      flex: 1,
      paddingTop: 10,
    },
    listContainer: {
      paddingHorizontal: 20,
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
    listMetrics: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 8,
      gap: 12,
    },
    metricItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    courseStatus: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginTop: 8,
    },
    statusBadge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    difficultyBadge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
    },
    courseActions: {
      flexDirection: 'column',
      alignItems: 'center',
      gap: 8,
    },
    actionButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
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
      padding: 16,
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
    },
  });

  // Fonction pour obtenir l'icône selon le type
  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: any } = {
      Library: Library,
      Music: Music,
      Edit3: Edit3,
      Users: Users,
      BookOpen: BookOpen,
      Folder: Folder,
    };
    return iconMap[iconName] || Folder;
  };

  // Composant pour l'état vide
  const EmptyStateCard = ({ 
    icon: IconComponent, 
    title, 
    subtitle, 
    actionText, 
    onActionPress 
  }: any) => {
    return (
      <View style={styles.emptyStateCard}>
        <View style={[styles.emptyStateIcon, { backgroundColor: `${colors.primary}15` }]}>
          <IconComponent size={40} color={colors.primary2} />
        </View>
        <TextComponent variante="subtitle2" style={styles.emptyStateTitle}>
          {title}
        </TextComponent>
        <TextComponent variante="body3" color={colors.text2} style={styles.emptyStateSubtitle}>
          {subtitle}
        </TextComponent>
        {actionText && onActionPress && (
          <TouchableOpacity 
            style={[styles.emptyStateButton, { backgroundColor: colors.primary }]}
            onPress={onActionPress}
          >
            <TextComponent variante="body3" color="#FFFFFF">
              {actionText}
            </TextComponent>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  // Composant Breadcrumb
  const Breadcrumb = () => {
    if (navigationLevel === 'categories') return null;

    return (
      <View style={styles.breadcrumb}>
        <TouchableOpacity onPress={() => setCurrentCategory(null)}>
          <TextComponent variante="body2" color={colors.primary}>
            Bibliothèque
          </TextComponent>
        </TouchableOpacity>
        
        {currentCategory && (
          <>
            <TextComponent variante="body4" color={colors.text2} style={styles.breadcrumbSeparator}>
              /
            </TextComponent>
            <TouchableOpacity onPress={() => setCurrentFolder(null)}>
              <TextComponent 
                variante="body2" 
                color={navigationLevel === 'folders' ? colors.text : colors.primary}
              >
                {currentCategory.name}
              </TextComponent>
            </TouchableOpacity>
          </>
        )}
        
        {currentFolder && (
          <>
            <TextComponent variante="body4" color={colors.text2} style={styles.breadcrumbSeparator}>
              /
            </TextComponent>
            <TextComponent variante="body4" color={colors.text}>
              {currentFolder.name}
            </TextComponent>
          </>
        )}
      </View>
    );
  };

  // Rendu des catégories
  const renderCategories = () => {
    const filteredCategories = categories.filter(cat => cat.id !== '1'); // Exclure "Tous"

    if (filteredCategories.length === 0) {
      return (
        <EmptyStateCard
          icon={Library}
          title="Aucune catégorie"
          subtitle="Commencez par explorer nos différentes catégories de contenu musical."
          actionText="Explorer"
          onActionPress={() => router.push('/search')}
        />
      );
    }

    return (
      <View style={styles.listContainer}>
        {filteredCategories.map((category: Category) => {
          const IconComponent = getIconComponent(category.icon);
          
          return (
            <TouchableOpacity
              key={category.id}
              style={styles.listItem}
              onPress={() => setCurrentCategory(category)}
            >
              <View style={[styles.listThumbnail, { backgroundColor: `${category.color}15` }]}>
                <IconComponent size={24} color={category.color} />
              </View>
              <View style={styles.listContent}>
                <TextComponent variante="subtitle2" style={styles.listTitle}>
                  {category.name}
                </TextComponent>
                <TextComponent variante="body4" color={colors.text2}>
                  {category.description}
                </TextComponent>
                <View style={styles.listMetrics}>
                  <View style={styles.metricItem}>
                    <Folder size={16} color={colors.blueSingle} />
                    <TextComponent variante="body4" color={colors.text2}>
                      {category.folderCount} dossiers
                    </TextComponent>
                  </View>
                  <View style={styles.metricItem}>
                    <Music size={16} color={colors.blueSingle} />
                    <TextComponent variante="body3" color={colors.text2}>
                      {category.totalCourses} cours
                    </TextComponent>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  // Rendu des dossiers
  const renderFolders = () => {
    if (!currentCategory || currentCategory.folders.length === 0) {
      return (
        <EmptyStateCard
          icon={Folder}
          title="Aucun dossier"
          subtitle={`La catégorie "${currentCategory?.name}" ne contient pas encore de dossiers.`}
          actionText="Explorer d'autres catégories"
          onActionPress={() => setCurrentCategory(null)}
        />
      );
    }

    return (
      <View style={styles.listContainer}>
        {currentCategory.folders.map((folder: FolderType) => (
          <TouchableOpacity
            key={folder.id}
            style={styles.listItem}
            onPress={() => setCurrentFolder(folder)}
          >
            <View style={[styles.listThumbnail, { backgroundColor: `${colors.primary}15` }]}>
              <Folder size={24} color={colors.primary2} />
            </View>
            <View style={styles.listContent}>
              <TextComponent variante="subtitle2"  style={styles.listTitle}>
                {folder.name}
              </TextComponent>
              <TextComponent variante="body4" color={colors.text2}>
                {folder.description}
              </TextComponent>
              <View style={styles.listMetrics}>
                <View style={styles.metricItem}>
                  <Music size={16} color={colors.blueSingle} />
                  <TextComponent variante="body4" color={colors.text2}>
                    {folder.courseCount} cours
                  </TextComponent>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  // Rendu des cours
  const renderCourses = () => {
    if (!currentFolder || currentFolder.courses.length === 0) {
      return (
        <EmptyStateCard
          icon={Music}
          title="Aucun cours"
          subtitle={`Le dossier "${currentFolder?.name}" ne contient pas encore de cours.`}
          actionText="Retour aux dossiers"
          onActionPress={() => setCurrentFolder(null)}
        />
      );
    }

    return (
      <View style={styles.listContainer}>
        {currentFolder.courses.map((course: Course) => (
          <TouchableOpacity
            key={course.id}
            style={styles.listItem}
            onPress={() => console.log(`Ouvrir le cours: ${course.title}`)}
          >
            <View style={[styles.listThumbnail, { backgroundColor: `${colors.primary}15` }]}>
              <Play size={24} color={colors.primary2} />
            </View>
            <View style={styles.listContent}>
              <TextComponent variante="subtitle3" style={styles.listTitle}>
                {course.title}
              </TextComponent>
              <TextComponent variante="body4" color={colors.text2}>
                {course.description}
              </TextComponent>
              
              <View style={styles.courseStatus}>
                {course.fileSize && (
                  <View style={styles.metricItem}>
                    <FileText size={12} color={colors.text2} />
                    <TextComponent variante="caption" color={colors.text2}>
                      {course.fileSize} MB
                    </TextComponent>
                  </View>
                )}
              </View>

            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  // Statistiques selon le niveau de navigation
  const renderStats = () => {
    if (navigationLevel === 'categories') {
      const totalCategories = categories.filter(cat => cat.id !== '1').length;
      const totalFolders = categories.reduce((sum, cat) => sum + cat.folderCount, 0);
      // const totalCourses = categories.reduce((sum, cat) => sum + cat.totalCourses, 0);

      return (
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: `${colors.primary}15` }]}>
              <Library size={24} color={colors.primary} />
            </View>
            <TextComponent variante="subtitle1">{totalCategories}</TextComponent>
            <TextComponent variante="body2" color={colors.text2}>Catégories</TextComponent>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: `${colors.primary}15` }]}>
              <Folder size={24} color={colors.primary} />
            </View>
            <TextComponent variante="subtitle1">{totalFolders}</TextComponent>
            <TextComponent variante="body2" color={colors.text2}>Dossiers</TextComponent>
          </View>
        </View>
      );
    } else if (navigationLevel === 'folders' && currentCategory) {
      return (
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: `${currentCategory.color}15` }]}>
              <Folder size={20} color={currentCategory.color} />
            </View>
            <TextComponent variante="subtitle1">{currentCategory.folderCount}</TextComponent>
            <TextComponent variante="body4" color={colors.text2}>Dossiers</TextComponent>
          </View>
         
        </View>
      );
    } else if (navigationLevel === 'courses' && currentFolder) {

      return (
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: `${colors.primary}15` }]}>
              <Music size={20} color={colors.primary} />
            </View>
            <TextComponent variante="subtitle1">{currentFolder.courseCount}</TextComponent>
            <TextComponent variante="caption" color={colors.text2}>Total</TextComponent>
          </View>
        </View>
      );
    }
    return null;
  };

  // Fonction pour gérer le retour
  const handleBack = () => {
    if (navigationLevel === 'courses') {
      setCurrentFolder(null);
    } else if (navigationLevel === 'folders') {
      setCurrentCategory(null);
    } else {
      router.back();
    }
  };

  // Titre selon le niveau de navigation
  const getTitle = () => {
    switch (navigationLevel) {
      case 'categories': return 'Ma Bibliothèque';
      case 'folders': return currentCategory?.name || 'Dossiers';
      case 'courses': return currentFolder?.name || 'Cours';
      default: return 'Ma Bibliothèque';
    }
  };

  return (
    <WrapperComponent>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={handleBack}
          >
            <ArrowLeft size={24} color={colors.icon} />
          </TouchableOpacity>
          
          <View style={styles.headerTitle}>
            <TextComponent variante="subtitle1">
              {getTitle()}
            </TextComponent>
          </View>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Breadcrumb */}
          <Breadcrumb />

          {/* Statistiques */}
          {renderStats()}

          {/* Contenu */}
          <View style={styles.content}>
            {navigationLevel === 'categories' && renderCategories()}
            {navigationLevel === 'folders' && renderFolders()}
            {navigationLevel === 'courses' && renderCourses()}
          </View>
        </ScrollView>
      </SafeAreaView>
    </WrapperComponent>
  );
}