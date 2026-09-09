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
} from 'lucide-react-native';
import React from 'react';
import { Image, ScrollView, TouchableOpacity, View } from 'react-native';

import { CardComponent } from '@/components/uxComponents/CardComponent';
import { ListItemCard } from '@/components/uxComponents/ListItemCard';
import { Content, Screen } from '@/components/uxComponents/Screen';
import { ScreenHeader } from '@/components/uxComponents/ScreenHeader';
import { TextComponent } from '@/components/uxComponents/TextComponent';
import { MIN_TOUCH_TARGET, touchSlop } from '@/constants/layout';
import { useResponsive } from '@/hooks/useResponsive';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useAppStore } from '@/stores/appStore';

type Stat = { icon: LucideIcon; label: string; value: number; color: string };
type Achievement = { icon: LucideIcon; title: string; description: string; unlocked: boolean };
type ActionItem = { icon: LucideIcon; title: string; description: string; onPress: () => void };

export default function ProfileScreen() {
  const colors = useThemeColors();
  const router = useRouter();
  const { spacing, radius, icon, scale, isSmall } = useResponsive();
  const { user, sheetMusic, compositions } = useAppStore();

  const avatarSize = scale(84);

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
      onPress: () => console.log('Partager profil'),
    },
    {
      icon: FileIcon,
      title: 'Exporter mes données',
      description: 'Télécharger toutes vos compositions',
      onPress: () => console.log('Exporter données'),
    },
  ];

  return (
    <Screen background={colors.card}>
      <ScreenHeader
        title="Profil"
        onBack={() => router.back()}
        right={
          <TouchableOpacity
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
    </Screen>
  );
}
