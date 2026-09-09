import {
  Bell,
  ChevronRight,
  Download,
  HelpCircle,
  Info,
  LucideIcon,
  Moon,
  RefreshCw,
  Shield,
  Trash2,
} from 'lucide-react-native';
import React from 'react';
import { ScrollView, StyleSheet, Switch, TouchableOpacity, View } from 'react-native';

import { Content, Screen } from '@/components/uxComponents/Screen';
import { ScreenHeader } from '@/components/uxComponents/ScreenHeader';
import { TextComponent } from '@/components/uxComponents/TextComponent';
import { MIN_TOUCH_TARGET } from '@/constants/layout';
import { useResponsive } from '@/hooks/useResponsive';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useAppStore } from '@/stores/appStore';

type SwitchItem = {
  icon: LucideIcon;
  title: string;
  description: string;
  type: 'switch';
  value: boolean;
  onValueChange: (value: boolean) => void;
};

type NavigationItem = {
  icon: LucideIcon;
  title: string;
  description: string;
  type: 'navigation';
  onPress: () => void;
};

type SettingItem = SwitchItem | NavigationItem;
type SettingSection = { title: string; items: SettingItem[] };
type DangerAction = { icon: LucideIcon; title: string; description: string; onPress: () => void };

export default function SettingsScreen() {
  const colors = useThemeColors();
  const { spacing, radius, icon } = useResponsive();
  const { settings, updateSettings } = useAppStore();

  const settingSections: SettingSection[] = [
    {
      title: 'Apparence',
      items: [
        {
          icon: Moon,
          title: 'Mode sombre',
          description: 'Activer le thème sombre',
          type: 'switch',
          value: settings.darkMode,
          onValueChange: (value) => updateSettings({ darkMode: value }),
        },
      ],
    },
    {
      title: 'Notifications',
      items: [
        {
          icon: Bell,
          title: 'Notifications push',
          description: 'Recevoir des notifications',
          type: 'switch',
          value: settings.notifications,
          onValueChange: (value) => updateSettings({ notifications: value }),
        },
      ],
    },
    {
      title: 'Téléchargements',
      items: [
        {
          icon: Download,
          title: 'Téléchargement automatique',
          description: 'Télécharger automatiquement les nouvelles partitions proposées par Partitio',
          type: 'switch',
          value: settings.autoDownload,
          onValueChange: (value) => updateSettings({ autoDownload: value }),
        },
      ],
    },
    {
      title: 'Confidentialité et sécurité',
      items: [
        {
          icon: Shield,
          title: 'Confidentialité',
          description: 'Gérer vos données personnelles',
          type: 'navigation',
          onPress: () => console.log('Confidentialité'),
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          icon: HelpCircle,
          title: "Centre d'aide",
          description: "FAQ et guides d'utilisation",
          type: 'navigation',
          onPress: () => console.log('Aide'),
        },
        {
          icon: Info,
          title: 'À propos',
          description: "Informations sur l'application",
          type: 'navigation',
          onPress: () => console.log('À propos'),
        },
      ],
    },
  ];

  const dangerActions: DangerAction[] = [
    {
      icon: RefreshCw,
      title: 'Réinitialiser les paramètres',
      description: 'Remettre tous les paramètres par défaut',
      onPress: () => {
        updateSettings({ notifications: true, autoDownload: false, darkMode: false });
      },
    },
    {
      icon: Trash2,
      title: 'Supprimer le compte',
      description: 'Supprimer définitivement votre compte',
      onPress: () => console.log('Supprimer compte'),
    },
  ];

  const styles = StyleSheet.create({
    section: {
      backgroundColor: colors.card,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: 'hidden',
    },
    sectionHeader: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
      backgroundColor: colors.card2,
    },
    item: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      minHeight: MIN_TOUCH_TARGET + spacing.xs,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
    },
    itemLast: { borderBottomWidth: 0 },
    itemBody: { flex: 1, minWidth: 0, gap: 2 },
    dangerSection: {
      backgroundColor: `${colors.destructive}10`,
      borderColor: `${colors.destructive}30`,
    },
  });

  return (
    <Screen background={colors.card}>
      <ScreenHeader title="Paramètres" />

      <ScrollView
        style={{ flex: 1, backgroundColor: colors.background }}
        contentContainerStyle={{ paddingVertical: spacing.md, gap: spacing.md }}
        showsVerticalScrollIndicator={false}
      >
        {settingSections.map((section) => (
          <Content key={section.title}>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <TextComponent variante="subtitle3" color={colors.text}>
                  {section.title}
                </TextComponent>
              </View>

              {section.items.map((item, itemIndex) => (
                <TouchableOpacity
                  key={item.title}
                  style={[styles.item, itemIndex === section.items.length - 1 && styles.itemLast]}
                  onPress={item.type === 'navigation' ? item.onPress : undefined}
                  disabled={item.type === 'switch'}
                  accessibilityRole={item.type === 'navigation' ? 'button' : undefined}
                >
                  <item.icon size={icon.md} color={colors.icon} />

                  <View style={styles.itemBody}>
                    <TextComponent variante="subtitle3" color={colors.text}>
                      {item.title}
                    </TextComponent>
                    <TextComponent variante="body5" color={colors.text2}>
                      {item.description}
                    </TextComponent>
                  </View>

                  {item.type === 'switch' ? (
                    <Switch
                      value={item.value}
                      onValueChange={item.onValueChange}
                      trackColor={{ false: colors.muted, true: `${colors.primary}66` }}
                      thumbColor={item.value ? colors.primary : colors.text2}
                      accessibilityLabel={item.title}
                    />
                  ) : (
                    <ChevronRight size={icon.sm} color={colors.text2} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </Content>
        ))}

        {/* Zone de danger */}
        <Content>
          <View style={[styles.section, styles.dangerSection]}>
            <View style={[styles.sectionHeader, { backgroundColor: 'transparent' }]}>
              <TextComponent variante="subtitle3" color={colors.destructive}>
                Zone de danger
              </TextComponent>
            </View>

            {dangerActions.map((action, index) => (
              <TouchableOpacity
                key={action.title}
                style={[
                  styles.item,
                  { borderBottomColor: `${colors.destructive}20` },
                  index === dangerActions.length - 1 && styles.itemLast,
                ]}
                onPress={action.onPress}
                accessibilityRole="button"
              >
                <action.icon size={icon.md} color={colors.destructive} />

                <View style={styles.itemBody}>
                  <TextComponent variante="subtitle3" color={colors.destructive}>
                    {action.title}
                  </TextComponent>
                  <TextComponent variante="body5" color={colors.text2}>
                    {action.description}
                  </TextComponent>
                </View>

                <ChevronRight size={icon.sm} color={colors.destructive} />
              </TouchableOpacity>
            ))}
          </View>
        </Content>

        {/* Informations de version */}
        <View style={{ alignItems: 'center', gap: spacing.xxs, paddingVertical: spacing.lg }}>
          <TextComponent variante="body5" color={colors.text2}>
            Harmonia v1.0.0
          </TextComponent>
          <TextComponent variante="caption" color={colors.text2}>
            © 2025 Harmonia. Tous droits réservés.
          </TextComponent>
          <TextComponent variante="caption" color={colors.text2}>
            By Jemuel G. ANIFA
          </TextComponent>
        </View>
      </ScrollView>
    </Screen>
  );
}
