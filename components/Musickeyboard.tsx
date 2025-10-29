// components/MusicKeyboard.tsx
import { TextComponent } from '@/components/uxComponents/TextComponent';
import { useThemeColors } from '@/hooks/useThemeColors';
import {
  ArrowLeft,
  BarChart3,
  Trash2,
  X
} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { BackHandler, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';

interface MusicKeyboardProps {
  activeVoice: 'S' | 'A' | 'T' | 'B';
  onVoiceChange: (voice: 'S' | 'A' | 'T' | 'B') => void;
  onInsertSymbol: (symbol: string) => void;
  onInsertNote: (note: string) => void;
  onInsertMeasure: () => void;
  onDeleteLast: () => void;
  onClose?: () => void;
  currentContent?: string; // Pour analyser le contexte actuel
}

type KeyboardMode = 'notes' | 'alterations' | 'rhythms' | 'punctuation';

interface Suggestion {
  symbol: string;
  display: string;
  name: string;
  priority: number;
}

export const MusicKeyboard: React.FC<MusicKeyboardProps> = ({
  activeVoice,
  onVoiceChange,
  onInsertSymbol,
  onInsertNote,
  onInsertMeasure,
  onDeleteLast,
  onClose,
  currentContent = '',
}) => {
  const colors = useThemeColors();
  const [keyboardMode, setKeyboardMode] = useState<KeyboardMode>('notes');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [lastInsertedType, setLastInsertedType] = useState<'note' | 'symbol' | null>(null);

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.card,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    // Suggestions intelligentes (remplace les boutons de voix)
    suggestionsContainer: {
      flexDirection: 'row',
      paddingHorizontal: 16,
      paddingVertical: 8,
      backgroundColor: colors.background,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      minHeight: 50,
    },
    suggestionButton: {
      backgroundColor: colors.background2,
      borderRadius: 8,
      paddingHorizontal: 16,
      paddingVertical: 2,
      marginRight: 8,
      borderWidth: 1,
      borderColor: colors.border,
      justifyContent: 'center',
      alignItems: 'center',
      minWidth: 60,
    },
    prioritySuggestion: {
      backgroundColor: colors.primary + '20',
      borderColor: colors.primary + '50',
    },
    suggestionText: {
      fontSize: 16,
      color: colors.text,
      fontWeight: '500',
    },
    prioritySuggestionText: {
      color: colors.primary,
      fontWeight: '600',
    },
    suggestionLabel: {
      fontSize: 10,
      color: colors.text2,
      marginTop: 2,
    },
    prioritySuggestionLabel: {
      color: colors.primary + '80',
    },
    voiceIndicator: {
      position: 'absolute',
      right: 16,
      top: 12,
      backgroundColor: colors.primary,
      borderRadius: 12,
      paddingHorizontal: 8,
      paddingVertical: 4,
    },
    voiceIndicatorText: {
      color: colors.primaryForeground,
      fontSize: 12,
      fontWeight: 'bold',
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
    overContainer:{
      display:'flex',
      flexDirection:'column',
      gap:15,
    }
  });

  // Fonction pour générer des suggestions intelligentes
  const generateSuggestions = (content: string, lastType: 'note' | 'symbol' | null): Suggestion[] => {
    const suggestions: Suggestion[] = [];
    
    // Analyse du contexte actuel
    const lastChars = content.slice(-5).toLowerCase();
    const hasRecentNote = /[a-g]/.test(lastChars);
    const hasRecentSpace = content.endsWith(' ');
    const measureCount = (content.match(/\|/g) || []).length;
    
    // Suggestions après insertion d'une note
    if (lastType === 'note' || hasRecentNote) {
      suggestions.push(
        { symbol: ' ', display: '⎵', name: 'Espace', priority: 9 },
        { symbol: '.', display: '.', name: 'Point', priority: 8 },
        { symbol: ',', display: ',', name: 'Virgule', priority: 7 },
        { symbol: ':', display: ':', name: '2 points', priority: 6 },
        { symbol: ';', display: ';', name: 'Point virgule', priority: 5 },
        { symbol: ' | ', display: '|', name: 'Mesure', priority: 4 },
      );
    }
    
    // Suggestions après un espace
    if (hasRecentSpace) {
      suggestions.push(
        { symbol: '| ', display: '|', name: 'Mesure', priority: 9 },
        { symbol: '(', display: '(', name: 'Parenthèse', priority: 6 },
        { symbol: '♩', display: '♩', name: 'Noire', priority: 5 },
      );
    }
    
    // Suggestions de base toujours présentes
    suggestions.push(
      { symbol: ' | ', display: '|', name: 'Mesure', priority: 4 },
      { symbol: '♪', display: '♪', name: 'Croche', priority: 3 },
      { symbol: '♭', display: '♭', name: 'Bémol', priority: 2 },
      { symbol: '♯', display: '♯', name: 'Dièse', priority: 1 },
    );
    
    // Retourner les 6 meilleures suggestions triées par priorité
    return suggestions
      .sort((a, b) => b.priority - a.priority)
      .slice(0, 6);
  };

  // Mise à jour des suggestions basées sur le contexte
  useEffect(() => {
    const newSuggestions = generateSuggestions(currentContent, lastInsertedType);
    setSuggestions(newSuggestions);
  }, [currentContent, lastInsertedType]);

  // Intercept Android hardware back button to close the music keyboard when active
  useEffect(() => {
    if (!onClose) return;
    if (Platform.OS !== 'android') return;

    const handler = () => {
      onClose();
      return true; // prevent default back action
    };

    const subscription = BackHandler.addEventListener('hardwareBackPress', handler);
    return () => subscription.remove();
  }, [onClose]);

   // Gestionnaires avec tracking du type d'insertion
   const handleInsertNote = (note: string) => {
     onInsertNote(note);
     setLastInsertedType('note');
   };

   const handleInsertSymbol = (symbol: string) => {
     onInsertSymbol(symbol);
     setLastInsertedType('symbol');
   };

   const handleInsertMeasure = () => {
     onInsertMeasure();
     setLastInsertedType('symbol');
   };

   const voices = [
     { key: 'S', label: 'S', name: 'Soprano' },
     { key: 'A', label: 'A', name: 'Alto' },
     { key: 'T', label: 'T', name: 'Ténor' },
     { key: 'B', label: 'B', name: 'Basse' },
   ] as const;

   const tabs = [
     { key: 'notes', label: 'Notes' },
     { key: 'alterations', label: 'Alt.' },
     { key: 'punctuation', label: 'Rythmes' },
   ] as const;

   // Disposition des notes naturelles
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

   // Ponctuation
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
                     onPress={() => handleInsertNote(item.note)}
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
                     onPress={() => handleInsertNote(item.note)}
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
     
       case 'punctuation':
         return (
           <>
             {punctuationLayout.map((row, rowIndex) => (
               <View key={rowIndex} style={styles.keyRow}>
                 {row.map((item, index) => (
                   <TouchableOpacity
                     key={index}
                     style={styles.key}
                     onPress={() => handleInsertSymbol(item.symbol)}
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

   const currentVoice = voices.find(v => v.key === activeVoice);

   return (
     <View style = {styles.overContainer}>
       <View style={styles.container}>

         {/* Suggestions intelligentes avec indicateur de voix */}
         <View style={styles.suggestionsContainer}>
           {suggestions.map((suggestion, index) => (
             <TouchableOpacity
               key={index}
               style={[
                 styles.suggestionButton,
                 index < 2 && styles.prioritySuggestion, // Les 2 premières sont prioritaires
               ]}
               onPress={() => handleInsertSymbol(suggestion.symbol)}
             >
               <TextComponent
                 style={[
                   styles.suggestionText,
                   index < 2 && styles.prioritySuggestionText,
                 ]}
               >
                 {suggestion.display}
               </TextComponent>
               <TextComponent
                 style={[
                   styles.suggestionLabel,
                   index < 2 && styles.prioritySuggestionLabel,
                 ]}
               >
                 {suggestion.name}
               </TextComponent>
             </TouchableOpacity>
           ))}
           
           {/* Indicateur de voix active */}
           <View style={styles.voiceIndicator}>
             <TextComponent style={styles.voiceIndicatorText}>
               {currentVoice?.label} - {currentVoice?.name}
             </TextComponent>
           </View>
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
               onPress={handleInsertMeasure}
             >
               <BarChart3 size={16} color={colors.primary} />
               <TextComponent style={[styles.keySubText, styles.measureKeyText]}>
                 Mesure
               </TextComponent>
             </TouchableOpacity>
             
             <TouchableOpacity
               style={[styles.actionButton, styles.spaceKey]}
               onPress={() => handleInsertSymbol(' ')}
             >
               <TextComponent style={styles.keyText}>
                 espace
               </TextComponent>
             </TouchableOpacity>
             
             <TouchableOpacity
               style={[styles.actionButton]}
               onPress={() => handleInsertSymbol('\n')}
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
     </View>
   );
};