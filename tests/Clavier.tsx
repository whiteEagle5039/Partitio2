// components/MusicKeyboard.tsx
import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { TextComponent } from '@/components/TextComponent';
import { useThemeColors } from '@/hooks/useThemeColors';
import { 
  Music, 
  BarChart3, 
  Pause, 
  ArrowLeft,
  ArrowRight,
  Trash2,
  Hash,
  Square,
  Circle,
  Triangle,
  X
} from 'lucide-react-native';

interface MusicKeyboardProps {
  activeVoice: 'S' | 'A' | 'T' | 'B';
  onVoiceChange: (voice: 'S' | 'A' | 'T' | 'B') => void;
  onInsertSymbol: (symbol: string) => void;
  onInsertNote: (note: string) => void;
  onInsertMeasure: () => void;
  onDeleteLast: () => void;
  onClose?: () => void;
}

type KeyboardMode = 'notes' | 'alterations' | 'rhythms' | 'punctuation';

export const MusicKeyboard: React.FC<MusicKeyboardProps> = ({
  activeVoice,
  onVoiceChange,
  onInsertSymbol,
  onInsertNote,
  onInsertMeasure,
  onDeleteLast,
  onClose,
}) => {
  const colors = useThemeColors();
  const [keyboardMode, setKeyboardMode] = useState<KeyboardMode>('notes');

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.card,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    // Suggestions de voix (comme les suggestions de mots)
    voiceSuggestions: {
      flexDirection: 'row',
      paddingHorizontal: 16,
      paddingVertical: 8,
      backgroundColor: colors.background,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    voiceButton: {
      backgroundColor: colors.background2,
      borderRadius: 16,
      paddingHorizontal: 12,
      paddingVertical: 6,
      marginRight: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },
    activeVoiceButton: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    voiceButtonText: {
      fontSize: 14,
      color: colors.text,
      fontWeight: '500',
    },
    activeVoiceButtonText: {
      color: colors.primaryForeground,
    },
    voiceLabel: {
      fontSize: 10,
      color: colors.text2,
    },
    activeVoiceLabel: {
      color: colors.primaryForeground + '80',
    },
    
    // Onglets de mode
    tabContainer: {
      flexDirection: 'row',
      backgroundColor: colors.background2,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    tab: {
      flex: 1,
      paddingVertical: 10,
      alignItems: 'center',
    },
    activeTab: {
      backgroundColor: colors.primary + '20',
      borderBottomWidth: 2,
      borderBottomColor: colors.primary,
    },
    tabText: {
      fontSize: 12,
      color: colors.text2,
      fontWeight: '500',
    },
    activeTabText: {
      color: colors.primary,
      fontWeight: '600',
    },
    
    // Bouton de fermeture
    closeButton: {
      position: 'absolute',
      top: 8,
      right: 8,
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.background2,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 10,
    },
    
    // Clavier principal
    keyboardContainer: {
      backgroundColor: colors.card,
      paddingBottom: 8,
    },
    keyRow: {
      flexDirection: 'row',
      paddingHorizontal: 8,
      paddingVertical: 4,
    },
    key: {
      flex: 1,
      backgroundColor: colors.background,
      borderRadius: 6,
      paddingVertical: 12,
      paddingHorizontal: 8,
      marginHorizontal: 2,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: colors.border,
      minHeight: 44,
    },
    keyPressed: {
      backgroundColor: colors.primary + '20',
      borderColor: colors.primary,
    },
    keyText: {
      fontSize: 16,
      color: colors.text,
      fontWeight: '500',
    },
    keySubText: {
      fontSize: 10,
      color: colors.text2,
      marginTop: 1,
    },
    
    // Touches spéciales
    wideKey: {
      flex: 1.5,
    },
    actionKey: {
      backgroundColor: colors.destructive + '15',
      borderColor: colors.destructive + '30',
    },
    actionKeyText: {
      color: colors.destructive,
    },
    measureKey: {
      backgroundColor: colors.primary + '15',
      borderColor: colors.primary + '30',
    },
    measureKeyText: {
      color: colors.primary,
    },
    spaceKey: {
      flex: 3,
    },
    
    // Ligne d'actions
    actionRow: {
      flexDirection: 'row',
      paddingHorizontal: 8,
      paddingTop: 4,
    },
    actionButton: {
      backgroundColor: colors.background2,
      borderRadius: 6,
      paddingVertical: 8,
      paddingHorizontal: 12,
      marginHorizontal: 2,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: colors.border,
      minWidth: 50,
    },
  });

  const voices = [
    { key: 'S', label: 'S', name: 'Soprano' },
    { key: 'A', label: 'A', name: 'Alto' },
    { key: 'T', label: 'T', name: 'Ténor' },
    { key: 'B', label: 'B', name: 'Basse' },
  ] as const;

  const tabs = [
    { key: 'notes', label: 'Notes' },
    { key: 'alterations', label: 'Alt.' },
    { key: 'rhythms', label: 'Rythmes' },
    { key: 'punctuation', label: 'Punct.' },
  ] as const;

  // Disposition des notes naturelles (3 rangées comme un clavier)
  const notesLayout = [
    [
      { note: 'do', display: 'do' },
      { note: 're', display: 're' },
      { note: 'mi', display: 'mi' },
    ],
    [
      { note: 'fa', display: 'fa' },
      { note: 'sol', display: 'sol' },
      { note: 'la', display: 'la' },
      { note: 'si', display: 'si' },
    ],
  ];

  // Altérations organisées
  const alterationsLayout = [
    [
      { note: 'do#', display: 'do#' },
      { note: 'reb', display: 'ré♭' },
      { note: 'mib', display: 'mi♭' },
    ],
    [
      { note: 'fa#', display: 'fa#' },
      { note: 'solb', display: 'sol♭' },
      { note: 'lab', display: 'la♭' },
      { note: 'sib', display: 'si♭' },
    ],
  ];

  // Symboles rythmiques organisés
  const rhythmsLayout = [
    [
      { symbol: '♩', name: 'Noire' },
      { symbol: '♪', name: 'Croche' },
      { symbol: '♫', name: 'D.croche' },
    ],
    [
      { symbol: '𝄽', name: 'Silence' },
      { symbol: '𝄾', name: 'D-pause' },
      { symbol: '𝄿', name: 'Pause' },
    ],
    [
      { symbol: '♭', name: 'Bémol' },
      { symbol: '♯', name: 'Dièse' },
      { symbol: '♮', name: 'Bécarre' },
    ],
  ];

  // Ponctuation organisée
  const punctuationLayout = [
    [
      { symbol: '.', display: '.', name: 'Point' },
      { symbol: ',', display: ',', name: 'Virgule' },
      { symbol: ':', display: ':', name: ':' },
      { symbol: ';', display: ';', name: ';' },
    ],
    [
      { symbol: '(', display: '(', name: '(' },
      { symbol: ')', display: ')', name: ')' },
      { symbol: '-', display: '-', name: 'Tiret' },
      { symbol: ' ', display: '⎵', name: 'Espace' },
    ],
  ];

  const renderKeyboard = () => {
    switch (keyboardMode) {
      case 'notes':
        return (
          <>
            {notesLayout.map((row, rowIndex) => (
              <View key={rowIndex} style={styles.keyRow}>
                {row.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.key}
                    onPress={() => onInsertNote(item.note)}
                  >
                    <TextComponent style={styles.keyText}>
                      {item.display}
                    </TextComponent>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </>
        );

      case 'alterations':
        return (
          <>
            {alterationsLayout.map((row, rowIndex) => (
              <View key={rowIndex} style={styles.keyRow}>
                {row.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.key}
                    onPress={() => onInsertNote(item.note)}
                  >
                    <TextComponent style={styles.keyText}>
                      {item.display}
                    </TextComponent>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </>
        );

      case 'rhythms':
        return (
          <>
            {rhythmsLayout.map((row, rowIndex) => (
              <View key={rowIndex} style={styles.keyRow}>
                {row.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.key}
                    onPress={() => onInsertSymbol(item.symbol)}
                  >
                    <TextComponent style={styles.keyText}>
                      {item.symbol}
                    </TextComponent>
                    <TextComponent style={styles.keySubText}>
                      {item.name}
                    </TextComponent>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </>
        );

      case 'punctuation':
        return (
          <>
            {punctuationLayout.map((row, rowIndex) => (
              <View key={rowIndex} style={styles.keyRow}>
                {row.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.key}
                    onPress={() => onInsertSymbol(item.symbol)}
                  >
                    <TextComponent style={styles.keyText}>
                      {item.display}
                    </TextComponent>
                    <TextComponent style={styles.keySubText}>
                      {item.name}
                    </TextComponent>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </>
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* Bouton de fermeture */}
      {onClose && (
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <X size={16} color={colors.icon} />
        </TouchableOpacity>
      )}

      {/* Suggestions de voix (comme les suggestions de mots) */}
      <View style={styles.voiceSuggestions}>
        {voices.map((voice) => (
          <TouchableOpacity
            key={voice.key}
            style={[
              styles.voiceButton,
              activeVoice === voice.key && styles.activeVoiceButton,
            ]}
            onPress={() => onVoiceChange(voice.key)}
          >
            <TextComponent
              style={[
                styles.voiceButtonText,
                activeVoice === voice.key && styles.activeVoiceButtonText,
              ]}
            >
              {voice.label}
            </TextComponent>
            <TextComponent
              style={[
                styles.voiceLabel,
                activeVoice === voice.key && styles.activeVoiceLabel,
              ]}
            >
              {voice.name}
            </TextComponent>
          </TouchableOpacity>
        ))}
      </View>

      {/* Onglets pour switcher les modes */}
      <View style={styles.tabContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.tab,
              keyboardMode === tab.key && styles.activeTab,
            ]}
            onPress={() => setKeyboardMode(tab.key as KeyboardMode)}
          >
            <TextComponent
              style={[
                styles.tabText,
                keyboardMode === tab.key && styles.activeTabText,
              ]}
            >
              {tab.label}
            </TextComponent>
          </TouchableOpacity>
        ))}
      </View>

      {/* Clavier principal */}
      <View style={styles.keyboardContainer}>
        {renderKeyboard()}
        
        {/* Ligne d'actions en bas */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.actionButton, styles.measureKey]}
            onPress={onInsertMeasure}
          >
            <BarChart3 size={16} color={colors.primary} />
            <TextComponent style={[styles.keySubText, styles.measureKeyText]}>
              Mesure
            </TextComponent>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, styles.spaceKey]}
            onPress={() => onInsertSymbol(' ')}
          >
            <TextComponent style={styles.keyText}>
              espace
            </TextComponent>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton]}
            onPress={() => onInsertSymbol('\n')}
          >
            <ArrowLeft size={16} color={colors.text} />
            <TextComponent style={styles.keySubText}>
              Retour
            </TextComponent>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, styles.actionKey]}
            onPress={onDeleteLast}
          >
            <Trash2 size={16} color={colors.destructive} />
            <TextComponent style={[styles.keySubText, styles.actionKeyText]}>
              Suppr
            </TextComponent>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};