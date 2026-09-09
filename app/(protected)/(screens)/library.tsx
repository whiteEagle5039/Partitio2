import { useRouter } from 'expo-router';
import { BookOpen, Edit3, Folder, Library, Music, Users } from 'lucide-react-native';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { CantiquesView } from '@/components/libraryComponents/CantiquesView';
import { ChansonsView } from '@/components/libraryComponents/ChansonsView';
import { CompositionsView } from '@/components/libraryComponents/CompositionsView';
import { LeconsView } from '@/components/libraryComponents/LeconsView';
import { EmptyState } from '@/components/uxComponents/EmptyState';
import { ListItemCard } from '@/components/uxComponents/ListItemCard';
import { Content as ContentWidth, Screen } from '@/components/uxComponents/Screen';
import { ScreenHeader } from '@/components/uxComponents/ScreenHeader';
import { WrapperComponent } from '@/components/WrapperComponent';
import { useResponsive } from '@/hooks/useResponsive';
import { useThemeColors } from '@/hooks/useThemeColors';
import { Category, Content, Folder as FolderType, useAppStore } from '@/stores/appStore';

const iconMap: Record<string, any> = {
  Library,
  Music,
  Edit3,
  Users,
  BookOpen,
  Folder,
};

export default function LibraryScreen() {
  const colors = useThemeColors();
  const router = useRouter();
  const { spacing } = useResponsive();
  const {
    categories,
    currentCategory,
    currentFolder,
    navigationLevel,
    setCurrentCategory,
    setCurrentFolder,
    setCurrentContent,
  } = useAppStore();

  const getIconComponent = (iconName: string) => iconMap[iconName] || Folder;

  const handleContentPress = (contentOrId: Content | string) => {
    if (typeof contentOrId === 'string') {
      router.push(`/compositionPreview?id=${contentOrId}`);
      return;
    }

    setCurrentContent(contentOrId);
    router.push(`/contentPreview?id=${contentOrId.id}`);
  };

  const handleFolderPress = (folder: FolderType) => {
    setCurrentFolder(folder);
  };

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

  const renderCategories = () => {
    const filteredCategories = categories.filter((cat) => cat.id !== '1' && cat.id !== '4');

    if (filteredCategories.length === 0) {
      return (
        <EmptyState
          icon={Library}
          title="Aucune catégorie"
          subtitle="Commencez par explorer nos différentes catégories de contenu musical."
          actionText="Explorer"
          onActionPress={() => router.push('/search')}
        />
      );
    }

    return (
      <View style={{ gap: spacing.sm, paddingTop: spacing.sm, paddingBottom: spacing.xxl }}>
        {filteredCategories.map((category: Category) => {
          const IconComponent = getIconComponent(category.icon);

          return (
            <ListItemCard
              key={category.id}
              title={category.name}
              description={category.description}
              leadingTint={category.color}
              leading={<IconComponent size={22} color={category.color} />}
              onPress={() => setCurrentCategory(category)}
            />
          );
        })}
      </View>
    );
  };

  // Les vues de contenu gèrent leur propre défilement : les imbriquer dans un
  // ScrollView parent casserait le scroll sur les longues listes.
  const renderContent = () => {
    if (!currentCategory) return null;

    const content = currentCategory.content || [];

    switch (currentCategory.id) {
      case '2':
        return <CantiquesView />;
      case '3':
        return (
          <CompositionsView
            onContentPress={(id: string) => router.push(`/compositionPreview?id=${id}`)}
          />
        );
      case '4':
        return (
          <ChansonsView
            content={content}
            onContentPress={handleContentPress}
            onBack={() => setCurrentCategory(null)}
          />
        );
      case '5':
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

  const getTitle = () => {
    switch (navigationLevel) {
      case 'categories':
        return 'Ma Bibliothèque';
      case 'folders':
        return currentCategory?.name || 'Dossiers';
      case 'content':
        if (currentFolder) return currentFolder.name;
        if (currentCategory?.hasDirectcontent) return currentCategory.name;
        return 'Cours';
      default:
        return 'Ma Bibliothèque';
    }
  };

  const showCategories = navigationLevel === 'categories';

  return (
    <WrapperComponent>
      <Screen background={colors.card}>
        <ScreenHeader title={getTitle()} onBack={handleBack} />

        <View style={[styles.body, { backgroundColor: colors.background }]}>
          {showCategories ? (
            <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
              <ContentWidth>{renderCategories()}</ContentWidth>
            </ScrollView>
          ) : (
            renderContent()
          )}
        </View>
      </Screen>
    </WrapperComponent>
  );
}

const styles = StyleSheet.create({
  body: { flex: 1 },
  scroll: { flex: 1 },
});
