import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  KeyboardAvoidingView, 
  Platform,
  StatusBar,
  Animated,
  Easing
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { TextComponent } from '@/components/TextComponent';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useRouter } from 'expo-router';

// Composant pour l'icône Partitio (remplace l'étoile Claude)
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

export default function EmailAuthScreen() {
  const colors = useThemeColors();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, []);

  const handleContinueWithGoogle = () => {
    console.log('Continue with Google');
    // Logique d'authentification Google
  };

  const handleEmailSubmit = async () => {
    if (!email.trim()) return;
    
    setIsLoading(true);
    
    // Simulation d'envoi d'email
    setTimeout(() => {
      setIsLoading(false);
      // Navigation vers la page de code de vérification
      router.push(`/verification?email=${encodeURIComponent(email)}`);
    }, 2000);
  };

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
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
      justifyContent: 'center',
    },
    logoContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 60,
    },
    logoText: {
      marginLeft: 12,
    },
    title: {
      textAlign: 'center',
      marginBottom: 48,
      lineHeight: 42,
    },
    googleButton: {
      backgroundColor: colors.card,
      borderRadius: 25,
      paddingVertical: 16,
      paddingHorizontal: 24,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 24,
      borderWidth: 1,
      borderColor: colors.border,
      elevation: 1,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
    },
    googleIcon: {
      width: 20,
      height: 20,
      marginRight: 12,
    },
    separator: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 24,
    },
    separatorLine: {
      flex: 1,
      height: 1,
      backgroundColor: colors.border,
    },
    separatorText: {
      marginHorizontal: 16,
      opacity: 0.6,
    },
    emailInput: {
      backgroundColor: colors.card,
      borderRadius: 12,
      paddingVertical: 16,
      paddingHorizontal: 16,
      fontSize: 16,
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 24,
    },
    emailInputFocused: {
      borderColor: colors.primary,
      borderWidth: 2,
    },
    continueButton: {
      backgroundColor: colors.primary,
      borderRadius: 25,
      paddingVertical: 16,
      alignItems: 'center',
      marginBottom: 32,
      opacity: 1,
    },
    continueButtonDisabled: {
      opacity: 0.5,
    },
    continueButtonLoading: {
      backgroundColor: colors.primary2,
    },
    footer: {
      paddingHorizontal: 24,
      paddingBottom: 32,
    },
    termsText: {
      textAlign: 'center',
      lineHeight: 20,
      opacity: 0.7,
    },
    linkText: {
      color: colors.primary,
      textDecorationLine: 'underline',
    },
    companyName: {
      textAlign: 'center',
      marginTop: 40,
      opacity: 0.5,
      letterSpacing: 2,
    },
  });

  return (
    <View style={styles.container}>
      
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView 
          style={styles.content}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <Animated.View style={{ opacity: fadeAnim }}>
            {/* Logo et nom de l'app */}
            <View style={styles.logoContainer}>
              <PartitioIcon size={64} color={colors.primary} />
              <TextComponent style={styles.logoText} color={colors.text} variante='body1'>
                Partitio
              </TextComponent>
            </View>

            {/* Titre principal */}
            <TextComponent variante="body2" style={styles.title}>
              Faites votre meilleur travail avec Partitio
            </TextComponent>

            {/* Bouton Google */}
            <TouchableOpacity 
              style={styles.googleButton}
              onPress={handleContinueWithGoogle}
              activeOpacity={0.8}
            >
              <View style={styles.googleIcon}>
                {/* Icône Google simplifiée */}
                <View style={{
                  width: 18,
                  height: 18,
                  borderRadius: 10,
                  backgroundColor: colors.cardForeground,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  {/* <TextComponent variante="subtitle3" color={colors.primaryForeground} style={{ fontWeight: 'bold' }}>
                    G
                  </TextComponent> */}
                </View>
              </View>
              <TextComponent variante="subtitle2" color={colors.text}>
                Continuer avec Google
              </TextComponent>
            </TouchableOpacity>

            {/* Séparateur */}
            <View style={styles.separator}>
              <View style={styles.separatorLine} />
              <TextComponent variante="body3" style={styles.separatorText}>
                OU
              </TextComponent>
              <View style={styles.separatorLine} />
            </View>

            {/* Champ email */}
            <TextInput
              style={[
                styles.emailInput,
                email && isValidEmail(email) && styles.emailInputFocused
              ]}
              placeholder="Entrez votre email"
              placeholderTextColor={colors.text2}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
            />

            {/* Bouton Continuer */}
            <TouchableOpacity 
              style={[
                styles.continueButton,
                (!email || !isValidEmail(email)) && styles.continueButtonDisabled,
                isLoading && styles.continueButtonLoading
              ]}
              onPress={handleEmailSubmit}
              disabled={!email || !isValidEmail(email) || isLoading}
              activeOpacity={0.8}
            >
              <TextComponent variante="subtitle2" color={colors.primaryForeground}>
                {isLoading ? 'Envoi en cours...' : 'Continuer'}
              </TextComponent>
            </TouchableOpacity>
          </Animated.View>
        </KeyboardAvoidingView>

        {/* Footer avec conditions */}
        <Animated.View style={[styles.footer, { opacity: fadeAnim }]}>
          <TextComponent variante="body4" style={styles.termsText}>
            En continuant, vous acceptez les{' '}
            <TextComponent variante="body4" style={styles.linkText}>
              Conditions d'utilisation
            </TextComponent>
            {' '}et{' '}
            <TextComponent variante="body4" style={styles.linkText}>
              Politique d'utilisation
            </TextComponent>
            {' '}de Partitio, et reconnaissez leur{' '}
            <TextComponent variante="body4" style={styles.linkText}>
              Politique de confidentialité
            </TextComponent>
            .
          </TextComponent>
          
          <TextComponent variante="body4" style={styles.companyName}>
            PARTITIO * By Jemuel G. ANIFA
          </TextComponent>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}