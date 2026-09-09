import { useRouter } from 'expo-router';
import {
  Award,
  Calendar,
  Download,
  Edit,
  File as FileIcon,
  LucideIcon,
  Mail,
  Music,
  Share2,
  X,
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Share,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { ButtonComponent } from '@/components/uxComponents/ButtonComponent';
import { CardComponent } from '@/components/uxComponents/CardComponent';
import { ListItemCard } from '@/components/uxComponents/ListItemCard';
import { Content, Screen } from '@/components/uxComponents/Screen';
import { ScreenHeader } from '@/components/uxComponents/ScreenHeader';
import { TextComponent } from '@/components/uxComponents/TextComponent';
import { MAX_FONT_SCALE, MIN_TOUCH_TARGET, elevation, touchSlop } from '@/constants/layout';
import { useResponsive } from '@/hooks/useResponsive';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useAppStore } from '@/stores/appStore';
import { useCompositionStorage } from '@/utils/CompositionStorage';

type Stat = { icon: LucideIcon; label: string; value: number; color: string };
type Achievement = { icon: LucideIcon; title: string; description: string; unlocked: boolean };
type ActionItem = { icon: LucideIcon; title: string; description: string; onPress: () => void };

export default function ProfileScreen() {
  const colors = useThemeColors();
  const router = useRouter();
  const { spacing, radius, icon, scale, isSmall, fontSize } = useResponsive();
  const { user, sheetMusic, compositions, setUser } = useAppStore();
  const { getAllCompositions, exportComposition } = useCompositionStorage();

  const avatarSize = scale(84);

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editedName, setEditedName] = useState(user?.name || '');

  const handleSaveProfile = () => {
    const name = editedName.trim();
    if (!name) return;

    setUser(user ? { ...user, name } : null);
    setIsEditModalVisible(false);
  };

  const handleShareProfile = async () => {
    try {
      await Share.share({
        message: `Découvrez mon profil Harmonia : ${user?.name || 'Utilisateur'} — ${compositions.length} composition${compositions.length > 1 ? 's' : ''} créée${compositions.length > 1 ? 's' : ''}.`,
      });
    } catch (error) {
      console.error('❌ Erreur lors du partage:', error);
    }
  };

  const handleExportData = async () => {
    try {
      const allCompositions = await getAllCompositions();

      if (allCompositions.length === 0) {
        Alert.alert('Aucune donnée', "Vous n'avez pas encore de composition à exporter.");
        return;
      }

      const exported = await Promise.all(
        allCompositions.map((meta) => exportComposition(meta.id)),
      );

      const json = JSON.stringify(
        exported.filter(Boolean).map((entry) => JSON.parse(entry as string)),
        null,
        2,
      );

      await Share.share({ title: 'harmonia-export.json', message: json });
    } catch (error) {
      console.error('❌ Erreur lors de l\'export:', error);
      Alert.alert('Erreur', "Impossible d'exporter vos données");
    }
  };

  const stats: Stat[] = [
    { icon: Music, label: 'Partitions', value: sheetMusic.length, color: colors.primary },
    {
      icon: Download,
      label: 'Téléchargées',
      value: sheetMusic.filter((s: any) => s.isDownloaded).length,
      color: colors.primary,
    },
    { icon: Edit, label: 'Compositions', value: compositions.length, color: colors.primary },
  ];

  const achievements: Achievement[] = [
    {
      icon: Music,
      title: 'Premier téléchargement',
      description: 'Vous avez téléchargé votre première partition',
      unlocked: true,
    },
    {
      icon: Edit,
      title: 'Compositeur en herbe',
      description: 'Vous avez créé votre première composition',
      unlocked: compositions.length > 0,
    },
    {
      icon: Share2,
      title: 'Partageur',
      description: 'Vous avez partagé une composition',
      unlocked: false,
    },
  ];

  const actions: ActionItem[] = [
    {
      icon: Share2,
      title: 'Partager mon profil',
      description: 'Inviter des amis à découvrir vos compositions',
      onPress: handleShareProfile,
    },
    {
      icon: FileIcon,
      title: 'Exporter mes données',
      description: 'Télécharger toutes vos compositions',
      onPress: handleExportData,
    },
  ];

  return (
    <Screen background={colors.card}>
      <ScreenHeader
        title="Profil"
        onBack={() => router.back()}
        right={
          <TouchableOpacity
            onPress={() => {
              setEditedName(user?.name || '');
              setIsEditModalVisible(true);
            }}
            hitSlop={touchSlop}
            accessibilityRole="button"
            accessibilityLabel="Modifier le profil"
            style={{
              minWidth: MIN_TOUCH_TARGET,
              minHeight: MIN_TOUCH_TARGET,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Edit size={icon.md} color={colors.icon} />
          </TouchableOpacity>
        }
      />

      <ScrollView
        style={{ flex: 1, backgroundColor: colors.background }}
        contentContainerStyle={{ paddingVertical: spacing.md, gap: spacing.md }}
        showsVerticalScrollIndicator={false}
      >
        {/* Identité */}
        <Content>
          <CardComponent style={{ alignItems: 'center', gap: spacing.xs, padding: spacing.xl }}>
            <View
              style={{
                width: avatarSize,
                height: avatarSize,
                borderRadius: avatarSize / 2,
                backgroundColor: `${colors.cardForeground}85`,
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                marginBottom: spacing.xs,
              }}
            >
              {user?.avatar ? (
                <Image source={{ uri: user.avatar }} style={{ width: '100%', height: '100%' }} />
              ) : (
                <TextComponent variante="subtitle0" color={colors.primaryForeground}>
                  {user?.name?.charAt(0) || 'U'}
                </TextComponent>
              )}
            </View>

            <TextComponent variante="subtitle1" color={colors.text}>
              {user?.name || 'Utilisateur'}
            </TextComponent>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs }}>
              <Mail size={icon.xs} color={colors.text2} />
              <TextComponent variante="body4" color={colors.text2} numberOfLines={1}>
                {user?.email || 'user@harmonia.com'}
              </TextComponent>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs }}>
              <Calendar size={icon.xs} color={colors.text2} />
              <TextComponent variante="body5" color={colors.text2}>
                Membre depuis janvier 2025
              </TextComponent>
            </View>
          </CardComponent>
        </Content>

        {/* Statistiques : en ligne dès qu'il y a la place, empilées sinon. */}
        <Content>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
            {stats.map((stat) => (
              <CardComponent
                key={stat.label}
                style={{
                  flexGrow: 1,
                  flexBasis: isSmall ? '100%' : 0,
                  minWidth: isSmall ? '100%' : 96,
                  alignItems: 'center',
                  gap: spacing.xxs,
                }}
              >
                <stat.icon size={icon.md} color={stat.color} />
                <TextComponent variante="subtitle2" color={colors.text}>
                  {stat.value}
                </TextComponent>
                <TextComponent variante="body5" color={colors.text2}>
                  {stat.label}
                </TextComponent>
              </CardComponent>
            ))}
          </View>
        </Content>

        {/* Succès */}
        <Content>
          <CardComponent style={{ gap: spacing.sm }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs }}>
              <Award size={icon.md} color={colors.primary} />
              <TextComponent variante="subtitle2" color={colors.text}>
                Succès
              </TextComponent>
            </View>

            {achievements.map((achievement, index) => (
              <View
                key={achievement.title}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: spacing.sm,
                  paddingVertical: spacing.sm,
                  borderBottomWidth: index === achievements.length - 1 ? 0 : 1,
                  borderBottomColor: colors.border,
                }}
              >
                <View
                  style={{
                    width: scale(40),
                    height: scale(40),
                    borderRadius: radius.pill,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: achievement.unlocked ? `${colors.blueSingle}20` : colors.muted,
                  }}
                >
                  <achievement.icon
                    size={icon.sm}
                    color={achievement.unlocked ? colors.blueSingle : colors.text2}
                  />
                </View>

                <View style={{ flex: 1, minWidth: 0 }}>
                  <TextComponent
                    variante="subtitle3"
                    color={achievement.unlocked ? colors.text : colors.text2}
                  >
                    {achievement.title}
                  </TextComponent>
                  <TextComponent variante="body5" color={colors.text2}>
                    {achievement.description}
                  </TextComponent>
                </View>
              </View>
            ))}
          </CardComponent>
        </Content>

        {/* Actions */}
        <Content>
          <View style={{ gap: spacing.sm }}>
            {actions.map((action) => (
              <ListItemCard
                key={action.title}
                title={action.title}
                description={action.description}
                leading={<action.icon size={icon.md} color={colors.primary} />}
                onPress={action.onPress}
              />
            ))}
          </View>
        </Content>
      </ScrollView>

      <Modal
        visible={isEditModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsEditModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={editStyles.overlay}
        >
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={() => setIsEditModalVisible(false)}
            accessibilityRole="button"
            accessibilityLabel="Fermer"
          />

          <View
            style={[
              editStyles.container,
              { backgroundColor: colors.card, borderColor: colors.border, borderRadius: radius.xl, gap: spacing.lg, padding: spacing.lg },
            ]}
          >
            <View style={editStyles.header}>
              <TextComponent variante="subtitle2" color={colors.text} style={{ flex: 1 }}>
                Modifier le profil
              </TextComponent>

              <TouchableOpacity
                onPress={() => setIsEditModalVisible(false)}
                hitSlop={touchSlop}
                accessibilityRole="button"
                accessibilityLabel="Fermer"
                style={{
                  minWidth: MIN_TOUCH_TARGET,
                  minHeight: MIN_TOUCH_TARGET,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <X size={icon.md} color={colors.icon} />
              </TouchableOpacity>
            </View>

            <View style={{ gap: spacing.xs }}>
              <TextComponent variante="subtitle3" color={colors.text}>
                Nom affiché
              </TextComponent>
              <TextInput
                style={{
                  backgroundColor: colors.background,
                  borderRadius: radius.md,
                  paddingHorizontal: spacing.sm,
                  paddingVertical: spacing.sm,
                  minHeight: MIN_TOUCH_TARGET,
                  fontSize: fontSize(16),
                  color: colors.text,
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
                value={editedName}
                onChangeText={setEditedName}
                placeholder="Votre nom"
                placeholderTextColor={colors.text2}
                returnKeyType="done"
                onSubmitEditing={handleSaveProfile}
                maxFontSizeMultiplier={MAX_FONT_SCALE}
                accessibilityLabel="Nom affiché"
                autoFocus
              />
            </View>

            <View style={{ flexDirection: 'row', gap: spacing.sm }}>
              <ButtonComponent
                title="Annuler"
                onPress={() => setIsEditModalVisible(false)}
                variant="secondary"
                style={{ flex: 1 }}
              />
              <ButtonComponent
                title="Enregistrer"
                onPress={handleSaveProfile}
                disabled={!editedName.trim()}
                style={{ flex: 1 }}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </Screen>
  );
}

const editStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    width: '100%',
    maxWidth: 440,
    borderWidth: 1,
    ...elevation(3),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
});
