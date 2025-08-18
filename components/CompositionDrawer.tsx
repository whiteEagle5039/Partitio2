// components/CompositionDrawer.tsx
import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Animated, Dimensions } from 'react-native';
import { TextComponent } from '@/components/TextComponent';
import { useThemeColors } from '@/hooks/useThemeColors';
import { 
  Plus, Trash2, Edit3, ChevronUp, ChevronDown,
  X, Copy, Music, FileText, Settings2
} from 'lucide-react-native';

interface Section {
  id: string;
  name: string;
  soprano: string;
  alto: string;
  tenor: string;
  bass: string;
}

interface CompositionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  composition: {
    title: string;
    tempo: string;
    key: string;
    sections: Section[];
  };
  onCompositionChange: (composition: any) => void;
  onSectionSelect: (sectionId: string) => void;
  activeSectionId: string;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DRAWER_WIDTH = 360;

export const CompositionDrawer: React.FC<CompositionDrawerProps> = ({
  isOpen,
  onClose,
  composition,
  onCompositionChange,
  onSectionSelect,
  activeSectionId,
}) => {
  const colors = useThemeColors();
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);

  // Animation
  const slideAnim = useRef(new Animated.Value(DRAWER_WIDTH)).current; // Drawer hors écran à droite
  const overlayAnim = useRef(new Animated.Value(0)).current; // Overlay transparent

  useEffect(() => {
    if (isOpen) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }),
        Animated.timing(overlayAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: false,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: DRAWER_WIDTH,
          duration: 200,
          useNativeDriver: false,
        }),
        Animated.timing(overlayAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }),
      ]).start();
    }
  }, [isOpen]);

  const styles = StyleSheet.create({
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      zIndex: -1,
    },
    drawer: {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      width: 360,
      backgroundColor: colors.card,
      elevation: 8,
      shadowColor: '#000',
      shadowOffset: { width: -2, height: 0 },
      shadowOpacity: 0.25,
      shadowRadius: 8,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop:40,
      padding: 10,
      backgroundColor: colors.primary + '10',
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerTitle: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    closeButton: {
      padding: 8,
      borderRadius: 8,
      backgroundColor: colors.background2,
    },
    content: {
      flex: 1,
    },
    section: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    sectionTitle: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    sectionTitleText: {
      fontSize: 14,
      fontWeight: 'bold',
      color: colors.text2,
      marginLeft: 8,
      textTransform: 'uppercase',
    },
    input: {
      backgroundColor: colors.background2,
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      color: colors.text,
      marginVertical: 4,
      borderWidth: 1,
      borderColor: 'transparent',
    },
    focusedInput: {
      borderColor: colors.primary,
      backgroundColor: colors.primary + '10',
    },
    inputLabel: {
      fontSize: 12,
      fontWeight: '600',
      color: colors.text2,
      marginBottom: 4,
      marginTop: 8,
    },
    sectionsContainer: {
      flex: 1,
      paddingBottom: 80,
    },
    sectionItem: {
      backgroundColor: colors.background2,
      borderRadius: 12,
      margin: 8,
      overflow: 'hidden',
    },
    activeSectionItem: {
      // backgroundColor: colors.primary + '20',
      borderColor: colors.primary,
      borderWidth: 2,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 12,
    },
    sectionIcon: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.primary + '20',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    activeSectionIcon: {
      backgroundColor: colors.primary,
    },
    sectionContent: {
      flex: 1,
    },
    sectionName: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 2,
    },
    sectionStats: {
      fontSize: 12,
      color: colors.text2,
    },
    sectionActions: {
      flexDirection: 'row',
      gap: 4,
    },
    actionButton: {
      padding: 8,
      borderRadius: 6,
      backgroundColor: colors.background,
    },
    editingContainer: {
      padding: 12,
      backgroundColor: colors.background,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    editingInput: {
      backgroundColor: colors.card,
      borderRadius: 6,
      padding: 8,
      fontSize: 14,
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.primary,
    },
    editingActions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      gap: 8,
      marginTop: 8,
    },
    editingButton: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 6,
    },
    saveButton: {
      backgroundColor: colors.primary,
    },
    cancelButton: {
      backgroundColor: colors.background2,
    },
    addButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.primary,
      borderRadius: 12,
      padding: 16,
      margin: 16,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    addButtonText: {
      marginLeft: 8,
      fontWeight: 'bold',
      fontSize: 16,
    },
    presetButtons: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginTop: 8,
    },
    presetButton: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      backgroundColor: colors.background2,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: colors.border,
    },
    presetButtonText: {
      fontSize: 12,
      color: colors.text2,
    },
  });


  const updateCompositionField = (field: string, value: string) => {
    onCompositionChange({ ...composition, [field]: value });
  };

   const addSection = (sectionType: string = 'custom') => {
   const sectionNames: Record<'verse' | 'chorus' | 'bridge' | 'intro' | 'outro' | 'custom', string> = {
    verse: 'Couplet',
    chorus: 'Refrain',
    bridge: 'Pont',
    intro: 'Introduction',
    outro: 'Conclusion',
    custom: 'Section',
  };

const baseName = sectionNames[sectionType as keyof typeof sectionNames] || 'Section';

    const existingCount = composition.sections.filter(s => 
      s.name.startsWith(baseName)
    ).length;
    
    const newSection: Section = {
      id: Date.now().toString(),
      name: `${baseName} ${existingCount + 1}`,
      soprano: '',
      alto: '',
      tenor: '',
      bass: '',
    };

    onCompositionChange({
      ...composition,
      sections: [...composition.sections, newSection],
    });

    // Auto-sélectionner la nouvelle section
    onSectionSelect(newSection.id);
  };

  const getSectionStats = (section: Section) => {
    const totalNotes = (section.soprano + section.alto + section.tenor + section.bass)
      .replace(/[^a-zA-ZÀ-ÿ]/g, '').length;
    const measures = Math.max(
      (section.soprano.match(/\|/g) || []).length,
      (section.alto.match(/\|/g) || []).length,
      (section.tenor.match(/\|/g) || []).length,
      (section.bass.match(/\|/g) || []).length
    );
    return `${totalNotes} notes • ${measures} mesures`;
  };

   const moveSectionUp = (index: number) => {
    if (index > 0) {
      const newSections = [...composition.sections];
      [newSections[index - 1], newSections[index]] = [newSections[index], newSections[index - 1]];
      onCompositionChange({
        ...composition,
        sections: newSections,
      });
    }
  };
  const moveSectionDown = (index: number) => {
    if (index < composition.sections.length - 1) {
      const newSections = [...composition.sections];
      [newSections[index], newSections[index + 1]] = [newSections[index + 1], newSections[index]];
      onCompositionChange({
        ...composition,
        sections: newSections,
      });
    }
  };

   const deleteSection = (sectionId: string) => {
      const section = composition.sections.find(s => s.id === sectionId);
      Alert.alert(
        'Supprimer la section',
        `Êtes-vous sûr de vouloir supprimer "${section?.name}" ?`,
        [
          { text: 'Annuler', style: 'cancel' },
          {
            text: 'Supprimer',
            style: 'destructive',
            onPress: () => {
              const newSections = composition.sections.filter(s => s.id !== sectionId);
              onCompositionChange({
                ...composition,
                sections: newSections,
              });
              
              // Si c'était la section active, sélectionner une autre
              if (activeSectionId === sectionId && newSections.length > 0) {
                onSectionSelect(newSections[0].id);
              }
            },
          },
        ]
      );
    };

  const duplicateSection = (sectionId: string) => {
    const sectionToDuplicate = composition.sections.find(s => s.id === sectionId);
    if (!sectionToDuplicate) return;

    const newSection: Section = {
      ...sectionToDuplicate,
      id: Date.now().toString(),
      name: `${sectionToDuplicate.name} (copie)`,
    };

    onCompositionChange({
      ...composition,
      sections: [...composition.sections, newSection],
    });
  };
   const updateSectionName = (sectionId: string, name: string) => {
    onCompositionChange({
      ...composition,
      sections: composition.sections.map(section =>
        section.id === sectionId ? { ...section, name } : section
      ),
    });
  };


  const tempoPresets = ['2/4', '3/4', '4/4', '6/8', '9/8', '12/8'];
  const keyPresets = ['Do ', 'Ré ', 'Mi ', 'Fa ', 'Sol ', 'La ', 'Si ', 'Do #', 'Ré #', 'Fa #', 'Sol #', 'La #' , 'Re b', 'Mi b', 'Sol b', 'La b', 'Ti b'];

  return (
    <>
      {/* Overlay animé */}
      <Animated.View
        pointerEvents={isOpen ? 'auto' : 'none'} // bloque le clic seulement si ouvert
        style={[
          styles.overlay,
          { opacity: overlayAnim },
        ]}
      >
        <TouchableOpacity style={{ flex: 1 }} onPress={onClose} />
      </Animated.View>

      {/* Drawer animé */}
      <Animated.View
        style={[
          styles.drawer,
          { transform: [{ translateX: slideAnim }] },
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Settings2 size={20} color={colors.primary} />
            <TextComponent variante="subtitle2" style={{ marginLeft: 8 }}>
              Configuration
            </TextComponent>
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={20} color={colors.icon} />
          </TouchableOpacity>
        </View>

        {/* Contenu */}
        <ScrollView>
          {/* Infos générales */}
          <View style={styles.section}>
            <View style={styles.sectionTitle}>
              <FileText size={16} color={colors.primary} />
              <TextComponent style={styles.sectionTitleText}>
                Informations générales
              </TextComponent>
            </View>
            <TextComponent style={styles.inputLabel}>Titre</TextComponent>
            <TextInput
              style={styles.input}
              placeholder="Titre de la composition"
              placeholderTextColor={colors.text2}
              value={composition.title}
              onChangeText={(text) => updateCompositionField('title', text)}
            />
            <TextComponent style={styles.inputLabel}>Temps</TextComponent>
            <TextInput
              style={styles.input}
              placeholder="4/4"
              placeholderTextColor={colors.text2}
              value={composition.tempo}
              onChangeText={(text) => updateCompositionField('tempo', text)}
            />
            <View style={styles.presetButtons}>
              {tempoPresets.map((preset) => (
                <TouchableOpacity
                  key={preset}
                  style={styles.presetButton}
                  onPress={() => updateCompositionField('tempo', preset)}
                >
                  <TextComponent style={styles.presetButtonText}>{preset}</TextComponent>
                </TouchableOpacity>
              ))}
            </View>
            <TextComponent style={styles.inputLabel}>Gamme</TextComponent>
            <TextInput
              style={styles.input}
              placeholder="Do M"
              placeholderTextColor={colors.text2}
              value={composition.key}
              onChangeText={(text) => updateCompositionField('key', text)}
            />
            <View style={styles.presetButtons}>
              {keyPresets.map((preset) => (
                <TouchableOpacity
                  key={preset}
                  style={styles.presetButton}
                  onPress={() => updateCompositionField('key', preset)}
                >
                  <TextComponent style={styles.presetButtonText}>{preset}</TextComponent>
                </TouchableOpacity>
              ))}
            </View>
          </View>

            {/* Gestion des sections */}
          <View style={styles.section}>
            <View style={styles.sectionTitle}>
              <Music size={16} color={colors.primary} />
              <TextComponent style={styles.sectionTitleText}>
                Sections ({composition.sections.length})
              </TextComponent>
            </View>
          </View>

          <View style={styles.sectionsContainer}>
            {composition.sections.map((section, index) => (
              <View
                key={section.id}
                style={[
                  styles.sectionItem,
                  activeSectionId === section.id && styles.activeSectionItem,
                ]}
              >
                <TouchableOpacity
                  style={styles.sectionHeader}
                  onPress={() => onSectionSelect(section.id)}
                >
                  <View style={[
                    styles.sectionIcon,
                    activeSectionId === section.id && styles.activeSectionIcon,
                  ]}>
                    <Music size={16} color={
                      activeSectionId === section.id ? colors.primaryForeground : colors.primary
                    } />
                  </View>
                  
                  <View style={styles.sectionContent}>
                    <TextComponent style={styles.sectionName}>
                      {section.name}
                    </TextComponent>
                    <TextComponent style={styles.sectionStats}>
                      {getSectionStats(section)}
                    </TextComponent>
                  </View>
                  
                  <View style={styles.sectionActions}>
                    {index > 0 && (
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => moveSectionUp(index)}
                      >
                        <ChevronUp size={16} color={colors.icon} />
                      </TouchableOpacity>
                    )}
                    
                    {index < composition.sections.length - 1 && (
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => moveSectionDown(index)}
                      >
                        <ChevronDown size={16} color={colors.icon} />
                      </TouchableOpacity>
                    )}
                    
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => duplicateSection(section.id)}
                    >
                      <Copy size={16} color={colors.icon} />
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => setEditingSectionId(section.id)}
                    >
                      <Edit3 size={16} color={colors.icon} />
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => deleteSection(section.id)}
                    >
                      <Trash2 size={16} color={colors.destructive} />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>

                {editingSectionId === section.id && (
                  <View style={styles.editingContainer}>
                    <TextInput
                      style={styles.editingInput}
                      value={section.name}
                      onChangeText={(text) => updateSectionName(section.id, text)}
                      placeholder="Nom de la section"
                      autoFocus
                    />
                    <View style={styles.editingActions}>
                      <TouchableOpacity
                        style={[styles.editingButton, styles.cancelButton]}
                        onPress={() => setEditingSectionId(null)}
                      >
                        <TextComponent style={{ color: colors.text2 }}>
                          Annuler
                        </TextComponent>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.editingButton, styles.saveButton]}
                        onPress={() => setEditingSectionId(null)}
                      >
                        <TextComponent style={{ color: colors.primaryForeground }}>
                          OK
                        </TextComponent>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            ))}

            {/* Boutons d'ajout rapide */}
            <View style={{ marginHorizontal: 16, marginTop: 8 }}>
              <TextComponent style={styles.inputLabel}>Ajouter une section</TextComponent>
              <View style={styles.presetButtons}>
                {[
                  { key: 'verse', label: 'Couplet' },
                  { key: 'chorus', label: 'Refrain' },
                  { key: 'bridge', label: 'Pont' },
                  { key: 'intro', label: 'Intro' },
                  { key: 'outro', label: 'Outro' },
                ].map((type) => (
                  <TouchableOpacity
                    key={type.key}
                    style={styles.presetButton}
                    onPress={() => addSection(type.key)}
                  >
                    <TextComponent style={styles.presetButtonText}>{type.label}</TextComponent>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TouchableOpacity style={styles.addButton} onPress={() => addSection()}>
              <Plus size={20} color={colors.primaryForeground} />
              <TextComponent
                style={styles.addButtonText}
                color={colors.primaryForeground}
              >
                Ajouter une section
              </TextComponent>
            </TouchableOpacity>
          </View>
          
        </ScrollView>
      </Animated.View>
    </>

  );
};
