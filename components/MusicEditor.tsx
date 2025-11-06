// components/MusicEditor.tsx
import { TextComponent } from '@/components/uxComponents/TextComponent';
import { useThemeColors } from '@/hooks/useThemeColors';
import { ChevronDown, ChevronUp, Edit3, Plus } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Dimensions, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Section {
  id: string;
  name: string;
  soprano: string;
  alto: string;
  tenor: string;
  bass: string;
  lyrics?: string;
}

interface MusicEditorProps {
  composition: {
    title: string;
    tempo: string;
    key: string;
    sections: Section[];
  };
  onCompositionChange: (composition: any) => void;
  activeVoice: 'S' | 'A' | 'T' | 'B';
  activeSectionId: string;
  onVoiceChange: (voice: 'S' | 'A' | 'T' | 'B') => void;
  onSectionChange: (sectionId: string) => void;
  // Cursor selection for the active staff (optional)
  cursorSelection?: { start: number; end: number } | null;
  // Called when a staff TextInput selection changes
  onSelectionChange?: (voice: 'S' | 'A' | 'T' | 'B', sectionId: string, selection: { start: number; end: number }) => void;
  onStaffFocus?: (voice: 'S' | 'A' | 'T' | 'B', sectionId: string) => void;
}

const { width } = Dimensions.get('window');

export const MusicEditor: React.FC<MusicEditorProps> = ({
  composition,
  onCompositionChange,
  activeVoice,
  activeSectionId,
  onVoiceChange,
  onSectionChange,
  cursorSelection = null,
  onSelectionChange,
  onStaffFocus,
}) => {
  const colors = useThemeColors();
  const scrollViewRef = useRef<ScrollView>(null);
  const inputRefs = useRef<{ [key: string]: TextInput | null }>({});
  
  // États pour la gestion des sections
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set());
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  // Forcer la mise à jour des TextInputs quand la composition change
  useEffect(() => {
    const activeSection = composition.sections.find(s => s.id === activeSectionId);
    if (!activeSection) return;

    const voices = ['S', 'A', 'T', 'B'] as const;
    voices.forEach((voice) => {
      const inputKey = `${activeSectionId}-${voice}`;
      const ref = inputRefs.current[inputKey];
      if (ref) {
        const voiceKey = voice.toLowerCase() as 'soprano' | 'alto' | 'tenor' | 'bass';
        const content = activeSection[voiceKey] || '';
        ref.setNativeProps({ text: content });
      }
    });
  }, [composition, activeSectionId]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    sectionsContainer: {
      flex: 1,
      paddingTop: 0,
    },
    sectionContainer: {
      marginVertical: 8,
      position: 'relative',
    },
    sectionHeader: {
      backgroundColor: colors.card,
      marginHorizontal: 8,
      borderRadius: 12,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.card2,
      elevation: 1,
      shadowColor: '#000',
      shadowOffset: { width: 1, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    activeSectionHeader: {
      borderWidth: 1,
      borderColor: colors.primary,
    },
    sectionHeaderLeft: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
    },
    sectionNameContainer: {
      flex: 1,
      marginRight: 8,
    },
    sectionNameInput: {
      fontSize: 15,
      fontWeight: 'bold',
      color: colors.text,
      backgroundColor: colors.background2,
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderWidth: 1,
      borderColor: colors.primary,
    },
    sectionName: {
      fontSize: 15,
      fontWeight: 'bold',
      color: colors.text,
      paddingHorizontal: 4,
      paddingVertical: 8,
    },
    sectionActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    actionButton: {
      padding: 8,
      borderRadius: 8,
      backgroundColor: colors.background2,
    },
    collapseButton: {
      padding: 8,
      borderRadius: 8,
      backgroundColor: colors.primary + '15',
    },
    addSectionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.primary + '15',
      marginHorizontal: 8,
      marginVertical: 4,
      borderRadius: 12,
      padding: 16,
      borderWidth: 2,
      borderColor: colors.primary + '30',
      borderStyle: 'dashed',
    },
    addSectionText: {
      marginLeft: 8,
      fontSize: 14,
      fontWeight: '600',
      color: colors.primary,
    },
    lyricsContainer: {
      width: width,
      padding: 12,
      justifyContent: 'flex-start',
      backgroundColor: colors.background,
    },
    lyricsInput: {
      width: '100%',
      minHeight: 200,
      maxHeight: 600,
      padding: 12,
      borderRadius: 12,
      backgroundColor: colors.card,
      color: colors.text,
      fontSize: 14,
      fontWeight: '400',
      fontFamily: 'Tiempos-Regular',
      lineHeight: 20,
      textAlignVertical: 'top',
    },
    staffContainer: {
      backgroundColor: colors.card,
      borderRadius: 12,
      margin: 8,
      marginTop: 4,
      padding: 10,
      minHeight: 200,
      maxWidth: '96%',
    },
    collapsedStaffContainer: {
      minHeight: 0,
      padding: 0,
      margin: 0,
      backgroundColor: 'transparent',
    },
    activeStaffContainer: {
      borderWidth: 1,
      borderColor: colors.primary + '70',
    },
    staffSystem: {
      position: 'relative',
    },
    staffLine: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 1,
      minHeight: 48,
      position: 'relative',
    },
    voiceLabel: {
      width: 38,
      height: 38,
      borderRadius: 22,
      backgroundColor: colors.primary + '15',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
      borderWidth: 2,
      borderColor: 'transparent',
    },
    activeLabelContainer: {
      backgroundColor: colors.primary ,
      borderColor: colors.primary,
    },
    voiceLabelText: {
      fontWeight: 'bold',
      fontSize: 15,
      color: colors.cardForeground,
    },
    activeLabelText: {
      color: colors.primaryForeground,
    },
    staffContent: {
      flex: 1,
      position: 'relative',
    },
    staffInput: {
      fontSize: 16,
      color: colors.text,
      fontFamily: 'monospace',
      minHeight: 48,
      paddingVertical: 10,
      paddingHorizontal: 5,
      backgroundColor: colors.background2,
      borderBottomWidth: 2,
      borderColor: colors.muted,
    },
    activeStaff: {
      borderColor: colors.blueSingle
    },
    measureOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      pointerEvents: 'none',
    },
    measureLine: {
      position: 'absolute',
      top: 2,
      bottom: 2,
      width: 2,
      backgroundColor: colors.border,
      opacity: 0.6,
    },
    strongMeasureLine: {
      backgroundColor: colors.text,
      opacity: 0.8,
      width: 3,
    },
    systemMeasureLine: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      width: 2,
      backgroundColor: colors.primary,
      opacity: 0.3,
    },
    emptyMessage: {
      textAlign: 'center',
      fontStyle: 'italic',
      color: colors.text2,
      marginVertical: 40,
      fontSize: 16,
    },
    // Minimal sheet title area (not a floating banner)
    sheetHeader: {
      paddingVertical: 8,
      paddingHorizontal: 12,
      backgroundColor: 'transparent',
      marginBottom: 4,
    },
    sheetTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 2,
      textAlign: 'left',
    },
    sheetMetaRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    sheetMetaText: {
      fontSize: 14,
      color: colors.text2,
    },
  });

  // Fonction pour ajouter une nouvelle section
  const addNewSection = () => {
    const newSectionNumber = composition.sections.length + 1;
    const newSection: Section = {
      id: Date.now().toString(),
      name: `Section ${newSectionNumber}`,
      soprano: '',
      alto: '',
      tenor: '',
      bass: '',
      lyrics: '',
    };

    const updatedComposition = {
      ...composition,
      sections: [...composition.sections, newSection],
    };

    onCompositionChange(updatedComposition);
    onSectionChange(newSection.id);
  };

  // Fonction pour basculer l'état d'effondrement d'une section
  const toggleSectionCollapse = (sectionId: string) => {
    const newCollapsed = new Set(collapsedSections);
    if (newCollapsed.has(sectionId)) {
      newCollapsed.delete(sectionId);
    } else {
      newCollapsed.add(sectionId);
    }
    setCollapsedSections(newCollapsed);
  };

  // Fonction pour commencer l'édition du nom d'une section
  const startEditingSection = (sectionId: string, currentName: string) => {
    setEditingSection(sectionId);
    setEditingName(currentName);
  };

  // Fonction pour sauvegarder le nouveau nom de section
  const saveEditingSection = () => {
    if (editingSection && editingName.trim()) {
      const updatedSections = composition.sections.map(section => 
        section.id === editingSection 
          ? { ...section, name: editingName.trim() }
          : section
      );
      
      onCompositionChange({
        ...composition,
        sections: updatedSections,
      });
    }
    
    setEditingSection(null);
    setEditingName('');
  };

  // Fonction pour annuler l'édition
  const cancelEditingSection = () => {
    setEditingSection(null);
    setEditingName('');
  };

  // Fonction pour supprimer une section
  const deleteSection = (sectionId: string) => {
    Alert.alert(
      'Supprimer la section',
      'Êtes-vous sûr de vouloir supprimer cette section ? Cette action ne peut pas être annulée.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => {
            const updatedSections = composition.sections.filter(s => s.id !== sectionId);
            onCompositionChange({
              ...composition,
              sections: updatedSections,
            });
            
            // Si c'était la section active, passer à la première disponible
            if (activeSectionId === sectionId && updatedSections.length > 0) {
              onSectionChange(updatedSections[0].id);
            }
          },
        },
      ]
    );
  };

  const updateSection = (sectionId: string, voice: string, content: string) => {
    const updatedSections = composition.sections.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          [voice.toLowerCase()]: content,
        };
      }
      return section;
    });

    onCompositionChange({
      ...composition,
      sections: updatedSections,
    });
  };

  // Rendu des lignes de mesure pour un système de portées
  const renderSystemMeasureLines = (maxLength: number) => {
    const lines = [];
    let position = 12;
    let measureCount = 0;
    
    for (let i = 0; i < maxLength; i++) {
      const hasBarLine = composition.sections
        .find(s => s.id === activeSectionId)
        ?.soprano.charAt(i) === '|' ||
        composition.sections
          .find(s => s.id === activeSectionId)
          ?.alto.charAt(i) === '|' ||
        composition.sections
          .find(s => s.id === activeSectionId)
          ?.tenor.charAt(i) === '|' ||
        composition.sections
          .find(s => s.id === activeSectionId)
          ?.bass.charAt(i) === '|';

      if (hasBarLine) {
        measureCount++;
        lines.push(
          <View
            key={`measure-${i}`}
            style={[
              styles.systemMeasureLine,
              { left: position },
              measureCount % 4 === 0 && styles.strongMeasureLine
            ]}
          />
        );
      }
      position += 10;
    }
    
    return lines;
  };

  // Rendu des lignes de mesure pour une voix individuelle
  const renderMeasureLines = (text: string) => {
    const lines = [];
    let position = 12;
    let measureCount = 0;
    
    for (let i = 0; i < text.length; i++) {
      if (text[i] === '|') {
        measureCount++;
        lines.push(
          <View
            key={`line-${i}`}
            style={[
              styles.measureLine,
              { left: position },
              measureCount % 4 === 0 && styles.strongMeasureLine
            ]}
          />
        );
      }
      position += 10;
    }
    
    return lines;
  };

  // Composant séparé pour le panneau de paroles
  const renderLyrics = (section: Section) => {
    return (
      <View style={styles.lyricsContainer}>
        <TextComponent variante="subtitle2" style={{ marginBottom: 8 }}>
          Paroles
        </TextComponent>
        <TextInput
          style={styles.lyricsInput}
          value={section.lyrics ?? ''}
          onChangeText={(text) => updateSection(section.id, 'lyrics', text)}
          placeholder="Écrivez ici les paroles associées à cette section..."
          placeholderTextColor={colors.primary + '50'}
          multiline
          textAlignVertical="top"
        />
      </View>
    );
  };

  const renderStaffLines = (section: Section) => {
    const voices = [
      { key: 'S', label: 'S', content: section.soprano, name: 'Soprano' },
      { key: 'A', label: 'A', content: section.alto, name: 'Alto' },
      { key: 'T', label: 'T', content: section.tenor, name: 'Ténor' },
      { key: 'B', label: 'B', content: section.bass, name: 'Basse' },
    ];

    const maxLength = Math.max(
      section.soprano.length,
      section.alto.length,
      section.tenor.length,
      section.bass.length
    );

    // Retourne uniquement le système de portées (sans ScrollView horizontal ni paroles)
    return (
      <View style={styles.staffSystem}>
        <View style={styles.measureOverlay}>
          {activeSectionId === section.id && renderSystemMeasureLines(maxLength)}
        </View>

        {voices.map((voice) => {
          const isActive = activeVoice === voice.key && activeSectionId === section.id;
          const inputKey = `${section.id}-${voice.key}`;

          return (
            <View key={voice.key} style={styles.staffLine}>
              <TouchableOpacity
                style={[
                  styles.voiceLabel,
                  isActive && styles.activeLabelContainer,
                ]}
                onPress={() => {
                  onVoiceChange(voice.key as 'S' | 'A' | 'T' | 'B');
                  onSectionChange(section.id);
                  onStaffFocus?.(voice.key as 'S' | 'A' | 'T' | 'B', section.id);
                  // Focus programmatiquement le bon input
                  setTimeout(() => {
                    inputRefs.current[inputKey]?.focus();
                  }, 100);
                }}
              >
                <TextComponent style={[
                  styles.voiceLabelText,
                  isActive && styles.activeLabelText,
                ]}>
                  {voice.label}
                </TextComponent>
              </TouchableOpacity>

              <View style={styles.staffContent}>
                <View style={styles.measureOverlay}>
                  {renderMeasureLines(voice.content)}
                </View>

                <TextInput
                  key={inputKey}
                  ref={(ref) => { inputRefs.current[inputKey] = ref; }}
                  style={[
                    styles.staffInput,
                    isActive && styles.activeStaff,
                  ]}
                  defaultValue={voice.content}
                  onChangeText={(text) => {
                    updateSection(section.id, voice.key, text);
                  }}
                  onFocus={() => {
                    onVoiceChange(voice.key as 'S' | 'A' | 'T' | 'B');
                    onSectionChange(section.id);
                    onStaffFocus?.(voice.key as 'S' | 'A' | 'T' | 'B', section.id);
                  }}
                  onSelectionChange={(e) => {
                    const sel = e.nativeEvent.selection;
                    onSelectionChange?.(voice.key as 'S' | 'A' | 'T' | 'B', section.id, { start: sel.start, end: sel.end });
                  }}
                   placeholder={`${voice.name}`}
                   placeholderTextColor={colors.text2 +'50'}
                   multiline={false}
                   scrollEnabled={false}
                   showSoftInputOnFocus={false}
                   editable={true}
                 />
              </View>
            </View>
          );
        })}
      </View>
    );
  };

  if (composition.sections.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.container}>
          <View style={styles.sheetHeader}>
            <TextComponent variante="subtitle2" style={styles.sheetTitle}>
              {composition.title || 'Sans titre'}
          </TextComponent>
          <View style={styles.sheetMetaRow}>
            <TextComponent variante="body4" style={styles.sheetMetaText}>{composition.key || '-'}</TextComponent>
            <TextComponent variante="body4" style={[styles.sheetMetaText, { marginLeft: 12 }]}>{composition.tempo || '-'}</TextComponent>
          </View>
        </View>

        <TextComponent variante="body2" color={colors.text2} style={styles.emptyMessage}>
          Votre inspiration commence ici...{'\n'}
          Commencez par ajouter une section.
        </TextComponent>
        <TouchableOpacity style={styles.addSectionButton} onPress={addNewSection}>
          <Plus size={24} color={colors.primary} />
          <TextComponent style={styles.addSectionText}>
            Ajouter une section
          </TextComponent>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        ref={scrollViewRef}
        style={styles.sectionsContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Sheet title written on the page (not a banner) */}
        <View style={styles.sheetHeader}>
          <TextComponent variante="subtitle2" style={styles.sheetTitle}>
            {composition.title || 'Sans titre'}
          </TextComponent>
          <View style={styles.sheetMetaRow}>
            <TextComponent variante="body4" style={styles.sheetMetaText}>{composition.key || '-'}</TextComponent>
            <TextComponent variante="body4" style={[styles.sheetMetaText, { marginLeft: 12 }]}>{composition.tempo || '-'}</TextComponent>
          </View>
        </View>

        {composition.sections.map((section, index) => {
          const isCollapsed = collapsedSections.has(section.id);
          const isActive = activeSectionId === section.id;
          const isEditing = editingSection === section.id;

          return (
            <View key={section.id} style={styles.sectionContainer}>
              {/* En-tête de section avec contrôles */}
              <View style={[
                styles.sectionHeader,
                isActive && styles.activeSectionHeader
              ]}>
                <View style={styles.sectionHeaderLeft}>
                  <View style={styles.sectionNameContainer}>
                    {isEditing ? (
                      <TextInput
                        style={styles.sectionNameInput}
                        value={editingName}
                        onChangeText={setEditingName}
                        onSubmitEditing={saveEditingSection}
                        onBlur={saveEditingSection}
                        autoFocus
                        selectTextOnFocus
                      />
                    ) : (
                      <TouchableOpacity 
                        onPress={() => startEditingSection(section.id, section.name)}
                      >
                        <TextComponent style={styles.sectionName}>
                          {section.name}
                        </TextComponent>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>

                <View style={styles.sectionActions}>
                  {isEditing ? (
                    <TouchableOpacity 
                      style={styles.actionButton}
                      onPress={cancelEditingSection}
                    >
                      <TextComponent variante="body4" color={colors.text2}>
                        Annuler
                      </TextComponent>
                    </TouchableOpacity>
                  ) : (
                    <>
                      <TouchableOpacity 
                        style={styles.actionButton}
                        onPress={() => startEditingSection(section.id, section.name)}
                      >
                        <Edit3 size={16} color={colors.text2} />
                      </TouchableOpacity>
                      
                      {composition.sections.length > 1 && (
                        <TouchableOpacity 
                          style={styles.actionButton}
                          onPress={() => deleteSection(section.id)}
                        >
                          <TextComponent variante="body4" color={colors.destructive}>
                            Suppr
                          </TextComponent>
                        </TouchableOpacity>
                      )}
                    </>
                  )}

                  <TouchableOpacity 
                    style={styles.collapseButton}
                    onPress={() => toggleSectionCollapse(section.id)}
                  >
                    {isCollapsed ? (
                      <ChevronDown size={20} color={colors.primary} />
                    ) : (
                      <ChevronUp size={20} color={colors.primary} />
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              {/* Contenu de la section (portées + paroles déplaçables horizontalement) */}
              {!isCollapsed && (
                <ScrollView
                  horizontal
                  pagingEnabled={false}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ width: width * 2 }}
                >
                  <View style={[
                    styles.staffContainer,
                    isActive && styles.activeStaffContainer,
                    { width }
                  ]}>
                    {renderStaffLines(section)}
                  </View>

                  {renderLyrics(section)}
                </ScrollView>
              )}

              {/* Bouton d'ajout de section après chaque section */}
              {index === composition.sections.length - 1 && (
                <TouchableOpacity 
                  style={styles.addSectionButton} 
                  onPress={addNewSection}
                >
                  <Plus size={24} color={colors.primary} />
                  <TextComponent style={styles.addSectionText}>
                    Ajouter une section
                  </TextComponent>
                </TouchableOpacity>
              )}
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
};