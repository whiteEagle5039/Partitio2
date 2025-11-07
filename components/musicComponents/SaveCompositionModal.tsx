import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useThemeColors } from '@/hooks/useThemeColors';
import { X, Save, Library } from 'lucide-react-native';
import { TextComponent } from '@/components/uxComponents/TextComponent';


interface SaveCompositionModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (composerName: string) => Promise<void>;
  isNewComposition: boolean;
}

export const SaveCompositionModal: React.FC<SaveCompositionModalProps> = ({
  visible,
  onClose,
  onSave,
  isNewComposition,
}) => {
  const colors = useThemeColors();
  const [composerName, setComposerName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    const name = composerName.trim() || 'Anonyme';
    
    setIsSaving(true);
    try {
      await onSave(name);
      setComposerName('');
      onClose();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    if (!isSaving) {
      setComposerName('');
      onClose();
    }
  };

  const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.13)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    container: {
      width: '95%',
      maxWidth: 400,
      backgroundColor: colors.card,
      borderRadius: 20,
      padding: 24,
      elevation: 5,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.65,
      shadowRadius: 8,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },

    closeButton: {
      padding: 4,
    },
    content: {
      gap: 20,
    },
    label: {
      fontSize: 15,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 8,
    },
    input: {
      backgroundColor: colors.background,
      borderRadius: 12,
      padding: 14,
      fontSize: 16,
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.border,
      fontFamily: 'Tiempos-Regular',
      lineHeight: 20,
    },
    infoContainer: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      backgroundColor: colors.primary + '15',
      padding: 14,
      borderRadius: 12,
      gap: 12,
    },
    infoText: {
      flex: 1,
      color: colors.text,
    },
    buttonContainer: {
      flexDirection: 'row',
      gap: 12,
      marginTop: 8,
    },
    button: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 14,
      borderRadius: 12,
      gap: 4,
    },
    cancelButton: {
      backgroundColor: colors.border,
    },
    saveButton: {
      backgroundColor: colors.primary,
    },
    buttonDisabled: {
      opacity: 0.5,
    },
    buttonText: {
      fontSize: 16,
      fontWeight: '600',
    },
    cancelButtonText: {
      color: colors.text,
    },
    saveButtonText: {
      color: '#FFFFFF',
    },
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={handleClose}
        />
        
        <View style={styles.container}>
          <View style={styles.header}>
            <TextComponent variante='subtitle2' color={colors.text}>
              {isNewComposition ? 'Sauvegarder la composition' : 'Enregistrer les modifications'}
            </TextComponent>
            <TouchableOpacity
              onPress={handleClose}
              style={styles.closeButton}
              disabled={isSaving}
            >
              <X size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            {isNewComposition && (
              <>
                <View>
                  <TextComponent variante="subtitle3" style={styles.label}>Nom de l'auteur</TextComponent>
                  <TextInput
                    style={styles.input}
                    placeholder="Entrez votre nom"
                    placeholderTextColor={colors.text + '60'}
                    value={composerName}
                    onChangeText={setComposerName}
                    autoFocus
                    editable={!isSaving}
                  />
                </View>

                <View style={styles.infoContainer}>
                  <Library size={20} color={colors.primary} style={{ marginTop: 2 }} />
                  <TextComponent variante='body4' style={styles.infoText}>
                    Vous pourrez retrouver et consulter votre composition à tout moment dans la bibliothèque.
                  </TextComponent>
                </View>
              </>
            )}

            {!isNewComposition && (
              <View style={styles.infoContainer}>
                <Library size={20} color={colors.primary} style={{ marginTop: 2 }} />
                <TextComponent variante='body4' style={styles.infoText}>
                  Les modifications seront enregistrées. Retrouvez votre composition dans la bibliothèque.
                </TextComponent>
              </View>
            )}

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton, isSaving && styles.buttonDisabled]}
                onPress={handleClose}
                disabled={isSaving}
              >
                <TextComponent variante='subtitle3' style={[styles.buttonText, styles.cancelButtonText]}>
                  Annuler
                </TextComponent>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.saveButton, isSaving && styles.buttonDisabled]}
                onPress={handleSave}
                disabled={isSaving}
              >
                {isSaving ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <>
                    <Save size={18} color="#FFFFFF" />
                    <TextComponent variante='subtitle3' style={[styles.buttonText, styles.saveButtonText]}>
                      Sauvegarder
                    </TextComponent>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};