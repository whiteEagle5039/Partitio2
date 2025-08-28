import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Music, User, Play, FileText, File, BookOpen } from 'lucide-react-native';
import { TextComponent } from '@/components/uxComponents/TextComponent';
import { useThemeColors } from '@/hooks/useThemeColors';
import { Course } from '@/stores/appStore';

interface CantiquesViewProps {
  content: Course[];
  onCoursePress: (course: Course) => void;
  onBack: () => void;
}

export const CantiquesView: React.FC<CantiquesViewProps> = ({ 
  content, 
  onCoursePress, 
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

  // Gestionnaire pour l'ouverture d'un cours
  const handleCoursePress = (course: Course) => {
    console.log(`Ouvrir le cantique: ${course.title}`);
    onCoursePress(course);
  };

  // Composant pour l'état vide
  const EmptyStateCard = () => (
    <View style={styles.emptyStateCard}>
      <View style={[styles.emptyStateIcon, { backgroundColor: `${colors.primary}15` }]}>
        <Music size={40} color={colors.primary2} />
      </View>
      <TextComponent variante="subtitle2" style={styles.emptyStateTitle}>
        Aucun cantique disponible
      </TextComponent>
      <TextComponent variante="body3" color={colors.text2} style={styles.emptyStateSubtitle}>
        La collection de cantiques ne contient pas encore de contenu. Revenez plus tard pour découvrir de nouveaux cantiques.
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

  // Rendu de la liste des cantiques
  const renderCantiques = () => (
    <ScrollView 
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContainer}
    >
      {content.map((course: Course) => (
        <TouchableOpacity
          key={course.id}
          style={styles.listItem}
          onPress={() => handleCoursePress(course)}
        >
          <View style={[styles.listThumbnail, { backgroundColor: `${colors.primary}15` }]}>
            {/* <BookOpen size={24} color={colors.primary2} /> */}
            <TextComponent variante='body1' color={colors.primary2}>{course.id} </TextComponent>
          </View>
            <TextComponent variante="subtitle3" style={styles.listTitle}>
              {course.title}
            </TextComponent>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      {content.length === 0 ? <EmptyStateCard /> : renderCantiques()}
    </View>
  );
};