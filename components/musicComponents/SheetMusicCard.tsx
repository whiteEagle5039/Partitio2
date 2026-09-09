import { Check, Download, Play } from 'lucide-react-native';
import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View, useWindowDimensions } from 'react-native';

import { elevation, touchSlop } from '@/constants/layout';
import { useResponsive } from '@/hooks/useResponsive';
import { useThemeColors } from '@/hooks/useThemeColors';
import { TextComponent } from '../uxComponents/TextComponent';

type SheetMusicCardProps = {
  title: string;
  composer: string;
  thumbnail: string;
  isDownloaded?: boolean;
  onPress?: () => void;
  onDownload?: () => void;
};

export function SheetMusicCard({
  title,
  composer,
  thumbnail,
  isDownloaded = false,
  onPress,
  onDownload,
}: SheetMusicCardProps) {
  const colors = useThemeColors();
  const { spacing, radius, icon, scale } = useResponsive();
  const { width: windowWidth } = useWindowDimensions();

  // La carte suit la largeur d'écran : ~45 % sur téléphone, plafonnée pour ne
  // pas devenir démesurée sur tablette.
  const cardWidth = Math.round(Math.min(Math.max(windowWidth * 0.45, 150), 210));
  const thumbHeight = Math.round(cardWidth * 0.72);
  const actionSize = scale(32);

  const styles = StyleSheet.create({
    card: {
      width: cardWidth,
      backgroundColor: colors.card,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: 'hidden',
      ...elevation(1),
    },
    thumbnail: {
      width: '100%',
      height: thumbHeight,
      backgroundColor: colors.muted,
      justifyContent: 'center',
      alignItems: 'center',
    },
    thumbnailImage: {
      width: '100%',
      height: '100%',
    },
    overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0, 0, 0, 0.25)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    playButton: {
      backgroundColor: `${colors.primary}E6`,
      borderRadius: radius.pill,
      width: scale(40),
      height: scale(40),
      justifyContent: 'center',
      alignItems: 'center',
    },
    downloadButton: {
      position: 'absolute',
      top: spacing.xs,
      right: spacing.xs,
      backgroundColor: isDownloaded ? colors.validated : `${colors.background}E6`,
      borderRadius: radius.pill,
      width: actionSize,
      height: actionSize,
      justifyContent: 'center',
      alignItems: 'center',
    },
    content: {
      padding: spacing.sm,
      gap: spacing.xxs / 2,
    },
  });

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85} accessibilityRole="button">
      <View style={styles.thumbnail}>
        <Image source={{ uri: thumbnail }} style={styles.thumbnailImage} resizeMode="cover" />

        <View style={styles.overlay}>
          <View style={styles.playButton}>
            <Play size={icon.sm} color="#FFFFFF" />
          </View>
        </View>

        <TouchableOpacity
          style={styles.downloadButton}
          onPress={onDownload}
          hitSlop={touchSlop}
          accessibilityRole="button"
          accessibilityLabel={isDownloaded ? 'Partition téléchargée' : 'Télécharger la partition'}
        >
          {isDownloaded ? (
            <Check size={icon.xs} color="#FFFFFF" />
          ) : (
            <Download size={icon.xs} color={colors.text} />
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <TextComponent variante="subtitle3" color={colors.text} numberOfLines={1}>
          {title}
        </TextComponent>
        <TextComponent variante="caption" color={colors.text2} numberOfLines={1}>
          {composer}
        </TextComponent>
      </View>
    </TouchableOpacity>
  );
}
