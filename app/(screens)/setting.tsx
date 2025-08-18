import React, { useState, Dispatch, SetStateAction } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  ArrowLeft, 
  Moon, 
  Bell, 
  Download, 
  Shield,
  HelpCircle,
  Info,
  ChevronRight,
  Trash2,
  RefreshCw,
  LucideIcon
} from 'lucide-react-native';
import { TextComponent } from '@/components/TextComponent';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useRouter } from 'expo-router';

/** Types discriminés pour les paramètres */
type SwitchItem = {
  icon: LucideIcon;
  title: string;
  description: string;
  type: 'switch';
  value: boolean;
  onValueChange: Dispatch<SetStateAction<boolean>>;
};

type NavigationItem = {
  icon: LucideIcon;
  title: string;
  description: string;
  type: 'navigation';
  onPress: () => void;
};

type SettingItem = SwitchItem | NavigationItem;

type SettingSection = {
  title: string;
  items: SettingItem[];
};

/** Type pour les actions dangereuses */
type DangerAction = {
  icon: LucideIcon;
  title: string;
  description: string;
  onPress: () => void;
};

export default function SettingsScreen() {
  const colors = useThemeColors();
  const router = useRouter();
  
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [autoDownload, setAutoDownload] = useState(false);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.card,
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
    content: {
      flex: 1,
      backgroundColor: colors.background,
    },
    section: {
      backgroundColor: colors.card,
      margin: 20,
      borderRadius: 16,
      overflow: 'hidden',
    },
    sectionHeader: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    settingItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    settingItemLast: {
      borderBottomWidth: 0,
    },
    settingIcon: {
      marginRight: 16,
    },
    settingContent: {
      flex: 1,
    },
    settingTitle: {
      marginBottom: 4,
    },
    settingDescription: {
      opacity: 0.7,
    },
    settingAction: {
      marginLeft: 12,
    },
    dangerSection: {
      backgroundColor: colors.destructive + '10',
      borderColor: colors.destructive + '30',
      borderWidth: 1,
    },
    dangerItem: {
      borderBottomColor: colors.destructive + '20',
    },
    versionInfo: {
      alignItems: 'center',
      padding: 20,
    },
  });

  const settingSections: SettingSection[] = [
    {
      title: 'Apparence',
      items: [
        {
          icon: Moon,
          title: 'Mode sombre',
          description: 'Activer le thème sombre',
          type: 'switch',
          value: darkMode,
          onValueChange: setDarkMode,
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
          value: notifications,
          onValueChange: setNotifications,
        },
      ],
    },
    {
      title: 'Téléchargements',
      items: [
        {
          icon: Download,
          title: 'Téléchargement automatique',
          description: 'Télécharger automatiquement les nouvelles partitions proposé par Partitio',
          type: 'switch',
          value: autoDownload,
          onValueChange: setAutoDownload,
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
          title: 'Centre d\'aide',
          description: 'FAQ et guides d\'utilisation',
          type: 'navigation',
          onPress: () => console.log('Aide'),
        },
        {
          icon: Info,
          title: 'À propos',
          description: 'Informations sur l\'application',
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
      onPress: () => console.log('Réinitialiser'),
    },
    {
      icon: Trash2,
      title: 'Supprimer le compte',
      description: 'Supprimer définitivement votre compte',
      onPress: () => console.log('Supprimer compte'),
    },
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
              Paramètres
            </TextComponent>
          </View>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Sections de paramètres */}
          {settingSections.map((section, sectionIndex) => (
            <View key={sectionIndex} style={styles.section}>
              <View style={styles.sectionHeader}>
                <TextComponent variante="subtitle2">
                  {section.title}
                </TextComponent>
              </View>
              
              {section.items.map((item, itemIndex) => (
                <TouchableOpacity
                  key={itemIndex}
                  style={[
                    styles.settingItem,
                    itemIndex === section.items.length - 1 && styles.settingItemLast
                  ]}
                  onPress={item.type === 'navigation' ? item.onPress : undefined}
                  disabled={item.type === 'switch'}
                >
                  <item.icon size={24} color={colors.icon} style={styles.settingIcon} />
                  
                  <View style={styles.settingContent}>
                    <TextComponent variante="subtitle2" style={styles.settingTitle}>
                      {item.title}
                    </TextComponent>
                    <TextComponent variante="body4" style={styles.settingDescription}>
                      {item.description}
                    </TextComponent>
                  </View>
                  
                  <View style={styles.settingAction}>
                    {item.type === 'switch' ? (
                      <Switch
                        value={item.value}
                        onValueChange={item.onValueChange}
                        trackColor={{ false: colors.muted, true: colors.primary + '40' }}
                        thumbColor={item.value ? colors.primary : colors.text2}
                      />
                    ) : (
                      <ChevronRight size={20} color={colors.text2} />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ))}

          {/* Actions dangereuses */}
          <View style={[styles.section, styles.dangerSection]}>
            <View style={styles.sectionHeader}>
              <TextComponent variante="subtitle2" color={colors.destructive}>
                Zone de danger
              </TextComponent>
            </View>
            
            {dangerActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.settingItem,
                  styles.dangerItem,
                  index === dangerActions.length - 1 && styles.settingItemLast
                ]}
                onPress={action.onPress}
              >
                <action.icon size={24} color={colors.destructive} style={styles.settingIcon} />
                
                <View style={styles.settingContent}>
                  <TextComponent variante="subtitle2" style={styles.settingTitle} color={colors.destructive}>
                    {action.title}
                  </TextComponent>
                  <TextComponent variante="body4" style={styles.settingDescription}>
                    {action.description}
                  </TextComponent>
                </View>
                
                <ChevronRight size={20} color={colors.destructive} style={styles.settingAction} />
              </TouchableOpacity>
            ))}
          </View>

          {/* Informations de version */}
          <View style={styles.versionInfo}>
            <TextComponent variante="body4" color={colors.text2}>
              Partitio v1.0.0
            </TextComponent>
            <TextComponent variante="body4" color={colors.text2} style={{ marginTop: 4 }}>
              © 2025 Partitio. Tous droits réservés.
            </TextComponent>
            <TextComponent variante="body4" color={colors.text2} style={{ marginTop: 4 }}>
              By Jemuel G. ANIFA
            </TextComponent>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
