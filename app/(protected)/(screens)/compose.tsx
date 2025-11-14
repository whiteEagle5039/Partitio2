// Exemple d'intégration dans compose.tsx
import { CompositionDrawer } from '@/components/musicComponents/CompositionDrawer';
import { MusicEditor } from '@/components/musicComponents/MusicEditor';
import { MusicKeyboard } from '@/components/musicComponents/Musickeyboard';
import { SaveCompositionModal } from '@/components/musicComponents/SaveCompositionModal';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useAppStore } from '@/stores/appStore';
import { useCompositionStorage } from '@/utils/CompositionStorage';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Save, RotateCcw } from 'lucide-react-native';
import React, { useState, useRef, useEffect } from 'react';
import { Animated, StyleSheet, TouchableOpacity, View, PanResponder, Alert } from 'react-native';
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
  const params = useLocalSearchParams();
  const { addComposition } = useAppStore();
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
  
  // Hook de stockage
  const {
    saveComposition,
    loadComposition,
    exportComposition,
  } = useCompositionStorage();

  // ID de la composition (si on édite une existante)
  const [compositionId, setCompositionId] = useState<string | undefined>(
    params.id ? String(params.id) : undefined
  );
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // État principal de la composition
  const [composition, setComposition] = useState<Composition>({
    title: 'Sans titre - John .D #1',
    tempo: '4/4',
    key: 'Do',
    sections: [],
  });

  // État de l'interface
  const [activeVoice, setActiveVoice] = useState<'S' | 'A' | 'T' | 'B'>('S');
  const [activeSectionId, setActiveSectionId] = useState('1');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [drawerAnimation] = useState(new Animated.Value(0));
  const [cursorSelection, setCursorSelection] = useState<{ start: number; end: number } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  // État pour gérer le drag vs click
  const [isDragging, setIsDragging] = useState(false);
  const dragStartTime = useRef(0);
  const startPosition = useRef({ x: 0, y: 0 });

  // Pour le bouton draggable
  const pan = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  
  // Charger la composition si on édite une existante
  useEffect(() => {
    if (compositionId) {
      loadExistingComposition();
    }
  }, [compositionId]);

  const loadExistingComposition = async () => {
    if (!compositionId) return;
    
    try {
      const loaded = await loadComposition(compositionId);
      if (loaded) {
        setComposition(loaded);
        if (loaded.sections.length > 0) {
          setActiveSectionId(loaded.sections[0].id);
        }
        // console.log('✅ Composition chargée:', compositionId);
      }
    } catch (error) {
      console.error('❌ Erreur lors du chargement:', error);
      Alert.alert('Erreur', 'Impossible de charger la composition');
    }
  };

  // Détecter les changements non sauvegardés
  useEffect(() => {
    setHasUnsavedChanges(true);
  }, [composition]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
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
        
        // Dimensions de l'écran et marges
        const buttonWidth = 50;
        const margin = 20;
        const minY = -screenHeight + 200; // Éviter le haut de l'écran
        const maxY = 100; // Éviter le bas de l'écran
        
        // Contraindre Y
        const constrainedY = Math.max(minY, Math.min(maxY, newY));
        
        // Déterminer le côté le plus proche (gauche ou droite)
        // Position actuelle du bouton sur l'écran
        const buttonCenterX = screenWidth - margin - buttonWidth / 2 + newX;
        const screenCenter = screenWidth / 2;
        
        // Si le bouton est plus proche du bord droit
        let targetX;
        if (buttonCenterX > screenCenter) {
          // Coller à droite (position initiale)
          targetX = 0;
        } else {
          // Coller à gauche
          targetX = -(screenWidth - buttonWidth - margin * 2);
        }
        
        pan.flattenOffset();
        
        // Animation vers le bord
        Animated.spring(pan, {
          toValue: { x: targetX, y: constrainedY },
          useNativeDriver: false,
          tension: 100,
          friction: 10,
        }).start();
        
        setTimeout(() => setIsDragging(false), 150);
      }
    })
  ).current;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
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
    saveButtonActive: {
      backgroundColor: colors.primary + '30',
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

  // Fix pour handleInsertNote dans compose.tsx

  const handleInsertNote = (note: string) => {
    // console.log('🎵 handleInsertNote appelé avec:', note);
    
    const currentSection = composition.sections.find(s => s.id === activeSectionId);
    if (!currentSection) {
      // console.log('❌ Section non trouvée !');
      return;
    }

    const voiceMapping = {
      'S': 'soprano',
      'A': 'alto',
      'T': 'tenor',
      'B': 'bass'
    } as const;
    
    const voiceKey = voiceMapping[activeVoice] as keyof Omit<Section, 'id' | 'name'>;
    const currentContent = currentSection[voiceKey] || '';
    
    // console.log('📝 Voix active:', activeVoice, '-> Clé:', voiceKey);
    // console.log('📝 Contenu actuel:', currentContent);
    
    const sel = cursorSelection || { start: currentContent.length, end: currentContent.length };
    
    const before = currentContent.slice(0, sel.start);
    const after = currentContent.slice(sel.end);
    
    const insertText = note === ' ' ? ' ' : (note + ' ');
    const newContent = before + insertText + after;

    // console.log('📝 Nouveau contenu:', newContent);
    
    const newPos = before.length + insertText.length;
    
    // ✅ 1. Mettre à jour le contenu
    updateSectionContent(activeSectionId, voiceKey, newContent);
    
    // ✅ 2. Utiliser un double requestAnimationFrame pour garantir que le render est terminé
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        console.log('📍 Mise à jour curseur position:', newPos);
        setCursorSelection({ start: newPos, end: newPos });
      });
    });
  };

  const handleDeleteLast = () => {
    const currentSection = composition.sections.find(s => s.id === activeSectionId);
    if (!currentSection) return;

    const voiceMapping = {
      'S': 'soprano',
      'A': 'alto',
      'T': 'tenor',
      'B': 'bass'
    } as const;
    
    const voiceKey = voiceMapping[activeVoice] as keyof Omit<Section, 'id' | 'name'>;
    const currentContent = currentSection[voiceKey] || '';
    const sel = cursorSelection || { start: currentContent.length, end: currentContent.length };
    
    let newContent = currentContent;
    let newPos = sel.start;
    
    if (sel.start !== sel.end) {
      const before = currentContent.slice(0, sel.start);
      const after = currentContent.slice(sel.end);
      newContent = before + after;
      newPos = sel.start;
    }
    else if (sel.start > 0) {
      const before = currentContent.slice(0, sel.start - 1);
      const after = currentContent.slice(sel.end);
      newContent = before + after;
      newPos = sel.start - 1;
    }
    
    updateSectionContent(activeSectionId, voiceKey, newContent);
    
    // ✅ Double RAF
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setCursorSelection({ start: newPos, end: newPos });
      });
    });
  };

  // ✅ Améliorer updateSectionContent pour éviter les re-renders inutiles
  const updateSectionContent = (
    sectionId: string,
    voice: keyof Omit<Section, 'id' | 'name'>,
    content: string
  ) => {
    // console.log('📝 updateSectionContent appelé:', { sectionId, voice, content });
    
    setComposition(prev => {
      // ✅ Vérifier si le contenu a vraiment changé
      const currentSection = prev.sections.find(s => s.id === sectionId);
      if (currentSection && currentSection[voice] === content) {
        // console.log('⏭️ Pas de changement, skip update');
        return prev; // Pas de changement, éviter le re-render
      }
      
      const updated = {
        ...prev,
        sections: prev.sections.map(section =>
          section.id === sectionId
            ? { ...section, [voice]: content }
            : section
        )
      };
      
      // console.log('📝 État mis à jour:', updated.sections.find(s => s.id === sectionId)?.[voice]);
      return updated;
    });
  };
  const handleStaffFocus = (voice: 'S' | 'A' | 'T' | 'B', sectionId: string) => {
    setActiveVoice(voice);
    setActiveSectionId(sectionId);
    setShowKeyboard(true);
    setCursorSelection(null);
  };

  const handleSelectionChange = (voice: 'S' | 'A' | 'T' | 'B', sectionId: string, selection: { start: number; end: number }) => {
    setCursorSelection(selection);
  };

  const toggleDrawer = () => {
    const toValue = isDrawerOpen ? 0 : 1;
    setIsDrawerOpen(!isDrawerOpen);
    
    Animated.timing(drawerAnimation, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  // Fonction principale de sauvegarde - vérifie s'il y a des sections
  const handleSave = async () => {
    // Vérifier qu'il y a au moins une section
    if (composition.sections.length === 0) {
      Alert.alert(
        'Composition vide',
        'Vous devez ajouter au moins une section avant de sauvegarder.',
        [{ text: 'OK' }]
      );
      return;
    }

    // Ouvrir le modal de sauvegarde
    setShowSaveModal(true);
  };

  // Fonction appelée par le modal après avoir récupéré le nom du compositeur
  const handleSaveWithComposer = async (composerName: string) => {
    if (isSaving) return;
    
    setIsSaving(true);
    
    try {
      // console.log('💾 Sauvegarde en cours...');
      // console.log('📝 Composition ID actuel:', compositionId);
      console.log('📊 Données:', {
        title: composition.title,
        sections: composition.sections.length,
        composer: composerName,
      });

      const saved = await saveComposition(composition, composerName, compositionId);
      
      // console.log('✅ Composition sauvegardée avec ID:', saved.id);
      
      if (!compositionId) {
        setCompositionId(saved.id);
        // console.log('🆕 Nouvel ID défini:', saved.id);
      }
      
      setHasUnsavedChanges(false);
      
      Alert.alert(
        'Succès',
        'Composition sauvegardée avec succès !',
        [
          {
            text: 'Voir dans la bibliothèque',
            onPress: () => {
              // console.log('📚 Navigation vers la bibliothèque');
              router.push('/library');
            }
          },
          {
            text: 'Continuer',
            style: 'cancel',
            onPress: () => console.log('✅ Composition sauvegardée:', saved.id)
          }
        ]
      );
    } catch (error) {
      console.error('❌ Erreur lors de la sauvegarde:', error);
      Alert.alert(
        'Erreur',
        'Impossible de sauvegarder la composition. Veuillez réessayer.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  // Fonction pour exporter la composition
  const handleExport = async () => {
    if (!compositionId) {
      Alert.alert('Info', 'Veuillez d\'abord sauvegarder la composition');
      return;
    }

    try {
      const json = await exportComposition(compositionId);
      if (json) {
        // TODO: Utiliser le module de partage pour envoyer le JSON
        console.log('Export JSON:', json);
        Alert.alert('Succès', 'Composition exportée !');
      }
    } catch (error) {
      console.error('❌ Erreur lors de l\'export:', error);
      Alert.alert('Erreur', 'Impossible d\'exporter la composition');
    }
  };

  const handleSavePress = () => {
    if (!isDragging && Date.now() - dragStartTime.current > 200) {
      handleSave();
    }
  };

  const handleDrawerPress = () => {
    if (!isDragging && Date.now() - dragStartTime.current > 200) {
      toggleDrawer();
    }
  };

  const handleCompositionChange = (newComposition: Composition) => {
    setComposition(newComposition);
    
    const activeExists = newComposition.sections.some(s => s.id === activeSectionId);
    if (!activeExists && newComposition.sections.length > 0) {
      setActiveSectionId(newComposition.sections[0].id);
    }
  };

  return (
    <View style={styles.container}>
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

      {showKeyboard && (
        <View style={styles.keyboardContainer}>
          <MusicKeyboard
            activeVoice={activeVoice}
            onVoiceChange={setActiveVoice}
            onInsertNote={handleInsertNote}
            onDeleteLast={handleDeleteLast}
            onClose={() => setShowKeyboard(false)}
            currentContent={(() => {
              const currentSection = composition.sections.find(s => s.id === activeSectionId);
              if (!currentSection) return '';
              
              // ✅ FIX: Mapper correctement la voix
              const voiceMapping = {
                'S': 'soprano',
                'A': 'alto',
                'T': 'tenor',
                'B': 'bass'
              } as const;
              
              const voiceKey = voiceMapping[activeVoice];
              return currentSection[voiceKey] || '';
            })()}
          />
        </View>
      )}

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
            <TouchableOpacity 
              onPress={handleSavePress}
              activeOpacity={0.7}
              disabled={isDragging}
            >
              <Save 
                size={22} 
                color={colors.text} 
              />
            </TouchableOpacity>
            
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

      <CompositionDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        composition={composition}
        onCompositionChange={setComposition}
        onSectionSelect={(sectionId) => {
          setActiveSectionId(sectionId);
          setIsDrawerOpen(false);
        }}
        activeSectionId={activeSectionId}
      />

      <SaveCompositionModal
        visible={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        onSave={handleSaveWithComposer}
        isNewComposition={!compositionId}
      />
    </View>
  );
}