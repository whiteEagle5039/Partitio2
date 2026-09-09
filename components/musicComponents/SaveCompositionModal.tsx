import { Library, Save, X } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { ButtonComponent } from '@/components/uxComponents/ButtonComponent';
import { TextComponent } from '@/components/uxComponents/TextComponent';
import { MAX_FONT_SCALE, MIN_TOUCH_TARGET, elevation, touchSlop } from '@/constants/layout';
import { useResponsive } from '@/hooks/useResponsive';
import { useThemeColors } from '@/hooks/useThemeColors';

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
  const { spacing, radius, icon, fontSize } = useResponsive();
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
      backgroundColor: 'rgba(0, 0, 0, 0.35)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing.lg,
    },
    container: {
      width: '100%',
      // Reste lisible du petit téléphone à la tablette.
      maxWidth: 440,
      maxHeight: '90%',
      backgroundColor: colors.card,
      borderRadius: radius.xl,
      borderWidth: 1,
      borderColor: colors.border,
      padding: spacing.lg,
      gap: spacing.lg,
      ...elevation(3),
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: spacing.sm,
    },
    closeButton: {
      minWidth: MIN_TOUCH_TARGET,
      minHeight: MIN_TOUCH_TARGET,
      alignItems: 'center',
      justifyContent: 'center',
    },
    input: {
      backgroundColor: colors.background,
      borderRadius: radius.md,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.sm,
      minHeight: MIN_TOUCH_TARGET,
      fontSize: fontSize(16),
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.border,
    },
    infoContainer: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      backgroundColor: `${colors.primary}15`,
      padding: spacing.sm,
      borderRadius: radius.md,
      gap: spacing.sm,
    },
  });

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.overlay}
      >
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={handleClose}
          accessibilityRole="button"
          accessibilityLabel="Fermer"
        />

        <View style={styles.container}>
          <View style={styles.header}>
            <TextComponent variante="subtitle2" color={colors.text} style={{ flex: 1 }}>
              {isNewComposition ? 'Sauvegarder la composition' : 'Enregistrer les modifications'}
            </TextComponent>

            <TouchableOpacity
              onPress={handleClose}
              style={styles.closeButton}
              disabled={isSaving}
              hitSlop={touchSlop}
              accessibilityRole="button"
              accessibilityLabel="Fermer"
            >
              <X size={icon.md} color={colors.icon} />
            </TouchableOpacity>
          </View>

          <ScrollView
            contentContainerStyle={{ gap: spacing.md }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {isNewComposition && (
              <View style={{ gap: spacing.xs }}>
                <TextComponent variante="subtitle3" color={colors.text}>
                  Nom de l&apos;auteur
                </TextComponent>
                <TextInput
                  style={styles.input}
                  placeholder="Entrez votre nom"
                  placeholderTextColor={colors.text2}
                  value={composerName}
                  onChangeText={setComposerName}
                  editable={!isSaving}
                  returnKeyType="done"
                  onSubmitEditing={handleSave}
                  maxFontSizeMultiplier={MAX_FONT_SCALE}
                  accessibilityLabel="Nom de l'auteur"
                  autoFocus
                />
              </View>
            )}

            <View style={styles.infoContainer}>
              <Library size={icon.sm} color={colors.primary} />
              <TextComponent variante="body5" color={colors.text} style={{ flex: 1 }}>
                {isNewComposition
                  ? 'Vous pourrez retrouver et consulter votre composition à tout moment dans la bibliothèque.'
                  : 'Les modifications seront enregistrées. Retrouvez votre composition dans la bibliothèque.'}
              </TextComponent>
            </View>
          </ScrollView>

          <View style={{ flexDirection: 'row', gap: spacing.sm }}>
            <ButtonComponent
              title="Annuler"
              onPress={handleClose}
              variant="secondary"
              disabled={isSaving}
              style={{ flex: 1 }}
            />
            <ButtonComponent
              title="Sauvegarder"
              onPress={handleSave}
              icon={Save}
              loading={isSaving}
              disabled={isSaving}
              style={{ flex: 1 }}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};
