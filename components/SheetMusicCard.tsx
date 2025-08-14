import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Play, Download, Check } from 'lucide-react-native';
import { TextComponent } from './TextComponent';
import { useThemeColors } from '@/hooks/useThemeColors';

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
  onDownload 
}: SheetMusicCardProps) {
  const colors = useThemeColors();

  const styles = StyleSheet.create({
    card: {
      width: 160,
      marginRight: 16,
      backgroundColor: colors.card,
      borderRadius: 16,
      overflow: 'hidden',
      elevation: 3,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
    },
    thumbnail: {
      width: '100%',
      height: 120,
      backgroundColor: colors.muted,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
    },
    thumbnailImage: {
      width: '100%',
      height: '100%',
    },
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    playButton: {
      backgroundColor: `${colors.primary}E6`,
      borderRadius: 20,
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
    },
    downloadButton: {
      position: 'absolute',
      top: 8,
      right: 8,
      backgroundColor: isDownloaded ? colors.validated : `${colors.background}E6`,
      borderRadius: 16,
      width: 32,
      height: 32,
      justifyContent: 'center',
      alignItems: 'center',
    },
    content: {
      padding: 12,
    },
    title: {
      marginBottom: 4,
    },
    composer: {
      opacity: 0.7,
    },
  });

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.thumbnail}>
        <Image 
          source={{ uri: thumbnail }} 
          style={styles.thumbnailImage}
          resizeMode="cover"
        />
        <View style={styles.overlay}>
          <TouchableOpacity style={styles.playButton}>
            <Play size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity 
          style={styles.downloadButton}
          onPress={onDownload}
        >
          {isDownloaded ? (
            <Check size={16} color="#FFFFFF" />
          ) : (
            <Download size={16} color={colors.text} />
          )}
        </TouchableOpacity>
      </View>
      
      <View style={styles.content}>
        <TextComponent variante="subtitle3" style={styles.title} numberOfLines={1}>
          {title}
        </TextComponent>
        <TextComponent variante="caption" style={styles.composer} numberOfLines={1}>
          {composer}
        </TextComponent>
      </View>
    </TouchableOpacity>
  );
}