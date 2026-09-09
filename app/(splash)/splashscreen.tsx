// (splash)/splashscreen.tsx

import SplashScreenIcon from "@/components/uxComponents/SplashScreenIcon";
import TextComponent from "@/components/uxComponents/TextComponent";
import { elevation } from "@/constants/layout";
import { useResponsive } from "@/hooks/useResponsive";
import { useThemeColors } from "@/hooks/useThemeColors";
import { useAppStore } from "@/stores/appStore";
import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";

export default function SplashScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const { spacing, scale, height } = useResponsive();

  // Le logo suit la taille de l'écran (petit téléphone ↔ tablette).
  const iconSize = scale(32, 0.8);
  
  // Récupérer l'état d'authentification depuis le store
  const { isAuthenticated, user } = useAppStore();
  
  // Animations refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  
  // Animations pour les icônes individuelles
  const icon1Scale = useRef(new Animated.Value(0)).current;
  const icon2Scale = useRef(new Animated.Value(0)).current;
  const icon3Scale = useRef(new Animated.Value(0)).current;
  const icon4Scale = useRef(new Animated.Value(0)).current;
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      justifyContent: "center",
      alignItems: "center",
    },
    titleContainer: {
      marginBottom: spacing.xxl,
    },
    iconsContainer: {
      alignItems: "center",
      justifyContent: "center",
      marginBottom: spacing.xxl,
    },
    iconRow: {
      flexDirection: "row",
      gap: spacing.sm,
      marginVertical: spacing.xxs,
    },
    iconWrapper: elevation(2),
    loadingIndicator: {
      flexDirection: "row",
      gap: spacing.xs,
      position: "absolute",
      // Proportionnel à la hauteur : reste visible du petit téléphone à la tablette.
      bottom: Math.max(spacing.xxl, height * 0.1),
    },
    loadingDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      opacity: 0.7,
    },
  });
  
  useEffect(() => {
    // Animation séquentielle
    const startAnimations = () => {
      // Fade in et scale du titre
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 800,
          easing: Easing.out(Easing.back(1.5)),
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 800,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        })
      ]).start();

      // Animation des icônes avec délai
      setTimeout(() => {
        Animated.stagger(150, [
          Animated.timing(icon1Scale, {
            toValue: 1,
            duration: 600,
            easing: Easing.out(Easing.back(1.2)),
            useNativeDriver: true,
          }),
          Animated.timing(icon2Scale, {
            toValue: 1,
            duration: 600,
            easing: Easing.out(Easing.back(1.2)),
            useNativeDriver: true,
          }),
          Animated.timing(icon3Scale, {
            toValue: 1,
            duration: 600,
            easing: Easing.out(Easing.back(1.2)),
            useNativeDriver: true,
          }),
          Animated.timing(icon4Scale, {
            toValue: 1,
            duration: 600,
            easing: Easing.out(Easing.back(1.2)),
            useNativeDriver: true,
          })
        ]).start();
      }, 400);

      // Rotation continue des icônes
      setTimeout(() => {
        Animated.loop(
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 3000,
            easing: Easing.linear,
            useNativeDriver: true,
          })
        ).start();
      }, 1000);

      // Pulse animation
      setTimeout(() => {
        Animated.loop(
          Animated.sequence([
            Animated.timing(pulseAnim, {
              toValue: 1.1,
              duration: 1000,
              easing: Easing.inOut(Easing.sin),
              useNativeDriver: true,
            }),
            Animated.timing(pulseAnim, {
              toValue: 1,
              duration: 1000,
              easing: Easing.inOut(Easing.sin),
              useNativeDriver: true,
            })
          ])
        ).start();
      }, 1200);
    };

    startAnimations();

    // Navigation avec vérification d'authentification
    const timer = setTimeout(() => {
      // Vérifier si l'utilisateur est authentifié
      if (isAuthenticated && user) {
        // Utilisateur connecté -> aller vers homescreen
        router.replace("/homescreen");
      } else {
        // Utilisateur non connecté -> aller vers l'authentification
        router.replace("/email");
      }
    }, 4000);

    return () => clearTimeout(timer);
  }, [isAuthenticated, user, router]);

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      {/* Titre avec animation */}
      <Animated.View
        style={[
          styles.titleContainer,
          {
            opacity: fadeAnim,
            transform: [
              { scale: scaleAnim },
              { translateY: slideAnim }
            ],
          },
        ]}
      >
        <TextComponent variante="header" color={colors.text}>Harmonia</TextComponent>
      </Animated.View>

      {/* Container des icônes avec rotation globale */}
      <Animated.View
        style={[
          styles.iconsContainer,
          {
            transform: [
              { rotate: rotateInterpolate },
              { scale: pulseAnim }
            ],
          },
        ]}
      >
        {/* Première rangée */}
        <View style={styles.iconRow}>
          <Animated.View
            style={[
              styles.iconWrapper,
              {
                transform: [{ scale: icon1Scale }],
              },
            ]}
          >
            <SplashScreenIcon 
              width={iconSize}
              height={iconSize}
              fillColor={colors.primary}
            />
          </Animated.View>
          
          <Animated.View
            style={[
              styles.iconWrapper,
              {
                transform: [{ scale: icon2Scale }],
              },
            ]}
          >
            <SplashScreenIcon 
              width={iconSize}
              height={iconSize}
              fillColor={colors.primary2}
            />
          </Animated.View>
        </View>

        {/* Deuxième rangée */}
        <View style={styles.iconRow}>
          <Animated.View
            style={[
              styles.iconWrapper,
              {
                transform: [{ scale: icon3Scale }],
              },
            ]}
          >
            <SplashScreenIcon 
              width={iconSize}
              height={iconSize}
              fillColor={colors.primary2}
            />
          </Animated.View>
          
          <Animated.View
            style={[
              styles.iconWrapper,
              {
                transform: [{ scale: icon4Scale }],
              },
            ]}
          >
            <SplashScreenIcon 
              width={iconSize}
              height={iconSize}
              fillColor={colors.primary}
            />
          </Animated.View>
        </View>
      </Animated.View>

      {/* Indicateur de chargement subtil */}
      <Animated.View
        style={[
          styles.loadingIndicator,
          {
            opacity: fadeAnim,
          },
        ]}
      >
        <View style={[styles.loadingDot, { backgroundColor: colors.primary }]} />
        <View style={[styles.loadingDot, { backgroundColor: colors.primary2 }]} />
        <View style={[styles.loadingDot, { backgroundColor: colors.primary }]} />
      </Animated.View>
    </View>
  );
}

