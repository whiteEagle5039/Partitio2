import { useLocalSearchParams, useRouter } from 'expo-router';
import { Mail } from 'lucide-react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Easing,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Vibration,
  View,
} from 'react-native';

import { Content, Screen } from '@/components/uxComponents/Screen';
import { ScreenHeader } from '@/components/uxComponents/ScreenHeader';
import { TextComponent } from '@/components/uxComponents/TextComponent';
import { MAX_FONT_SCALE, touchSlop } from '@/constants/layout';
import { useResponsive } from '@/hooks/useResponsive';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useAppStore } from '@/stores/appStore';

/** Pastille de marque (composant, donc en PascalCase). */
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

const CODE_LENGTH = 6;

export default function VerificationCodeScreen() {
  const colors = useThemeColors();
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>();
  const { spacing, radius, scale, fontSize } = useResponsive();
  const inputRef = useRef<TextInput>(null);

  const { setAuthenticated, setUser } = useAppStore();

  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => inputRef.current?.focus(), 500);
    return () => clearTimeout(timer);
  }, [fadeAnim]);

  const shakeAnimation = useCallback(() => {
    Vibration.vibrate(100);
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 100, useNativeDriver: true }),
    ]).start();
  }, [shakeAnim]);

  const handleVerifyCode = useCallback(
    (codeToVerify: string) => {
      if (codeToVerify.length !== CODE_LENGTH) return;

      setIsLoading(true);
      setError('');

      setTimeout(() => {
        setIsLoading(false);

        // Code de démonstration.
        if (codeToVerify === '123456') {
          setUser({
            id: '1',
            name: 'Owen',
            email: email || 'user@harmonia.com',
            storageUsed: 25.2,
            storageLimit: 100,
          });
          setAuthenticated(true);
          router.replace('/homescreen');
        } else {
          setError('Code incorrect. Réessayez.');
          setCode('');
          shakeAnimation();
          setTimeout(() => inputRef.current?.focus(), 100);
        }
      }, 1500);
    },
    [email, router, setAuthenticated, setUser, shakeAnimation],
  );

  const handleCodeChange = (text: string) => {
    const numericCode = text.replace(/[^0-9]/g, '').slice(0, CODE_LENGTH);
    setCode(numericCode);
    setError('');

    if (numericCode.length === CODE_LENGTH) {
      handleVerifyCode(numericCode);
    }
  };

  const styles = StyleSheet.create({
    scrollContent: {
      flexGrow: 1,
      justifyContent: 'center',
      paddingVertical: spacing.xl,
    },
    logoContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.sm,
      marginBottom: spacing.xxl,
    },
    title: {
      textAlign: 'center',
      marginBottom: spacing.xl,
    },
    codeInputContainer: {
      width: '100%',
      maxWidth: 320,
      alignSelf: 'center',
      marginBottom: spacing.lg,
    },
    codeInput: {
      minHeight: scale(56),
      borderRadius: radius.md,
      borderWidth: 2,
      borderColor: error ? colors.destructive : code.length > 0 ? colors.primary : colors.border,
      backgroundColor: error ? `${colors.destructive}10` : colors.card,
      paddingHorizontal: spacing.lg,
      fontSize: fontSize(20),
      color: colors.text,
      textAlign: 'center',
      letterSpacing: 6,
    },
    errorText: {
      textAlign: 'center',
      marginBottom: spacing.md,
    },
    emailInfo: {
      alignItems: 'center',
      gap: spacing.xs,
    },
    mailIcon: {
      width: scale(56),
      height: scale(56),
      borderRadius: radius.pill,
      backgroundColor: colors.card,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: spacing.xs,
    },
    loadingOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: `${colors.background}CC`,
      justifyContent: 'center',
      alignItems: 'center',
      gap: spacing.sm,
    },
  });

  return (
    <Screen edges={['top', 'left', 'right', 'bottom']}>
      <ScreenHeader bordered={false} onBack={() => router.back()} />

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

              <TextComponent variante="body2" color={colors.text} style={styles.title}>
                Entrez le code que nous avons envoyé à votre email
              </TextComponent>

              <Animated.View
                style={[styles.codeInputContainer, { transform: [{ translateX: shakeAnim }] }]}
              >
                <TextInput
                  ref={inputRef}
                  style={styles.codeInput}
                  value={code}
                  onChangeText={handleCodeChange}
                  placeholder="Code"
                  placeholderTextColor={colors.text2}
                  keyboardType="number-pad"
                  maxLength={CODE_LENGTH}
                  autoComplete="sms-otp"
                  textContentType="oneTimeCode"
                  maxFontSizeMultiplier={MAX_FONT_SCALE}
                  accessibilityLabel="Code de vérification à six chiffres"
                  autoFocus
                />
              </Animated.View>

              {!!error && (
                <TextComponent variante="body4" color={colors.destructive} style={styles.errorText}>
                  {error}
                </TextComponent>
              )}

              <View style={styles.emailInfo}>
                <View style={styles.mailIcon}>
                  <Mail size={22} color={colors.primary} />
                </View>

                <TextComponent variante="body4" color={colors.text2} style={{ textAlign: 'center' }}>
                  Nous avons envoyé un email à
                </TextComponent>

                <TextComponent variante="subtitle3" color={colors.text} numberOfLines={1}>
                  {email || 'votre@email.com'}
                </TextComponent>

                <TouchableOpacity
                  onPress={() => router.back()}
                  hitSlop={touchSlop}
                  style={{ paddingVertical: spacing.xs, paddingHorizontal: spacing.md }}
                  accessibilityRole="button"
                >
                  <TextComponent
                    variante="body4"
                    color={colors.primary}
                    style={{ textDecorationLine: 'underline' }}
                  >
                    Changer l&apos;adresse email
                  </TextComponent>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </Content>
        </ScrollView>
      </KeyboardAvoidingView>

      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={colors.primary} />
          <TextComponent variante="subtitle3" color={colors.text}>
            Vérification en cours...
          </TextComponent>
        </View>
      )}
    </Screen>
  );
}
