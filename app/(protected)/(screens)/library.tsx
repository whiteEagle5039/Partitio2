import { TextComponent } from '@/components/uxComponents/TextComponent';
import { WrapperComponent } from '@/components/WrapperComponent';
import { useThemeColors } from '@/hooks/useThemeColors';
import { Category, Content, Folder as FolderType, useAppStore } from '@/stores/appStore';
import { useRouter } from 'expo-router';
import { ArrowLeft, Folder, Library } from 'lucide-react-native';
import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Imports des composants spécialisés
import { CantiquesView } from '@/components/libraryComponents/CantiquesView';
import { ChansonsView } from '@/components/libraryComponents/ChansonsView';
import { CompositionsView } from '@/components/libraryComponents/CompositionsView';
import { LeconsView } from '@/components/libraryComponents/LeconsView';

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
      paddingVertical: 8,
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
      paddingHorizontal: 15,
    },
    listItem: {
      flexDirection: 'row',
      backgroundColor: colors.card,
      borderRadius: 12,
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

  // Fonction pour obtenir l'icône selon le type
  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: any } = {
      Library: Library,
      Music: require('lucide-react-native').Music,
      Edit3: require('lucide-react-native').Edit3,
      Users: require('lucide-react-native').Users,
      BookOpen: require('lucide-react-native').BookOpen,
      Folder: Folder,
    };
    return iconMap[iconName] || Folder;
  };

  // Gestionnaires d'événements simplifiés
  const handleContentPress = (contentOrId: Content | string) => {
    // Si c'est une composition (string ID)
    if (typeof contentOrId === 'string') {
      console.log(`Naviguer vers la composition: ${contentOrId}`);
      router.push(`/compositionPreview?id=${contentOrId}`);
      return;
    }
    
    // Sinon, c'est un objet Content classique
    console.log(`Naviguer vers le contenu: ${contentOrId.title}`);
    // router.push(`/content/${contentOrId.id}`);
  };

  const handleFolderPress = (folder: FolderType) => {
    setCurrentFolder(folder);
  };

  // Fonction pour gérer le retour
  const handleBack = () => {
    if (navigationLevel === 'content' && currentFolder) {
      setCurrentFolder(null);
    } else if (navigationLevel === 'content' && currentCategory?.hasDirectcontent) {
      setCurrentCategory(null);
    } else if (navigationLevel === 'folders') {
      setCurrentCategory(null);
    } else {
      router.back();
    }
  };

  // Composant pour l'état vide des catégories
  const EmptyStateCard = ({ 
    icon: IconComponent, 
    title, 
    subtitle, 
    actionText, 
    onActionPress 
  }: any) => (
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
          style={styles.emptyStateButton}
          onPress={onActionPress}
        >
          <TextComponent variante="body3" color="#FFFFFF">
            {actionText}
          </TextComponent>
        </TouchableOpacity>
      )}
    </View>
  );

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
    const filteredCategories = categories.filter(cat => cat.id !== '1' && cat.id !== '4');

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

    // Statistiques pour les catégories
    const totalCategories = filteredCategories.length;
    const totalFolders = categories.reduce((sum, cat) => sum + cat.folderCount, 0);

    return (
      <>
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
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </>
    );
  };

  // Rendu du contenu selon la catégorie
  const renderContent = () => {
    if (!currentCategory) return null;

    const content = currentCategory.content || [];
    const commonProps = {
      onContentPress: handleContentPress,
      onBack: () => setCurrentCategory(null),
    };

    // Utiliser le bon composant selon la catégorie
    switch (currentCategory.id) {
      case '2': // Cantiques
        return <CantiquesView/>;
      case '3': // Compositions
        return (
          <CompositionsView 
            onContentPress={(id: string) => {
              console.log(`Naviguer vers la composition: ${id}`);
              router.push(`/compositionPreview?id=${id}`);
            }}
          />
        );
      case '4': // Chansons
        return <ChansonsView content={content} {...commonProps} />;
      case '5': // Leçons
        return (
          <LeconsView 
            category={currentCategory}
            currentFolder={currentFolder}
            onFolderPress={handleFolderPress}
            onContentPress={handleContentPress}
            onBack={() => setCurrentCategory(null)}
          />
        );
      default:
        return <CantiquesView />;
    }
  };

  // Titre selon le niveau de navigation
  const getTitle = () => {
    switch (navigationLevel) {
      case 'categories': return 'Ma Bibliothèque';
      case 'folders': return currentCategory?.name || 'Dossiers';
      case 'content': 
        if (currentFolder) return currentFolder.name;
        if (currentCategory?.hasDirectcontent) return currentCategory.name;
        return 'Cours';
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
            <TextComponent variante="subtitle2">
              {getTitle()}
            </TextComponent>
          </View>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Breadcrumb */}
          <Breadcrumb />

          {/* Contenu */}
          <View style={styles.content}>
            {navigationLevel === 'categories' && renderCategories()}
            {(navigationLevel === 'folders' || navigationLevel === 'content') && renderContent()}
          </View>
        </ScrollView>
      </SafeAreaView>
    </WrapperComponent>
  );
}