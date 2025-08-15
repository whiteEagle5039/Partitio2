import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert, Animated, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Settings,
  Save, 
  Share, 
  FileText,
  X
} from 'lucide-react-native';
import { TextComponent } from '@/components/TextComponent';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useAppStore } from '@/stores/appStore';
import { useRouter } from 'expo-router';
import { MusicEditor } from '@/components/MusicEditor';
import { MusicKeyboard } from '@/components/Musickeyboard';
import { CompositionDrawer } from '@/components/CompositionDrawer';

interface Section {
  id: string;
  name: string;
  soprano: string;
  alto: string;
  tenor: string;
  bass: string;
}

interface Composition {
  title: string;
  tempo: string;
  key: string;
  sections: Section[];
}

const { width: screenWidth } = Dimensions.get('window');

export default function ComposeScreen() {
  const colors = useThemeColors();
  const router = useRouter();
  const { addComposition } = useAppStore();
  
  // État principal de la composition
  const [composition, setComposition] = useState<Composition>({
    title: 'Ma Composition',
    tempo: '4/4',
    key: 'Do M',
    sections: [
      {
        id: '1',
        name: 'Couplet 1',
        soprano: '',
        alto: '',
        tenor: '',
        bass: '',
      }
    ],
  });

  // État de l'interface
  const [activeVoice, setActiveVoice] = useState<'S' | 'A' | 'T' | 'B'>('S');
  const [activeSectionId, setActiveSectionId] = useState('1');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [drawerAnimation] = useState(new Animated.Value(0));

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    mainContent: {
      flex: 1,
    },
    animatedContainer: {
      flex: 1,
      flexDirection: 'row',
    },
    contentContainer: {
      flex: 1,
    },
    editorContainer: {
      flex: 1,
    },
    keyboardContainer: {
      backgroundColor: colors.card,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    // Bouton de configuration flottant
    floatingConfigButton: {
      position: 'absolute',
      bottom: 30,
      right: 20,
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: colors.primary + 'CC', // Semi-transparent
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 6,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.3,
      shadowRadius: 6,
    },
    // Drawer de navigation
    drawer: {
      width: 320,
      backgroundColor: colors.card,
      elevation: 8,
      shadowColor: '#000',
      shadowOffset: { width: -2, height: 0 },
      shadowOpacity: 0.25,
      shadowRadius: 8,
      borderLeftWidth: 1,
      borderLeftColor: colors.border,
    },
    drawerHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 20,
      backgroundColor: colors.primary + '10',
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    drawerTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
    },
    closeButton: {
      padding: 8,
      borderRadius: 8,
      backgroundColor: colors.background2,
    },
    drawerContent: {
      flex: 1,
      padding: 20,
    },
    actionSection: {
      marginBottom: 30,
    },
    actionSectionTitle: {
      fontSize: 14,
      fontWeight: 'bold',
      color: colors.text2,
      marginBottom: 16,
      textTransform: 'uppercase',
    },
    actionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      backgroundColor: colors.background2,
      borderRadius: 12,
      marginBottom: 8,
    },
    actionButtonText: {
      marginLeft: 12,
      fontSize: 16,
      color: colors.text,
      fontWeight: '500',
    },
    primaryActionButton: {
      backgroundColor: colors.primary + '20',
      borderColor: colors.primary + '40',
      borderWidth: 1,
    },
    primaryActionButtonText: {
      color: colors.primary,
    },
    // Titres de sections repositionnés
    sectionTitleContainer: {
      position: 'absolute',
      top: 8,
      right: 16,
      backgroundColor: colors.background + 'E6',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: colors.border,
      zIndex: 10,
    },
    sectionTitle: {
      fontSize: 12,
      fontWeight: 'bold',
      color: colors.primary,
    },
    sectionInfo: {
      fontSize: 10,
      color: colors.text2,
    },
    activeSectionTitleContainer: {
      backgroundColor: colors.primary + '20',
      borderColor: colors.primary,
    },
  });

  // Animation du drawer
  const toggleDrawer = () => {
    const toValue = isDrawerOpen ? 0 : 1;
    setIsDrawerOpen(!isDrawerOpen);
    
    Animated.timing(drawerAnimation, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  // Gestion de la sauvegarde
  const handleSave = async () => {
    if (!composition.title.trim()) {
      Alert.alert('Erreur', 'Veuillez saisir un titre pour votre composition');
      return;
    }

    const newComposition = {
      id: Date.now().toString(),
      title: composition.title.trim(),
      content: formatCompositionAsText(composition),
      createdAt: new Date(),
      lastModified: new Date(),
      isPublic: false,
    };

    addComposition(newComposition);
    Alert.alert('Succès', 'Votre composition a été sauvegardée !');
  };

  // Formatage de la composition en texte structuré
  const formatCompositionAsText = (comp: Composition): string => {
    let text = `# Titre: ${comp.title}\n`;
    text += `# Temps: ${comp.tempo}\n`;
    text += `# Gamme: ${comp.key}\n\n`;

    comp.sections.forEach((section) => {
      text += `## ${section.name}\n`;
      text += `S: ${section.soprano}\n`;
      text += `A: ${section.alto}\n`;
      text += `T: ${section.tenor}\n`;
      text += `B: ${section.bass}\n\n`;
    });

    return text;
  };

  // Gestion de l'export PDF
  const handleExportPDF = () => {
    Alert.alert(
      'Exporter en PDF',
      'Cette fonctionnalité sera bientôt disponible',
      [{ text: 'OK' }]
    );
  };

  // Gestion de la navigation vers une section
  const handleSectionSelect = (sectionId: string) => {
    setActiveSectionId(sectionId);
  };

  // Gestion du focus sur les lignes de partition
  const handleStaffFocus = (voice: 'S' | 'A' | 'T' | 'B', sectionId: string) => {
    setActiveVoice(voice);
    setActiveSectionId(sectionId);
    setShowKeyboard(true);
  };

  // Gestion des touches du clavier musical
  const handleInsertNote = (note: string) => {
    const currentSection = composition.sections.find(s => s.id === activeSectionId);
    if (!currentSection) return;

    const voiceKey = activeVoice.toLowerCase() as keyof Omit<Section, 'id' | 'name'>;
    const currentContent = currentSection[voiceKey];
    const newContent = currentContent + note + ' ';

    updateSectionContent(activeSectionId, voiceKey, newContent);
  };

  const handleInsertSymbol = (symbol: string) => {
    const currentSection = composition.sections.find(s => s.id === activeSectionId);
    if (!currentSection) return;

    const voiceKey = activeVoice.toLowerCase() as keyof Omit<Section, 'id' | 'name'>;
    const currentContent = currentSection[voiceKey];
    const newContent = currentContent + symbol;

    updateSectionContent(activeSectionId, voiceKey, newContent);
  };

  const handleInsertMeasure = () => {
    handleInsertSymbol(' | ');
  };

  const handleDeleteLast = () => {
    const currentSection = composition.sections.find(s => s.id === activeSectionId);
    if (!currentSection) return;

    const voiceKey = activeVoice.toLowerCase() as keyof Omit<Section, 'id' | 'name'>;
    const currentContent = currentSection[voiceKey];
    const newContent = currentContent.slice(0, -1);

    updateSectionContent(activeSectionId, voiceKey, newContent);
  };

  // Mise à jour du contenu d'une section
  const updateSectionContent = (sectionId: string, voice: keyof Omit<Section, 'id' | 'name'>, content: string) => {
    setComposition(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId
          ? { ...section, [voice]: content }
          : section
      )
    }));
  };

  const contentTranslateX = drawerAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -320],
  });

  const drawerTranslateX = drawerAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [320, 0],
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.animatedContainer}>
        {/* Contenu principal */}
        <Animated.View 
          style={[
            styles.contentContainer,
            { transform: [{ translateX: contentTranslateX }] }
          ]}
        >
          {/* Éditeur de partition en plein écran */}
          <View style={styles.editorContainer}>
            <MusicEditor
              composition={composition}
              onCompositionChange={setComposition}
              activeVoice={activeVoice}
              activeSectionId={activeSectionId}
              onVoiceChange={setActiveVoice}
              onSectionChange={setActiveSectionId}
              onStaffFocus={handleStaffFocus}
              showSectionTitles={true}
            />
          </View>

          {/* Clavier musical (affiché conditionnellement) */}
          {showKeyboard && (
            <View style={styles.keyboardContainer}>
              <MusicKeyboard
                activeVoice={activeVoice}
                onVoiceChange={setActiveVoice}
                onInsertNote={handleInsertNote}
                onInsertSymbol={handleInsertSymbol}
                onInsertMeasure={handleInsertMeasure}
                onDeleteLast={handleDeleteLast}
                onClose={() => setShowKeyboard(false)}
              />
            </View>
          )}

          {/* Bouton de configuration flottant */}
          {!showKeyboard && (
            <TouchableOpacity 
              style={styles.floatingConfigButton}
              onPress={toggleDrawer}
            >
              <Settings size={24} color={colors.primaryForeground} />
            </TouchableOpacity>
          )}
        </Animated.View>

        {/* Drawer de navigation */}
        <Animated.View 
          style={[
            styles.drawer,
            { transform: [{ translateX: drawerTranslateX }] }
          ]}
        >
          <View style={styles.drawerHeader}>
            <TextComponent style={styles.drawerTitle}>
              {composition.title}
            </TextComponent>
            <TouchableOpacity style={styles.closeButton} onPress={toggleDrawer}>
              <X size={20} color={colors.icon} />
            </TouchableOpacity>
          </View>

          <View style={styles.drawerContent}>
            {/* Actions principales */}
            <View style={styles.actionSection}>
              <TextComponent style={styles.actionSectionTitle}>
                Actions
              </TextComponent>
              
              <TouchableOpacity 
                style={[styles.actionButton, styles.primaryActionButton]}
                onPress={handleSave}
              >
                <Save size={20} color={colors.primary} />
                <TextComponent style={[styles.actionButtonText, styles.primaryActionButtonText]}>
                  Sauvegarder
                </TextComponent>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.actionButton}
                onPress={handleExportPDF}
              >
                <Share size={20} color={colors.icon} />
                <TextComponent style={styles.actionButtonText}>
                  Exporter PDF
                </TextComponent>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => router.back()}
              >
                <FileText size={20} color={colors.icon} />
                <TextComponent style={styles.actionButtonText}>
                  Retour à la bibliothèque
                </TextComponent>
              </TouchableOpacity>
            </View>

            {/* Configuration de la composition */}
            <View style={styles.actionSection}>
              <TextComponent style={styles.actionSectionTitle}>
                Configuration
              </TextComponent>
              
              <CompositionDrawer
                isOpen={false}
                onClose={() => {}}
                composition={composition}
                onCompositionChange={setComposition}
                onSectionSelect={handleSectionSelect}
                activeSectionId={activeSectionId}
                embedded={true}
              />
            </View>
          </View>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}