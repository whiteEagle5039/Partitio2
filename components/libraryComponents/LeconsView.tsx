import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Folder, Music, User, Play } from 'lucide-react-native';
import { TextComponent } from '@/components/uxComponents/TextComponent';
import { useThemeColors } from '@/hooks/useThemeColors';
import { Course, Folder as FolderType, Category } from '@/stores/appStore';

interface LeconsViewProps {
  category: Category;
  currentFolder: FolderType | null;
  onFolderPress: (folder: FolderType) => void;
  onCoursePress: (course: Course) => void;
}

export const LeconsView: React.FC<LeconsViewProps> = ({ 
  category, 
  currentFolder, 
  onFolderPress, 
  onCoursePress 
}) => {
  const colors = useThemeColors();

  const styles = StyleSheet.create({
    container: {
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
  });

  // Rendu des dossiers
  const renderFolders = () => {
    return (
      <View style={styles.container}>
        {category.folders.map((folder: FolderType) => (
          <TouchableOpacity
            key={folder.id}
            style={styles.listItem}
            onPress={() => onFolderPress(folder)}
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
      </View>
    );
  };

  // Rendu des cours dans un dossier
  const renderCourses = () => {
    if (!currentFolder || !currentFolder.content) return null;

    return (
      <View style={styles.container}>
        {currentFolder.content.map((course: Course) => (
          <TouchableOpacity
            key={course.id}
            style={styles.listItem}
            onPress={() => onCoursePress(course)}
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
              
              <View style={styles.contentStatus}>
                <View style={styles.packageInfo}>
                  {course.author && (
                    <View style={styles.metricItem}>
                      <User size={12} color={colors.text2} />
                      <TextComponent variante="caption" color={colors.text2}>
                        {course.author}
                      </TextComponent>
                    </View>
                  )}
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  // Retourner les dossiers si aucun dossier n'est sélectionné, sinon les cours
  return currentFolder ? renderCourses() : renderFolders();
};