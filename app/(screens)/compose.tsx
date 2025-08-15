import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert, BackHandler, Animated } from 'react-native';
import { TextComponent } from '@/components/TextComponent';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useAppStore } from '@/stores/appStore';
import { useRouter } from 'expo-router';
import { MusicEditor } from '@/components/MusicEditor';
import { MusicKeyboard } from '@/components/Musickeyboard';
import { CompositionDrawer } from '@/components/CompositionDrawer';
import { Settings, Settings2 } from 'lucide-react-native';

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

export default function ComposeScreen() {
  const colors = useThemeColors();
  const router = useRouter();
  const { addComposition } = useAppStore();
  
  // État principal de la composition
  const [composition, setComposition] = useState<Composition>({
    title: '',
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

    backButton: {
      marginRight: 16,
      padding: 8,
    },

    actionButton: {
      padding: 8,
    },
    editorContainer: {
      flex: 1,
    },
    keyboardContainer: {
      backgroundColor: colors.card,
    },
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
  });

  // // Gestion de la sauvegarde
  // const handleSave = async () => {
  //   if (!composition.title.trim()) {
  //     Alert.alert('Erreur', 'Veuillez saisir un titre pour votre composition');
  //     return;
  //   }

  //   const newComposition = {
  //     id: Date.now().toString(),
  //     title: composition.title.trim(),
  //     content: formatCompositionAsText(composition),
  //     createdAt: new Date(),
  //     lastModified: new Date(),
  //     isPublic: false,
  //   };

  //   addComposition(newComposition);
  //   Alert.alert('Succès', 'Votre composition a été sauvegardée !');
  // };

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

  // // Gestion de l'export PDF
  // const handleExportPDF = () => {
  //   Alert.alert(
  //     'Exporter en PDF',
  //     'Cette fonctionnalité sera bientôt disponible',
  //     [{ text: 'OK' }]
  //   );
  // };

  // Gestion de la navigation vers une section
  const handleSectionSelect = (sectionId: string) => {
    setActiveSectionId(sectionId);
    setIsDrawerOpen(false);
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
// Gestion du focus sur les lignes de partition
  const handleStaffFocus = (voice: 'S' | 'A' | 'T' | 'B', sectionId: string) => {
    setActiveVoice(voice);
    setActiveSectionId(sectionId);
    setShowKeyboard(true);
  };

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
  // // Gestion de la fermeture avec confirmation
  // const handleGoBack = () => {
  //   const hasContent = composition.sections.some(section => 
  //     section.soprano || section.alto || section.tenor || section.bass
  //   ) || composition.title.trim();

  //   if (hasContent) {
  //     Alert.alert(
  //       'Quitter la composition',
  //       'Vous avez des modifications non sauvegardées. Voulez-vous vraiment quitter ?',
  //       [
  //         { text: 'Annuler', style: 'cancel' },
  //         { text: 'Sauvegarder et quitter', onPress: () => { handleSave(); router.back(); } },
  //         { text: 'Quitter sans sauvegarder', style: 'destructive', onPress: () => router.back() },
  //       ]
  //     );
  //   } else {
  //     router.back();
  //   }
  // };

  return (
    <View style={styles.container}>
        {/* Éditeur de partition */}
        <View style={styles.editorContainer}>
          <MusicEditor
            composition={composition}
            onCompositionChange={setComposition}
            activeVoice={activeVoice}
            activeSectionId={activeSectionId}
            onVoiceChange={setActiveVoice}
            onSectionChange={setActiveSectionId}
            onStaffFocus={handleStaffFocus}

          />
        </View>

        {/* Clavier musical */}
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
            </View>)}

            {/* Bouton de configuration flottant */}
          {!showKeyboard && (
            <TouchableOpacity 
              style={styles.floatingConfigButton}
              onPress={toggleDrawer}
            >
              <Settings2 size={24} color={colors.primaryForeground} />
              
            </TouchableOpacity>
          )}

        {/* Drawer de configuration */}
        <CompositionDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          composition={composition}
          onCompositionChange={setComposition}
          onSectionSelect={handleSectionSelect}
          activeSectionId={activeSectionId}
        />
    </View>
  );
}