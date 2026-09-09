import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import { ButtonComponent } from '@/components/uxComponents/ButtonComponent';
import { Content, Screen } from '@/components/uxComponents/Screen';
import { TextComponent } from '@/components/uxComponents/TextComponent';
import { MAX_FONT_SCALE, MIN_TOUCH_TARGET } from '@/constants/layout';
import { useResponsive } from '@/hooks/useResponsive';
import { useThemeColors } from '@/hooks/useThemeColors';

/** Pastille de marque affichée au-dessus du formulaire. */
const HarmoniaIcon = ({ size = 32, color }: { size?: number; color: string }) => (
  <View
    style={{
      width: size,
      height: size,
      backgroundColor: color,
      borderRadius: size / 2,
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <TextComponent variante="subtitle1" color="#FFFFFF">
      P
    </TextComponent>
  </View>
);

const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export default function EmailAuthScreen() {
  const colors = useThemeColors();
  const router = useRouter();
  const { spacing, radius, scale, fontSize, isSmall } = useResponsive();

  const [email, setEmail] = useState('');
  const [focused, setFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const handleContinueWithGoogle = () => {
    console.log('Continue with Google');
  };

  const handleEmailSubmit = () => {
    if (!isValidEmail(email.trim())) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push(`/verification?email=${encodeURIComponent(email)}`);
    }, 2000);
  };

  const canSubmit = isValidEmail(email.trim()) && !isLoading;

  const styles = StyleSheet.create({
    scrollContent: {
      flexGrow: 1,
      justifyContent: 'center',
      paddingVertical: spacing.xxl,
    },
    logoContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.sm,
      marginBottom: isSmall ? spacing.xxl : spacing.xxxl,
    },
    title: {
      textAlign: 'center',
      marginBottom: spacing.xxl,
    },
    separator: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      marginVertical: spacing.lg,
    },
    separatorLine: {
      flex: 1,
      height: StyleSheet.hairlineWidth,
      backgroundColor: colors.border,
    },
    emailInput: {
      backgroundColor: colors.card,
      borderRadius: radius.md,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      minHeight: MIN_TOUCH_TARGET + spacing.xxs,
      fontSize: fontSize(16),
      color: colors.text,
      borderWidth: 1,
      borderColor: focused || (email && isValidEmail(email)) ? colors.primary : colors.border,
      marginBottom: spacing.lg,
    },
    footer: {
      paddingBottom: spacing.lg,
      gap: spacing.lg,
    },
    termsText: {
      textAlign: 'center',
      opacity: 0.75,
    },
    linkText: {
      color: colors.primary,
      textDecorationLine: 'underline',
    },
    companyName: {
      textAlign: 'center',
      opacity: 0.5,
      letterSpacing: 2,
    },
  });

  return (
    <Screen edges={['top', 'left', 'right', 'bottom']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Content>
            <Animated.View style={{ opacity: fadeAnim }}>
              <View style={styles.logoContainer}>
                <HarmoniaIcon size={scale(56)} color={colors.primary} />
                <TextComponent variante="subtitle1" color={colors.text}>
                  Harmonia
                </TextComponent>
              </View>

              <TextComponent variante="body1" color={colors.text} style={styles.title}>
                Faites votre meilleur travail avec Harmonia
              </TextComponent>

              <ButtonComponent
                title="Continuer avec Google"
                onPress={handleContinueWithGoogle}
                variant="outline"
                size="lg"
                fullWidth
              />

              <View style={styles.separator}>
                <View style={styles.separatorLine} />
                <TextComponent variante="body5" color={colors.text2}>
                  OU
                </TextComponent>
                <View style={styles.separatorLine} />
              </View>

              <TextInput
                style={styles.emailInput}
                placeholder="Entrez votre email"
                placeholderTextColor={colors.text2}
                value={email}
                onChangeText={setEmail}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="email"
                returnKeyType="go"
                onSubmitEditing={handleEmailSubmit}
                maxFontSizeMultiplier={MAX_FONT_SCALE}
                accessibilityLabel="Adresse email"
              />

              <ButtonComponent
                title={isLoading ? 'Envoi en cours...' : 'Continuer'}
                onPress={handleEmailSubmit}
                disabled={!canSubmit}
                loading={isLoading}
                size="lg"
                fullWidth
              />
            </Animated.View>
          </Content>
        </ScrollView>

        <Animated.View style={{ opacity: fadeAnim }}>
          <Content style={styles.footer}>
            <TextComponent variante="body5" color={colors.text2} style={styles.termsText}>
              En continuant, vous acceptez les{' '}
              <TextComponent variante="body5" style={styles.linkText}>
                Conditions d&apos;utilisation
              </TextComponent>{' '}
              et{' '}
              <TextComponent variante="body5" style={styles.linkText}>
                Politique d&apos;utilisation
              </TextComponent>{' '}
              d&apos;Harmonia, et reconnaissez leur{' '}
              <TextComponent variante="body5" style={styles.linkText}>
                Politique de confidentialité
              </TextComponent>
              .
            </TextComponent>

            <TextComponent variante="caption" color={colors.text2} style={styles.companyName}>
              Harmonia · By Jemuel G. ANIFA
            </TextComponent>
          </Content>
        </Animated.View>
      </KeyboardAvoidingView>
    </Screen>
  );
}
