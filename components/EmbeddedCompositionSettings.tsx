// components/EmbeddedCompositionSettings.tsx
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { TextComponent } from '@/components/TextComponent';
import { useThemeColors } from '@/hooks/useThemeColors';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  ChevronUp, 
  ChevronDown,
  Copy,
  Music,
  FileText,
} from 'lucide-react-native';

interface Section {
  id: string;
  name: string;
  soprano: string;
  alto: string;
  tenor: string;
  bass: string;
}

interface EmbeddedCompositionSettingsProps {
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

export const EmbeddedCompositionSettings: React.FC<EmbeddedCompositionSettingsProps> = ({
  composition,
  onCompositionChange,
  onSectionSelect,
  activeSectionId,
}) => {
  const colors = useThemeColors();
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    sectionTitleText: {
      fontSize: 12,
      fontWeight: 'bold',
      color: colors.text2,
      marginLeft: 8,
      textTransform: 'uppercase',
    },
    input: {
      backgroundColor: colors.background2,
      borderRadius: 8,
      padding: 12,
      fontSize: 14,
      color: colors.text,
      marginVertical: 4,
      borderWidth: 1,
      borderColor: 'transparent',
    },
    inputLabel: {
      fontSize: 11,
      fontWeight: '600',
      color: colors.text2,
      marginBottom: 4,
      marginTop: 8,
    },
    presetButtons: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 6,
      marginTop: 6,
    },
    presetButton: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      backgroundColor: colors.background2,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: colors.border,
    },
    presetButtonText: {
      fontSize: 10,
      color: colors.text2,
    },
    sectionItem: {
      backgroundColor: colors.background2,
      borderRadius: 8,
      marginBottom: 6,
      overflow: 'hidden',
    },
    activeSectionItem: {
      backgroundColor: colors.primary + '20',
      borderColor: colors.primary,
      borderWidth: 1,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
    },
    sectionIcon: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: colors.primary + '20',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 10,
    },
    activeSectionIcon: {
      backgroundColor: colors.primary,
    },
    sectionContent: {
      flex: 1,
    },
    sectionName: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 2,
    },
    sectionStats: {
      fontSize: 10,
      color: colors.text2,
    },
    sectionActions: {
      flexDirection: 'row',
      gap: 4,
    },
    actionButton: {
      padding: 6,
      borderRadius: 4,
      backgroundColor: colors.background,
    },
    editingContainer: {
      padding: 10,
      backgroundColor: colors.background,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    editingInput: {
      backgroundColor: colors.card,
      borderRadius: 4,
      padding: 8,
      fontSize: 12,
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.primary,
    },
    editingActions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      gap: 6,
      marginTop: 6,
    },
    editingButton: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 4,
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
      borderRadius: 8,
      padding: 12,
      marginTop: 8,
    },
    addButtonText: {
      marginLeft: 6,
      fontWeight: 'bold',
      fontSize: 14,
      color: colors.primaryForeground,
    },
  });

  const updateCompositionField = (field: string, value: string) => {
    onCompositionChange({
      ...composition,
      [field]: value,
    });
  };

  const addSection = (sectionType: string = 'custom') => {
    const sectionNames = {
      verse: 'Couplet',
      chorus: 'Refrain',
      bridge: 'Pont',
      intro: 'Introduction',
      outro: 'Conclusion',
      custom: 'Section'
    };

    const baseName = sectionNames[sectionType] || 'Section';
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

    onSectionSelect(newSection.id);
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
            
            if (activeSectionId === sectionId && newSections.length > 0) {
              onSectionSelect(newSections[0].id);
            }
          },
        },
      ]
    );
  };

  const updateSectionName = (sectionId: string, name: string) => {
    onCompositionChange({
      ...composition,
      sections: composition.sections.map(section =>
        section.id === sectionId ? { ...section, name } : section
      ),
    });
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

  const tempoPresets = ['2/4', '3/4', '4/4', '6/8', '9/8', '12/8'];
  const keyPresets = ['Do M', 'Ré M', 'Mi M', 'Fa M', 'Sol M', 'La M', 'Si M', 'La m', 'Si m', 'Do m', 'Ré m', 'Mi m'];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Informations générales */}
      <View style={styles.section}>
        <View style={styles.sectionTitle}>
          <FileText size={14} color={colors.primary} />
          <TextComponent style={styles.sectionTitleText}>
            Informations
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
          <Music size={14} color={colors.primary} />
          <TextComponent style={styles.sectionTitleText}>
            Sections ({composition.sections.length})
          </TextComponent>
        </View>

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
                <Music size={12} color={
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
                    <ChevronUp size={12} color={colors.icon} />
                  </TouchableOpacity>
                )}
                
                {index < composition.sections.length - 1 && (
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => moveSectionDown(index)}
                  >
                    <ChevronDown size={12} color={colors.icon} />
                  </TouchableOpacity>
                )}
                
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => duplicateSection(section.id)}
                >
                  <Copy size={12} color={colors.icon} />
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => setEditingSectionId(section.id)}
                >
                  <Edit3 size={12} color={colors.icon} />
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => deleteSection(section.id)}
                >
                  <Trash2 size={12} color={colors.destructive} />
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
                    <TextComponent style={{ color: colors.text2, fontSize: 11 }}>
                      Annuler
                    </TextComponent>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.editingButton, styles.saveButton]}
                    onPress={() => setEditingSectionId(null)}
                  >
                    <TextComponent style={{ color: colors.primaryForeground, fontSize: 11 }}>
                      OK
                    </TextComponent>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        ))}

        {/* Boutons d'ajout rapide */}
        <View style={{ marginTop: 8 }}>
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
          <Plus size={16} color={colors.primaryForeground} />
          <TextComponent style={styles.addButtonText}>
            Ajouter une section
          </TextComponent>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};