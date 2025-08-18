import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  StatusBar,
  Animated,
  Easing,
  Vibration,
  TextInput
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Mail, Check, X } from 'lucide-react-native';
import { TextComponent } from '@/components/TextComponent';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAppStore } from '@/stores/appStore';

// Composant pour l'icône Partitio
const PartitioIcon = ({ size = 32, color }: { size?: number; color: string }) => (
  <View style={{
    width: size,
    height: size,
    backgroundColor: color,
    borderRadius: size / 2,
    justifyContent: 'center',
    alignItems: 'center',
  }}>
    <TextComponent variante="body0" color="#FFFFFF" style={{ fontWeight: 'bold' }}>
      P
    </TextComponent>
  </View>
);

export default function VerificationCodeScreen() {
  const colors = useThemeColors();
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>();
  const inputRef = useRef<TextInput>(null);
  
  // Récupérer les fonctions d'authentification depuis le store
  const { setAuthenticated, setUser } = useAppStore();
  
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [fadeAnim] = useState(new Animated.Value(0));
  const [shakeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    // Focus automatique sur l'input
    setTimeout(() => {
      inputRef.current?.focus();
    }, 500);
  }, []);

  const shakeAnimation = () => {
    Vibration.vibrate(100);
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  const handleCodeChange = (text: string) => {
    // Ne permettre que les chiffres et limiter à 6 caractères
    const numericCode = text.replace(/[^0-9]/g, '').slice(0, 6);
    setCode(numericCode);
    setError('');
    
    // Vérification automatique quand 6 chiffres sont saisis
    if (numericCode.length === 6) {
      handleVerifyCode(numericCode);
    }
  };

  const handleVerifyCode = async (codeToVerify = code) => {
    if (codeToVerify.length !== 6) return;
    
    setIsLoading(true);
    setError('');
    
    // Simulation de vérification
    setTimeout(() => {
      setIsLoading(false);
      
      // Code correct pour la démo : 123456
      if (codeToVerify === '123456') {
        // Succès - définir l'utilisateur comme authentifié
        const user = {
          id: '1',
          name: 'Owen',
          email: email || 'user@partitio.com',
          storageUsed: 25.2,
          storageLimit: 100,
        };
        
        // Mettre à jour le store
        setUser(user);
        setAuthenticated(true);
        
        // Navigation vers l'app
        router.replace('/homescreen');
      } else {
        // Erreur
        setError('Code incorrect. Réessayez.');
        setCode('');
        shakeAnimation();
        // Refocus sur l'input après l'erreur
        setTimeout(() => {
          inputRef.current?.focus();
        }, 100);
      }
    }, 1500);
  };

  const handleChangeEmail = () => {
    router.back();
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 16,
    },
    backButton: {
      padding: 8,
      marginRight: 16,
    },
    content: {
      flex: 1,
      paddingHorizontal: 24,
      alignItems: 'center',
    },
    logoContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 40,
      marginBottom: 60,
    },
    logoText: {
      marginLeft: 12,
      fontSize: 28,
      fontWeight: '600',
    },
    title: {
      textAlign: 'center',
      marginBottom: 40,
    },
    codeInputContainer: {
      marginBottom: 40,
      width: '100%',
      maxWidth: 300,
    },
    codeInput: {
      height: 56,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: colors.border,
      backgroundColor: colors.card,
      paddingHorizontal: 20,
      fontSize: 18,
      fontWeight: '500',
      color: colors.text,
      textAlign: 'center',
      letterSpacing: 4,
    },
    codeInputFocused: {
      borderColor: colors.primary,
    },
    codeInputError: {
      borderColor: colors.destructive,
      backgroundColor: colors.destructive + '10',
    },
    emailInfo: {
      alignItems: 'center',
      marginBottom: 30,
    },
    mailIcon: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: colors.card,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    emailText: {
      textAlign: 'center',
      marginBottom: 8,
    },
    emailAddress: {
      fontWeight: '600',
      marginBottom: 16,
    },
    changeEmailButton: {
      paddingVertical: 8,
      paddingHorizontal: 16,
    },
    changeEmailText: {
      color: colors.primary,
      textDecorationLine: 'underline',
    },
    errorText: {
      color: colors.destructive,
      textAlign: 'center',
      marginBottom: 20,
    },
    loadingOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: colors.background + 'AA',
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

  return (
    <View style={styles.container}>
      
      <SafeAreaView style={styles.container}>
        {/* Header avec bouton retour */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={colors.icon} />
          </TouchableOpacity>
        </View>

        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          {/* Logo et nom de l'app */}
          <View style={styles.logoContainer}>
            <PartitioIcon size={64} color={colors.primary} />
            <TextComponent style={styles.logoText} color={colors.text} variante='body1'>
              Partitio
            </TextComponent>
          </View>

          {/* Titre */}
          <TextComponent style={styles.title} color={colors.text} variante='body1'>
            Entrez le code que nous avons envoyé à votre email
          </TextComponent>

          {/* Input simple pour le code */}
          <Animated.View 
            style={[
              styles.codeInputContainer,
              { transform: [{ translateX: shakeAnim }] }
            ]}
          >
            <TextInput
              ref={inputRef}
              style={[
                styles.codeInput,
                code.length > 0 && !error && styles.codeInputFocused,
                error && styles.codeInputError
              ]}
              value={code}
              onChangeText={handleCodeChange}
              placeholder="Code"
              placeholderTextColor={colors.text2}
              keyboardType="numeric"
              maxLength={6}
              autoComplete="sms-otp"
              textContentType="oneTimeCode"
              autoFocus
            />
          </Animated.View>

          {/* Message d'erreur */}
          {error ? (
            <TextComponent variante="body3" style={styles.errorText}>
              {error}
            </TextComponent>
          ) : null}

          {/* Informations email */}
          <View style={styles.emailInfo}>
            <View style={styles.mailIcon}>
              <Mail size={24} color={colors.primary} />
            </View>
            <TextComponent variante="body2" style={styles.emailText}>
              Nous avons envoyé un email à
            </TextComponent>
            <TextComponent variante="subtitle2" style={styles.emailAddress} color={colors.text}>
              {email || 'votre@email.com'}
            </TextComponent>
            <TouchableOpacity 
              style={styles.changeEmailButton}
              onPress={handleChangeEmail}
            >
              <TextComponent variante="body2" style={styles.changeEmailText}>
                Changer l'adresse email
              </TextComponent>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Overlay de chargement */}
        {isLoading && (
          <View style={styles.loadingOverlay}>
            <TextComponent variante="subtitle2" color={colors.text}>
              Vérification en cours...
            </TextComponent>
          </View>
        )}
      </SafeAreaView>
    </View>
  );
}