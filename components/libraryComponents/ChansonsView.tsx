import { Music, Play, User } from 'lucide-react-native';
import React from 'react';
import { FlatList } from 'react-native';

import { EmptyState } from '@/components/uxComponents/EmptyState';
import { Badge, ListItemCard } from '@/components/uxComponents/ListItemCard';
import { useListLayout } from '@/hooks/useListLayout';
import { useResponsive } from '@/hooks/useResponsive';
import { useThemeColors } from '@/hooks/useThemeColors';
import { Content } from '@/stores/appStore';

interface ChansonsViewProps {
  content: Content[];
  onContentPress: (content: Content) => void;
  onBack: () => void;
}

export const ChansonsView: React.FC<ChansonsViewProps> = ({ content, onContentPress, onBack }) => {
  const colors = useThemeColors();
  const { icon } = useResponsive();
  const listLayout = useListLayout();

  if (content.length === 0) {
    return (
      <EmptyState
        variant="plain"
        icon={Music}
        title="Aucune chanson disponible"
        subtitle="La collection de chansons ne contient pas encore de contenu. Explorez d'autres catégories ou revenez plus tard."
        actionText="Retour aux catégories"
        onActionPress={onBack}
      />
    );
  }

  return (
    <FlatList
      data={content}
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
            <>
              {!!item.author && (
                <Badge label={item.author} icon={<User size={12} color={colors.text2} />} />
              )}
              {!!item.composer && (
                <Badge label={item.composer} icon={<Music size={12} color={colors.text2} />} />
              )}
            </>
          }
        />
      )}
    />
  );
};
