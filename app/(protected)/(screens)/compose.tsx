import { CompositionDrawer } from '@/components/CompositionDrawer';
import { MusicEditor } from '@/components/MusicEditor';
import { MusicKeyboard } from '@/components/Musickeyboard';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useAppStore } from '@/stores/appStore';
import { useRouter } from 'expo-router';
import { Settings2 } from 'lucide-react-native';
import React, { useState } from 'react';
import { Animated, StyleSheet, TouchableOpacity, View } from 'react-native';

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
    title: 'Ma composition - John .D #1',
    tempo: '4/4',
    key: 'Do',
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
  const [cursorSelection, setCursorSelection] = useState<{ start: number; end: number } | null>(null);

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
      backgroundColor: colors.primary + 'CC',
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 6,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.3,
      shadowRadius: 6,
    },
  });

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

  // Gestion de la navigation vers une section
  const handleSectionSelect = (sectionId: string) => {
    setActiveSectionId(sectionId);
    setIsDrawerOpen(false);
  };

  // Gestion des touches du clavier musical
  const handleInsertNote = (note: string) => {
    console.log('🎵 handleInsertNote appelé avec:', note);
    console.log('📍 Section active:', activeSectionId);
    console.log('🎤 Voix active:', activeVoice);
    
    const currentSection = composition.sections.find(s => s.id === activeSectionId);
    if (!currentSection) {
        console.log('❌ Section non trouvée !');
        return;
    }
    
    console.log('✅ Section trouvée:', currentSection.name);

    const voiceKey = activeVoice.toLowerCase() as keyof Omit<Section, 'id' | 'name'>;
    const currentContent = currentSection[voiceKey] || '';
    console.log('📝 Contenu actuel:', currentContent);
    
    const sel = cursorSelection || { start: currentContent.length, end: currentContent.length };
    const before = currentContent.slice(0, sel.start);
    const after = currentContent.slice(sel.end);
    const insertText = note + ' ';
    const newContent = before + insertText + after;
    
    console.log('✨ Nouveau contenu:', newContent);

    updateSectionContent(activeSectionId, voiceKey, newContent);
    const newPos = before.length + insertText.length;
    setCursorSelection({ start: newPos, end: newPos });
};

  // const handleInsertSymbol = (symbol: string) => {
  //   const currentSection = composition.sections.find(s => s.id === activeSectionId);
  //   if (!currentSection) return;

  //   const voiceKey = activeVoice.toLowerCase() as keyof Omit<Section, 'id' | 'name'>;
  //   const currentContent = currentSection[voiceKey] || '';
  //   const sel = cursorSelection || { start: currentContent.length, end: currentContent.length };
  //   const before = currentContent.slice(0, sel.start);
  //   const after = currentContent.slice(sel.end);
  //   const insertText = symbol;
  //   const newContent = before + insertText + after;

  //   updateSectionContent(activeSectionId, voiceKey, newContent);
  //   const newPos = before.length + insertText.length;
  //   setCursorSelection({ start: newPos, end: newPos });
  // };
  
//   const handleInsertSymbol = (symbol: string) => {
//   const currentSection = composition.sections.find(s => s.id === activeSectionId);
//   if (!currentSection) return;

//   const voiceKey = activeVoice.toLowerCase() as keyof Omit<Section, 'id' | 'name'>;
//   const currentContent = currentSection[voiceKey] || '';
//   const sel = cursorSelection || { start: currentContent.length, end: currentContent.length };
//   const before = currentContent.slice(0, sel.start);
//   const after = currentContent.slice(sel.end);
  
//   // Traitement spécial pour la mesure et le tiret
//   let insertText = symbol;
//   if (symbol === '|') {
//     insertText = ' | ';
//   } else if (symbol === '-') {
//     insertText = ' - ';
//   }
  
//   const newContent = before + insertText + after;
//   updateSectionContent(activeSectionId, voiceKey, newContent);
//   const newPos = before.length + insertText.length;
//   setCursorSelection({ start: newPos, end: newPos });
// };
//   const handleInsertMeasure = () => {
//     handleInsertSymbol(' | ');
//   };

  const handleDeleteLast = () => {
    const currentSection = composition.sections.find(s => s.id === activeSectionId);
    if (!currentSection) return;

    const voiceKey = activeVoice.toLowerCase() as keyof Omit<Section, 'id' | 'name'>;
    const currentContent = currentSection[voiceKey] || '';
    const sel = cursorSelection || { start: currentContent.length, end: currentContent.length };
    if (sel.start === sel.end && sel.start > 0) {
      // delete previous character
      const before = currentContent.slice(0, sel.start - 1);
      const after = currentContent.slice(sel.end);
      const newContent = before + after;
      updateSectionContent(activeSectionId, voiceKey, newContent);
      const newPos = sel.start - 1;
      setCursorSelection({ start: newPos, end: newPos });
    } else if (sel.start !== sel.end) {
      // delete selection
      const before = currentContent.slice(0, sel.start);
      const after = currentContent.slice(sel.end);
      const newContent = before + after;
      updateSectionContent(activeSectionId, voiceKey, newContent);
      setCursorSelection({ start: before.length, end: before.length });
    }
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
    // reset selection if switching focus
    setCursorSelection(null);
  };

  const handleSelectionChange = (voice: 'S' | 'A' | 'T' | 'B', sectionId: string, selection: { start: number; end: number }) => {
    // Mettre à jour la sélection sans condition pour éviter les désynchronisations
    setCursorSelection(selection);
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

  // Fonction pour gérer les changements de composition (ajout/suppression de sections)
  const handleCompositionChange = (newComposition: Composition) => {
    setComposition(newComposition);
    
    // Vérifier si la section active existe encore
    const activeExists = newComposition.sections.some(s => s.id === activeSectionId);
    if (!activeExists && newComposition.sections.length > 0) {
      setActiveSectionId(newComposition.sections[0].id);
    }
  };

  return (
    <View style={styles.container}>
      {/* Éditeur de partition */}
      <View style={styles.editorContainer}>
        <MusicEditor
          composition={composition}
          onCompositionChange={handleCompositionChange}
          activeVoice={activeVoice}
          activeSectionId={activeSectionId}
          onVoiceChange={setActiveVoice}
          onSectionChange={setActiveSectionId}
          onStaffFocus={handleStaffFocus}
          cursorSelection={cursorSelection}
          onSelectionChange={handleSelectionChange}
        />
      </View>

      {/* Clavier musical */}
      {showKeyboard && (
        <View style={styles.keyboardContainer}>
          <MusicKeyboard
            activeVoice={activeVoice}
            onVoiceChange={setActiveVoice}
            onInsertNote={handleInsertNote}
            // onInsertSymbol={handleInsertSymbol}
            // onInsertMeasure={handleInsertMeasure}
            onDeleteLast={handleDeleteLast}
            onClose={() => setShowKeyboard(false)}
            currentContent={composition.sections.find(s => s.id === activeSectionId)?.[activeVoice.toLowerCase() as keyof Section] as string}
          />
        </View>
      )}

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