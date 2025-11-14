// components/MusicKeyboard.tsx
import { TextComponent } from '@/components/uxComponents/TextComponent';
import { useThemeColors } from '@/hooks/useThemeColors';
import {
  ArrowLeft,
  BarChart3,
  Trash2,
  ChevronDown,
  Minus
} from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { BackHandler, Platform, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

interface MusicKeyboardProps {
  activeVoice: 'S' | 'A' | 'T' | 'B';
  onVoiceChange: (voice: 'S' | 'A' | 'T' | 'B') => void;
  // onInsertSymbol: (symbol: string) => void;
  onInsertNote: (note: string) => void;
  // onInsertMeasure: () => void;
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
  onInsertNote,
  onDeleteLast,
  onClose,
  currentContent = '',
}) => {
  const colors = useThemeColors();
  const [keyboardMode, setKeyboardMode] = useState<KeyboardMode>('notes');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [lastInsertedType, setLastInsertedType] = useState<'note' | 'symbol' | null>(null);
  const suggestionsScrollRef = useRef<ScrollView | null>(null);
  const [suggestionsScrollX, setSuggestionsScrollX] = useState(0);
  const [suggestionsContentWidth, setSuggestionsContentWidth] = useState(0);
  const [suggestionsContainerWidth, setSuggestionsContainerWidth] = useState(0);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.card,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      // Shadow for better visual depth
      elevation: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: 0.12,
      shadowRadius: 8,
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
      // subtle inner shadow / elevation
      elevation: 6,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.08,
      shadowRadius: 6,
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
    },
    suggestionScrollArrow: {
      position: 'absolute',
      top: '50%',
      marginTop: -12,
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: colors.card2,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 20,
      opacity: 0.95,
      // subtle shadow for arrows
      elevation: 6,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.18,
      shadowRadius: 4,
    },
    leftArrow: {
      left: 8,
    },
    rightArrow: {
      right: 8,
    },
  });

  // Fonction pour générer des suggestions intelligentes
  const generateSuggestions = (content: string, lastType: 'note' | 'symbol' | null): Suggestion[] => {
    const suggestions: Suggestion[] = [];
    
    // Analyse du contexte actuel
    const lastChars = content.slice(-5).toLowerCase();
    const hasRecentNote = /[a-g]/.test(lastChars);
    const hasRecentSpace = content.endsWith('');
    const measureCount = (content.match(/\|/g) || []).length;
    
    // Suggestions après insertion d'une note
    if (lastType === 'note' || hasRecentNote) {
      suggestions.push(
        { symbol: '.', display: '.', name: 'Point', priority: 8 },
        { symbol: ',', display: ',', name: 'Virgule', priority: 6 },
        { symbol: ':', display: ':', name: '2 points', priority: 7 },
        { symbol: ';', display: ';', name: 'Point virgule', priority: 5 },
      );
    }

    // // Suggestions après un espace
    // if (hasRecentSpace) {
    //   suggestions.push(
    //     //  { symbol: '.', display: '.', nconst handleInsertNote = (note: string) => {
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
  
  // ✅ Solution élégante : Obtenir la ref du TextInput actif
  const inputKey = `${activeSectionId}-${activeVoice}`;
  const inputRef = getActiveInputRef(); // Vous devez passer cette ref depuis MusicEditor
  
  if (inputRef) {
    // ✅ Le TextInput garde sa position de curseur naturellement
    const insertText = note === ' ' ? ' ' : (note + ' ');
    
    // Simuler une insertion comme si l'utilisateur tapait
    inputRef.focus();
    
    // Utiliser une méthode native si disponible, sinon fallback
    const newContent = currentContent + insertText; // Fallback simple
    updateSectionContent(activeSectionId, voiceKey, newContent);
  }
};ame: 'Point', priority: 8 },
    //     // { symbol: ',', display: ',', name: 'Virgule', priority: 6 },
    //     // { symbol: ':', display: ':', name: '2 points', priority: 7 },
    //     { symbol: ';', display: ';', name: 'Point virgule', priority: 5 },
    //   );
    // }
    
    // Suggestions de base toujours présentes
    suggestions.push(
      { symbol: ' | ', display: '|', name: 'Mesure', priority: 4 },
      { symbol: ' - ', display: '-', name: 'Tiret', priority: 7 },
      { symbol: '♭', display: '♭', name: 'Bémol', priority: 1 },
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

   const handleInsertMeasure = () => {
     onInsertNote(' | ');
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
       { note: 'ti', display: 'ti' },
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
       { note: 'tib', display: 'ti♭' },
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
                     onPress={() => handleInsertNote(item.symbol)}
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

         {/* Suggestions intelligentes (scroll horizontal) */}
         <View
           style={styles.suggestionsContainer}
           onLayout={(e) => setSuggestionsContainerWidth(e.nativeEvent.layout.width)}
         >
           <ScrollView
             ref={(r) => { suggestionsScrollRef.current = r; }}
             horizontal
             showsHorizontalScrollIndicator={false}
             contentContainerStyle={{ alignItems: 'center', paddingHorizontal: 8 }}
             onContentSizeChange={(w) => {
               setSuggestionsContentWidth(w);
               setShowRightArrow(w > suggestionsContainerWidth + 8);
             }}
             onScroll={(e) => {
               const x = e.nativeEvent.contentOffset.x;
               setSuggestionsScrollX(x);
               setShowLeftArrow(x > 8);
               setShowRightArrow(x + suggestionsContainerWidth < suggestionsContentWidth - 8);
             }}
             scrollEventThrottle={16}
           >
             {suggestions.map((suggestion, index) => (
               <TouchableOpacity
                 key={index}
                 style={[
                   styles.suggestionButton
                 ]}
                 onPress={() => handleInsertNote(suggestion.symbol)}
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
           </ScrollView>

           {showLeftArrow && (
             <TouchableOpacity
               style={[styles.suggestionScrollArrow, styles.leftArrow]}
               onPress={() => {
                 const target = Math.max(0, suggestionsScrollX - 120);
                 suggestionsScrollRef.current?.scrollTo({ x: target, animated: true });
               }}
             >
               <TextComponent style={{ color: colors.text, fontSize: 18 }}>{'‹'}</TextComponent>
             </TouchableOpacity>
           )}

           {showRightArrow && (
             <TouchableOpacity
               style={[styles.suggestionScrollArrow, styles.rightArrow]}
               onPress={() => {
                 const maxX = Math.max(0, suggestionsContentWidth - suggestionsContainerWidth);
                 const target = Math.min(maxX, suggestionsScrollX + 120);
                 suggestionsScrollRef.current?.scrollTo({ x: target, animated: true });
               }}
             >
               <TextComponent style={{ color: colors.text, fontSize: 18 }}>{'›'}</TextComponent>
             </TouchableOpacity>
           )}
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
               onPress={() => handleInsertNote(' ')}
             >
               <TextComponent style={styles.keyText}>
                 espace
               </TextComponent>
               <Minus size={16} color={colors.text} />
             </TouchableOpacity>
             
             <TouchableOpacity
               style={[styles.actionButton, styles.actionKey]}
               onPress={onDeleteLast}
             >
               <ArrowLeft size={16} color={colors.destructive} />
               <TextComponent style={[styles.keySubText, styles.actionKeyText]}>
                 Effacer
               </TextComponent>
             </TouchableOpacity>
             
             <TouchableOpacity
               style={[styles.actionButton, styles.actionKey]}
               onPress={() => {
               const closeKeyboard = () => {
                 if (onClose) onClose();
               };
               closeKeyboard();
               }}
             >
               <ChevronDown size={16} color={colors.text} />
             </TouchableOpacity>
           </View>
         </View>
       </View>
     </View>
   );
};