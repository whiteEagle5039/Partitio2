import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  ArrowLeft, 
  Save, 
  Share, 
  FileText, 
  Music,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react-native';
import { TextComponent } from '@/components/TextComponent';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useAppStore } from '@/stores/appStore';
import { useRouter } from 'expo-router';

export default function ComposeScreen() {
  const colors = useThemeColors();
  const router = useRouter();
  const { addComposition } = useAppStore();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.card,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 10,
      paddingVertical: 10,
      backgroundColor: colors.card,
    },
    backButton: {
      marginRight: 16,
      padding: 8,
    },
    headerTitle: {
      flex: 1,
    },
    headerActions: {
      flexDirection: 'row',
      gap: 8,
    },
    actionButton: {
      padding: 8,
    },
    content: {
      flex: 1,
      padding: 20,
    },
    titleInput: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 20,
      elevation: 1,
    },
    editorContainer: {
      flex: 1,
      backgroundColor: colors.card,
      borderRadius: 16,
      overflow: 'hidden',
      elevation: 2,
    },
    editorHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    editorTitle: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    editorControls: {
      flexDirection: 'row',
      gap: 8,
    },
    controlButton: {
      backgroundColor: colors.primary + '20',
      borderRadius: 8,
      padding: 8,
    },
    editor: {
      flex: 1,
      padding: 16,
      fontSize: 16,
      color: colors.text,
      textAlignVertical: 'top',
      minHeight: 300,
    },
    toolbar: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      padding: 16,
      backgroundColor: colors.background2,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    toolButton: {
      alignItems: 'center',
      padding: 8,
    },
    saveButton: {
      backgroundColor: colors.primary,
      borderRadius: 12,
      padding: 16,
      margin: 20,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
    },
    saveButtonText: {
      marginLeft: 8,
      fontWeight: 'bold',
    },
  });

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert('Erreur', 'Veuillez saisir un titre pour votre composition');
      return;
    }

    const newComposition = {
      id: Date.now().toString(),
      title: title.trim(),
      content: content.trim(),
      createdAt: new Date(),
      lastModified: new Date(),
      isPublic: false,
    };

    addComposition(newComposition);
    Alert.alert('Succès', 'Votre composition a été sauvegardée !');
    router.back();
  };

  const handleExportPDF = () => {
    Alert.alert(
      'Exporter en PDF',
      'Cette fonctionnalité sera bientôt disponible',
      [{ text: 'OK' }]
    );
  };

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
    // Ici vous pourriez intégrer un lecteur audio
  };

  const toolbarItems = [
    { icon: Music, label: 'Note', onPress: () => setContent(content + '♪ ') },
    { icon: FileText, label: 'Texte', onPress: () => setContent(content + '\n\n') },
    { icon: RotateCcw, label: 'Annuler', onPress: () => setContent('') },
  ];

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={colors.icon} />
          </TouchableOpacity>
          
          <View style={styles.headerTitle}>
            <TextComponent variante="subtitle1">
              Composition
            </TextComponent>
          </View>
          
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleExportPDF}
            >
              <Share size={24} color={colors.icon} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.content}>
          {/* Titre de la composition */}
          <TextInput
            style={styles.titleInput}
            placeholder="Titre de votre composition..."
            placeholderTextColor={colors.text2}
            value={title}
            onChangeText={setTitle}
          />

          {/* Éditeur */}
          <View style={styles.editorContainer}>
            <View style={styles.editorHeader}>
              <View style={styles.editorTitle}>
                <Music size={20} color={colors.primary} />
                <TextComponent variante="subtitle3" style={{ marginLeft: 8 }}>
                  Éditeur de partition
                </TextComponent>
              </View>
              
              <View style={styles.editorControls}>
                <TouchableOpacity 
                  style={styles.controlButton}
                  onPress={togglePlayback}
                >
                  {isPlaying ? (
                    <Pause size={16} color={colors.primary} />
                  ) : (
                    <Play size={16} color={colors.primary} />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <TextInput
              style={styles.editor}
              placeholder="Commencez à écrire votre partition ici...&#10;&#10;Exemple :&#10;C G Am F&#10;Do Sol La- Fa&#10;&#10;Ou utilisez la notation musicale traditionnelle..."
              placeholderTextColor={colors.text2}
              value={content}
              onChangeText={setContent}
              multiline
              textAlignVertical="top"
            />

            {/* Barre d'outils */}
            <View style={styles.toolbar}>
              {toolbarItems.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.toolButton}
                  onPress={item.onPress}
                >
                  <item.icon size={20} color={colors.icon} />
                  <TextComponent variante="caption" color={colors.text2} style={{ marginTop: 4 }}>
                    {item.label}
                  </TextComponent>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Bouton de sauvegarde */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Save size={20} color={colors.primaryForeground} />
          <TextComponent 
            variante="body2" 
            color={colors.primaryForeground} 
            style={styles.saveButtonText}
          >
            Sauvegarder la composition
          </TextComponent>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}