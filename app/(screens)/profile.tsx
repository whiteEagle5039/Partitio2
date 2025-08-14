import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  ArrowLeft, 
  Edit, 
  Music, 
  Download, 
  Share2,
  Award,
  Calendar,
  Mail,
  File as FileIcon // ✅ Renommé pour éviter le conflit avec File natif
} from 'lucide-react-native';

import { LucideIcon } from 'lucide-react-native'; // ✅ Import du type

import { TextComponent } from '@/components/TextComponent';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useAppStore } from '@/stores/appStore';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const colors = useThemeColors();
  const router = useRouter();
  const { user, sheetMusic, compositions } = useAppStore();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 16,
      backgroundColor: colors.card,
      elevation: 2,
    },
    backButton: {
      marginRight: 16,
      padding: 8,
    },
    headerTitle: {
      flex: 1,
    },
    editButton: {
      padding: 8,
    },
    content: {
      flex: 1,
    },
    profileSection: {
      backgroundColor: colors.card,
      margin: 20,
      borderRadius: 16,
      padding: 24,
      alignItems: 'center',
    },
    avatar: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 16,
    },
    name: {
      marginBottom: 8,
    },
    email: {
      marginBottom: 16,
    },
    joinDate: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    statsContainer: {
      flexDirection: 'row',
      margin: 20,
      gap: 12,
    },
    statCard: {
      flex: 1,
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      alignItems: 'center',
    },
    statIcon: {
      marginBottom: 8,
    },
    statNumber: {
      marginBottom: 4,
    },
    achievementsSection: {
      backgroundColor: colors.card,
      margin: 20,
      borderRadius: 16,
      padding: 20,
    },
    sectionTitle: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    sectionIcon: {
      marginRight: 12,
    },
    achievement: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    achievementIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.primary + '20',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
    },
    achievementInfo: {
      flex: 1,
    },
    achievementTitle: {
      marginBottom: 4,
    },
    actionsSection: {
      margin: 20,
      gap: 12,
    },
    actionButton: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
    },
    actionIcon: {
      marginRight: 16,
    },
    actionContent: {
      flex: 1,
    },
    actionTitle: {
      marginBottom: 4,
    },
  });

  type Stat = {
    icon: LucideIcon;
    label: string;
    value: number;
    color: string;
  };

    type Achievement = {
        icon: LucideIcon;
        title: string;
        description: string;
        unlocked: boolean;
    };

    type ActionItem = {
        icon: LucideIcon;
        title: string;
        description: string;
    onPress: () => void;
    };

    const stats: Stat[] = [
    { icon: Music, label: 'Partitions', value: sheetMusic.length, color: colors.primary },
    { icon: Download, label: 'Téléchargées', value: sheetMusic.filter((s: any) => s.isDownloaded).length, color: colors.primary2 },
    { icon: Edit, label: 'Compositions', value: compositions.length, color: colors.primary3 },
    ];

    const achievements: Achievement[] = [
    { icon: Music, title: 'Premier téléchargement', description: 'Vous avez téléchargé votre première partition', unlocked: true },
    { icon: Edit, title: 'Compositeur en herbe', description: 'Vous avez créé votre première composition', unlocked: compositions.length > 0 },
    { icon: Share2, title: 'Partageur', description: 'Vous avez partagé une composition', unlocked: false },
    ];

    const actions: ActionItem[] = [
    { icon: Share2, title: 'Partager mon profil', description: 'Inviter des amis à découvrir vos compositions', onPress: () => console.log('Partager profil') },
    { icon: FileIcon, title: 'Exporter mes données', description: 'Télécharger toutes vos compositions', onPress: () => console.log('Exporter données') },
    ];


  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={colors.icon} />
          </TouchableOpacity>
          
          <View style={styles.headerTitle}>
            <TextComponent variante="subtitle1">
              Profil
            </TextComponent>
          </View>
          
          <TouchableOpacity style={styles.editButton}>
            <Edit size={24} color={colors.icon} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Section profil */}
          <View style={styles.profileSection}>
            <View style={styles.avatar}>
              {user?.avatar ? (
                <Image source={{ uri: user.avatar }} style={styles.avatar} />
              ) : (
                <TextComponent variante="subtitle1" color={colors.primaryForeground}>
                  {user?.name?.charAt(0) || 'U'}
                </TextComponent>
              )}
            </View>
            
            <TextComponent variante="subtitle1" style={styles.name}>
              {user?.name || 'Utilisateur'}
            </TextComponent>
            
            <View style={styles.email}>
              <Mail size={16} color={colors.text2} />
              <TextComponent variante="body4" color={colors.text2} style={{ marginLeft: 8 }}>
                {user?.email || 'user@partitio.com'}
              </TextComponent>
            </View>
            
            <View style={styles.joinDate}>
              <Calendar size={16} color={colors.text2} />
              <TextComponent variante="caption" color={colors.text2} style={{ marginLeft: 8 }}>
                Membre depuis janvier 2025
              </TextComponent>
            </View>
          </View>

          {/* Statistiques */}
          <View style={styles.statsContainer}>
            {stats.map((stat, index) => (
              <View key={index} style={styles.statCard}>
                <stat.icon size={24} color={stat.color} style={styles.statIcon} />
                <TextComponent variante="subtitle2" style={styles.statNumber}>
                  {stat.value}
                </TextComponent>
                <TextComponent variante="caption" color={colors.text2}>
                  {stat.label}
                </TextComponent>
              </View>
            ))}
          </View>

          {/* Succès */}
          <View style={styles.achievementsSection}>
            <View style={styles.sectionTitle}>
              <Award size={24} color={colors.primary} style={styles.sectionIcon} />
              <TextComponent variante="subtitle2">
                Succès
              </TextComponent>
            </View>
            
            {achievements.map((achievement, index) => (
              <View key={index} style={styles.achievement}>
                <View style={[
                  styles.achievementIcon,
                  { backgroundColor: achievement.unlocked ? colors.primary + '20' : colors.muted }
                ]}>
                  <achievement.icon 
                    size={20} 
                    color={achievement.unlocked ? colors.primary : colors.text2} 
                  />
                </View>
                <View style={styles.achievementInfo}>
                  <TextComponent 
                    variante="subtitle3" 
                    style={styles.achievementTitle}
                    color={achievement.unlocked ? colors.text : colors.text2}
                  >
                    {achievement.title}
                  </TextComponent>
                  <TextComponent variante="caption" color={colors.text2}>
                    {achievement.description}
                  </TextComponent>
                </View>
              </View>
            ))}
          </View>

          {/* Actions */}
          <View style={styles.actionsSection}>
            {actions.map((action, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.actionButton}
                onPress={action.onPress}
              >
                <action.icon size={24} color={colors.icon} style={styles.actionIcon} />
                <View style={styles.actionContent}>
                  <TextComponent variante="subtitle3" style={styles.actionTitle}>
                    {action.title}
                  </TextComponent>
                  <TextComponent variante="caption" color={colors.text2}>
                    {action.description}
                  </TextComponent>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}