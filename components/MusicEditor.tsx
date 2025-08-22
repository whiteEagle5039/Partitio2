// components/MusicEditor.tsx
import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, TextInput, Dimensions } from 'react-native';
import { TextComponent } from '@/components/TextComponent';
import { useThemeColors } from '@/hooks/useThemeColors';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Section {
  id: string;
  name: string;
  soprano: string;
  alto: string;
  tenor: string;
  bass: string;
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
  onStaffFocus,

}) => {
  const colors = useThemeColors();
  const scrollViewRef = useRef<ScrollView>(null);

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
    // Nouveau style pour les titres repositionnés
    sectionTitleContainer: {
      position: 'absolute',
      top: -8,
      right: 16,
      backgroundColor: colors.background + 'F0',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: colors.border,
      zIndex: 10,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
    },
    activeSectionTitleContainer: {
      backgroundColor: colors.primary + '20',
      borderColor: colors.primary,
    },
    sectionTitle: {
      fontSize: 12,
      fontWeight: 'bold',
      color: colors.primary,
    },
    sectionInfo: {
      fontSize: 10,
      color: colors.text2,
      marginTop: 1,
    },
    staffContainer: {
      backgroundColor: colors.card,
      borderRadius: 12,
      margin: 8,
      padding: 10,
      // elevation: 2,
      // shadowColor: '#000',
      // shadowOffset: { width: 0, height: 2 },
      // shadowOpacity: 0.1,
      // shadowRadius: 4,
      minHeight: 200,
    },
    activeStaffContainer: {
      borderWidth: 2,
      borderColor: colors.primary + '40',
      // backgroundColor: colors.primary + '05',
    },
    staffSystem: {
      position: 'relative',
      // paddingTop: 8,
    },
    staffLine: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 6,
      minHeight: 48,
      position: 'relative',
    },
    voiceLabel: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: colors.primary + '15',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
      borderWidth: 2,
      borderColor: 'transparent',
    },
    activeLabelContainer: {
      backgroundColor: colors.primary,
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
      // borderRadius: 10,
      borderBottomWidth: 2,
      // borderColor: colors.border,
      borderColor: colors.muted,
    },
    activeStaff: {
      borderColor: colors.blueSingle + '70',
      // backgroundColor: colors.primary + '10',
    },
    focusedStaff: {
      borderColor: colors.primary,
      backgroundColor: colors.primary + '15',
      // elevation: 1,
      // shadowColor: colors.primary,
      // shadowOffset: { width: 0, height: 1 },
      // shadowOpacity: 0.2,
      // shadowRadius: 2,
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
    compositionHeader: {
      padding: 10,
      paddingHorizontal:20,
      backgroundColor: colors.card,
      marginHorizontal: 8,
      marginBottom: 5,
      borderRadius: 12,
      elevation: 1,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
    },
    compositionTitle: {
      fontSize: 15,
      fontWeight: 'bold',
      color: colors.text,
    },
    compositionMeta: {
      flexDirection: 'row',
      gap: 16,
    },
    metaItem: {
      fontSize: 14,
      color: colors.text2,
    },
  });


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
      // Recherche de barres de mesure dans toutes les voix
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

  const renderStaffLines = (section: Section) => {
    const voices = [
      { key: 'S', label: 'S', content: section.soprano, name: 'Soprano' },
      { key: 'A', label: 'A', content: section.alto, name: 'Alto' },
      { key: 'T', label: 'T', content: section.tenor, name: 'Ténor' },
      { key: 'B', label: 'B', content: section.bass, name: 'Basse' },
    ];

    // Calcul de la longueur maximale pour les lignes de mesure système
    const maxLength = Math.max(
      section.soprano.length,
      section.alto.length,
      section.tenor.length,
      section.bass.length
    );

    return (
      <View style={styles.staffSystem}>
        {/* Lignes de mesure du système */}
        <View style={styles.measureOverlay}>
          {activeSectionId === section.id && renderSystemMeasureLines(maxLength)}
        </View>
        
        {voices.map((voice) => {
          const isActive = activeVoice === voice.key && activeSectionId === section.id;
          
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
                  style={[
                    styles.staffInput,
                    isActive && styles.activeStaff,
                  ]}
                  value={voice.content}
                  onChangeText={(text) => updateSection(section.id, voice.key, text)}
                  onFocus={() => {
                    onVoiceChange(voice.key as 'S' | 'A' | 'T' | 'B');
                    onSectionChange(section.id);
                    onStaffFocus?.(voice.key as 'S' | 'A' | 'T' | 'B', section.id);

                  }}
                  placeholder={`${voice.name}`}
                  placeholderTextColor={colors.card2}
                  multiline={false}
                  scrollEnabled={false}

                  // Empêche clavier
                    showSoftInputOnFocus={false} // Android seulement
                />
              </View>
            </View>
          );
        })}
      </View>
    );
  };

  const getTotalNotes = (section: Section) => {
    return (section.soprano + section.alto + section.tenor + section.bass)
      .replace(/[^a-zA-Z]/g, '').length;
  };

  if (composition.sections.length === 0) {
    return (
        <View style={styles.container}>
        <View style={styles.compositionHeader}>
            <TextComponent style={styles.compositionTitle}>
            {composition.title}
            </TextComponent>
            <TextComponent variante="body2" color={colors.text2} style={styles.emptyMessage}>
            Aucune section dans votre composition.{'\n'}
            Utilisez le bouton de configuration pour ajouter des sections.
            </TextComponent>
        </View>
        </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Sections avec portées */}
      <ScrollView 
        ref={scrollViewRef}
        style={styles.sectionsContainer}
        showsVerticalScrollIndicator={false}
      >
        {composition.sections.map((section) => (
          <View key={section.id} style={styles.sectionContainer}>
              <View style={styles.compositionHeader}>
                <TextComponent style={styles.compositionTitle}>
                  {section.name}
                </TextComponent>
                {/* <TextComponent style={styles.sectionTitle}>
                  {section.name}
                </TextComponent> */}
                <TextComponent style={styles.sectionInfo}>
                  {getTotalNotes(section)} notes • 4 voix
                </TextComponent>
              </View>
            <View style={[
                styles.staffContainer,
                activeSectionId === section.id && styles.activeStaffContainer
                ]}>
              {renderStaffLines(section)}
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};