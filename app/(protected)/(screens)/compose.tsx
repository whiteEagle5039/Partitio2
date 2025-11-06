import { CompositionDrawer } from '@/components/CompositionDrawer';
import { MusicEditor } from '@/components/MusicEditor';
import { MusicKeyboard } from '@/components/Musickeyboard';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useAppStore } from '@/stores/appStore';
import { useRouter } from 'expo-router';
import { Settings2, Save, RotateCcw } from 'lucide-react-native';
import React, { useState, useRef } from 'react';
import { Animated, StyleSheet, TouchableOpacity, View, PanResponder } from 'react-native';
import { Dimensions } from 'react-native';
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
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
  
  // État principal de la composition
  const [composition, setComposition] = useState<Composition>({
    title: 'Sans titre - John .D #1',
    tempo: '4/4',
    key: 'Do',
    sections: [
      // {
      //   id: '1',
      //   name: 'Couplet 1',
      //   soprano: '',
      //   alto: '',
      //   tenor: '',
      //   bass: '',
      // }
    ],
  });

  // État de l'interface
  const [activeVoice, setActiveVoice] = useState<'S' | 'A' | 'T' | 'B'>('S');
  const [activeSectionId, setActiveSectionId] = useState('1');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [drawerAnimation] = useState(new Animated.Value(0));
  const [cursorSelection, setCursorSelection] = useState<{ start: number; end: number } | null>(null);
  const [showFloatingMenu, setShowFloatingMenu] = useState(false);
  
  // État pour gérer le drag vs click
  const [isDragging, setIsDragging] = useState(false);
  const dragStartTime = useRef(0);
  const startPosition = useRef({ x: 0, y: 0 });

  // Pour le bouton draggable
  const pan = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // N'activer le pan que si on a bougé de plus de 10 pixels
        const moved = Math.abs(gestureState.dx) > 10 || Math.abs(gestureState.dy) > 10;
        if (moved) {
          setIsDragging(true);
        }
        return moved;
      },
      onPanResponderGrant: (_, gestureState) => {
        dragStartTime.current = Date.now();
        startPosition.current = {
          x: (pan.x as any)._value,
          y: (pan.y as any)._value
        };
        pan.setOffset({
          x: startPosition.current.x,
          y: startPosition.current.y
        });
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: Animated.event(
        [null, { dx: pan.x, dy: pan.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: (_, gestureState) => {
        const newX = startPosition.current.x + gestureState.dx;
        const newY = startPosition.current.y + gestureState.dy;
        
        // Contraintes de l'écran (avec marges)
        const margin = 25;
        const buttonWidth = 50;
        const buttonHeight = 90;
        const maxX = 100; // Distance max vers la droite
        const minX = -300; // Distance max vers la gauche
        const maxY = 200; // Distance max vers le bas
        const minY = -600; // Distance max vers le haut
        
        // Limiter la position
        const constrainedX = Math.max(minX, Math.min(maxX, newX));
        const constrainedY = Math.max(minY, Math.min(maxY, newY));
        
        pan.flattenOffset();
        pan.setValue({ x: constrainedX, y: constrainedY });
        
        // Réinitialiser après un court délai
        setTimeout(() => setIsDragging(false), 150);
      }
    })
  ).current;

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
    draggableContainer: {
      position: 'absolute',
      bottom: 30,
      right: 20,
      alignItems: 'center',
    },
    floatingMenuButton: {
      width: 50,
      height: 90,
      borderRadius: 28,
      backgroundColor: colors.card,
      justifyContent: 'space-evenly',
      alignItems: 'center',
      paddingVertical: 16,
      elevation: 6,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.3,
      shadowRadius: 6,
      borderWidth: 1,
      borderColor: colors.border,
      gap: 12,
    },
    dotsContainer: {
      width: 24,
      height: 24,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 2,
    },
    dot: {
      width: 4,
      height: 4,
      borderRadius: 2,
      backgroundColor: colors.primary,
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

  // Gestion de la sauvegarde
  const handleSave = () => {
    console.log('💾 Sauvegarde de la composition...');
  };

  // Handlers pour les boutons flottants qui vérifient le drag
  const handleSavePress = () => {
    if (!isDragging && Date.now() - dragStartTime.current > 200) {
      console.log('💾 Bouton Save cliqué');
      handleSave();
    }
  };

  const handleDrawerPress = () => {
    if (!isDragging && Date.now() - dragStartTime.current > 200) {
      console.log('⚙️ Bouton Drawer cliqué');
      toggleDrawer();
    }
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
            onDeleteLast={handleDeleteLast}
            onClose={() => setShowKeyboard(false)}
            currentContent={composition.sections.find(s => s.id === activeSectionId)?.[activeVoice.toLowerCase() as keyof Section] as string}
          />
        </View>
      )}

      {/* Boutons flottants draggables */}
      {!showKeyboard && (
        <Animated.View 
          style={[
            styles.draggableContainer,
            {
              transform: [
                { translateX: pan.x },
                { translateY: pan.y }
              ]
            }
          ]}
        >
          <View 
            style={styles.floatingMenuButton}
            {...panResponder.panHandlers}
          >
            {/* Bouton Sauvegarder (en haut) */}
            <TouchableOpacity 
              onPress={handleSavePress}
              activeOpacity={0.7}
              disabled={isDragging}
            >
              <Save size={24} color={colors.text} />
            </TouchableOpacity>
            
            {/* Bouton Paramètres avec 3 points (en bas) */}
            <TouchableOpacity 
              onPress={handleDrawerPress}
              activeOpacity={0.7}
              disabled={isDragging}
            >
              <View style={styles.dotsContainer}>
                <View style={styles.dot} />
                <View style={styles.dot} />
                <View style={styles.dot} />
              </View>
            </TouchableOpacity>
          </View>
        </Animated.View>
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