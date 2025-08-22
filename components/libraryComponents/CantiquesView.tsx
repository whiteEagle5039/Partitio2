import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Music, User, Play } from 'lucide-react-native';
import { TextComponent } from '@/components/uxComponents/TextComponent';
import { useThemeColors } from '@/hooks/useThemeColors';
import { Course } from '@/stores/appStore';

interface CantiquesViewProps {
  content: Course[];
  onCoursePress: (course: Course) => void;
}

export const CantiquesView: React.FC<CantiquesViewProps> = ({ content, onCoursePress }) => {
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
    contentStatus: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginTop: 8,
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
  });

  return (
    <View style={styles.container}>
      {content.map((course: Course) => (
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
                {course.composer && (
                  <>
                    <View style={styles.metricItem}>
                      <User size={12} color={colors.text2} />
                      <TextComponent variante="caption" color={colors.text2}>
                        {course.composer}
                      </TextComponent>
                    </View>
                    <View style={styles.infoSeparator} />
                  </>
                )}
                
                {course.fileSize && (
                  <View style={styles.metricItem}>
                    <TextComponent variante="caption" color={colors.text2}>
                      {course.fileSize} MB
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