import { Folder, Music, Play, User } from 'lucide-react-native';
import React from 'react';
import { FlatList, View } from 'react-native';

import { EmptyState } from '@/components/uxComponents/EmptyState';
import { Badge, ListItemCard } from '@/components/uxComponents/ListItemCard';
import { Content as ContentWidth } from '@/components/uxComponents/Screen';
import { TextComponent } from '@/components/uxComponents/TextComponent';
import { useListLayout } from '@/hooks/useListLayout';
import { useResponsive } from '@/hooks/useResponsive';
import { useThemeColors } from '@/hooks/useThemeColors';
import { Category, Content, Folder as FolderType } from '@/stores/appStore';

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
  onBack,
}) => {
  const colors = useThemeColors();
  const { spacing, radius, icon } = useResponsive();
  const listLayout = useListLayout();

  // Bandeau de statistiques, affiché seulement au niveau des dossiers.
  const renderStats = () => {
    if (currentFolder) return null;

    return (
      <ContentWidth style={{ paddingTop: spacing.sm }}>
        <View
          style={{
            backgroundColor: colors.card,
            borderRadius: radius.lg,
            borderWidth: 1,
            borderColor: colors.border,
            paddingVertical: spacing.md,
            alignItems: 'center',
            gap: spacing.xxs,
          }}
        >
          <TextComponent variante="subtitle1" color={colors.text}>
            {category.folderCount}
          </TextComponent>
          <TextComponent variante="body4" color={colors.text2}>
            Leçons
          </TextComponent>
        </View>
      </ContentWidth>
    );
  };

  if (!currentFolder) {
    if (category.folders.length === 0) {
      return (
        <EmptyState
          variant="plain"
          icon={Folder}
          title="Aucune leçon disponible"
          subtitle="La catégorie « Leçons » ne contient pas encore de leçons. Revenez plus tard pour découvrir de nouvelles leçons."
          actionText="Retour aux catégories"
          onActionPress={onBack}
        />
      );
    }

    return (
      <View style={{ flex: 1 }}>
        {renderStats()}
        <FlatList
          data={category.folders}
          keyExtractor={(item) => item.id}
          contentContainerStyle={listLayout.contentContainerStyle}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <ListItemCard
              title={item.name}
              description={item.description}
              leading={<Folder size={icon.md} color={colors.primary2} />}
              onPress={() => onFolderPress(item)}
              meta={
                <>
                  {!!item.author && (
                    <Badge label={item.author} icon={<User size={12} color={colors.blueSingle} />} />
                  )}
                  <Badge
                    label={`${item.courseCount} cours`}
                    icon={<Music size={12} color={colors.blueSingle} />}
                  />
                </>
              }
            />
          )}
        />
      </View>
    );
  }

  if (!currentFolder.content || currentFolder.content.length === 0) {
    return (
      <EmptyState
        variant="plain"
        icon={Play}
        title="Aucun cours disponible"
        subtitle="Cette leçon ne contient pas encore de cours. L'auteur ajoutera prochainement du contenu."
        actionText="Retour aux leçons"
        onActionPress={() => onFolderPress(null as any)}
      />
    );
  }

  return (
    <FlatList
      data={currentFolder.content}
      keyExtractor={(item) => item.id}
      contentContainerStyle={listLayout.contentContainerStyle}
      showsVerticalScrollIndicator={false}
      renderItem={({ item }) => (
        <ListItemCard
          title={item.title}
          description={item.description}
          leading={<Play size={icon.md} color={colors.primary2} />}
          onPress={() => onContentPress(item)}
          meta={
            !!item.author && <Badge label={item.author} icon={<User size={12} color={colors.text2} />} />
          }
        />
      )}
    />
  );
};
