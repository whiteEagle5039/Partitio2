/**
 * Palette de couleurs moderne pour Partitio
 * Basée exactement sur les couleurs de Claude d'Anthropic
 */
const tintColorLight = '#D97757';
const tintColorDark = '#E8A288';

export const color = {
  light: {
    // Arrière-plans
    background2: "#FEFDFB",
    background: "#F8F6F4", 
    foreground: "#2D2A26",
    
    // Cartes
    card: "#FFFFFF",
    card2: "#F8F6F4",
    cardForeground: "#2D2A26",
    validated: '#059669',
    
    // Popover
    popover: "#FFFFFF",
    popoverForeground: "#2D2A26",
    
    // Couleurs principales - Exactement comme Claude
    primary: "#D97757",      // Primary de Claude
    primary2: "#CC6B43",     // Primary Dark de Claude
    primary3: "#E8A288",     // Primary Light de Claude
    blueSingle: "#8B7355",   // Secondary de Claude
    primaryForeground: "#FFFFFF",
    
    // Secondaire
    secondary: "#F0EDE8",
    secondaryForeground: "#6B6660",
    
    // Muted
    muted: "#F0EDE8",
    mutedForeground: "#6B6660",
    
    // Accent
    accent: "#E07B4A",
    accentForeground: "#FFFFFF",
    
    // Destructive
    destructive: "#DC2626",
    destructiveForeground: "#FFFFFF",
    
    // Bordures et inputs
    border: "#E6E2DC",
    borderGreen: "#059669",
    input: "#F8F6F4",
    submit: "#D97757",
    ring: "#E8A288",
    
    radius: 12,
    
    // Texte
    text: '#2D2A26',
    text2: '#6B6660',
    tint: tintColorLight,
    icon: '#6B6660',
    tabIconDefault: '#8B7355',
    tabIconSelected: tintColorLight,
    
    // Couleurs d'accent
    orange: "#D4652F",
    jaune: "#E07B4A", 
    pink: "#E89B72",
    
    // Couleurs spécifiques à l'app musicale
    note: "#D97757",
    staff: "#E6E2DC",
    sharp: "#059669",
    flat: "#DC2626"
  },
  dark: {
    // Arrière-plans
    background: "#1A1A1A",
    background2: "#262626",
    foreground: "#F5F3F0",
    
    // Cartes
    card: "#262626",
    card2: "#333333",
    cardForeground: "#F5F3F0",
    validated: '#10B981',
    
    // Popover
    popover: "#262626",
    popoverForeground: "#F5F3F0",
    
    // Couleurs principales - Version dark de Claude
    primary: "#D97757",
    primary2: "#E8A288",
    primary3: "#F2C4AB",
    blueSingle: "#A68D73",
    primaryForeground: "#1A1A1A",
    
    // Secondaire
    secondary: "#333333",
    secondaryForeground: "#B8B5B0",
    
    // Muted
    muted: "#333333",
    mutedForeground: "#B8B5B0",
    
    // Accent
    accent: "#F2A366",
    accentForeground: "#1A1A1A",
    
    // Destructive
    destructive: "#EF4444",
    destructiveForeground: "#F5F3F0",
    
    // Bordures et inputs
    border: "#404040",
    borderGreen: '#10B981',
    input: "#333333",
    submit: "#E8A288",
    ring: "#F2C4AB",
    
    radius: 12,
    
    // Texte
    text: '#F5F3F0',
    text2: '#B8B5B0',
    tint: tintColorDark,
    icon: '#B8B5B0',
    tabIconDefault: '#8B7355',
    tabIconSelected: tintColorDark,
    
    // Couleurs d'accent
    orange: "#E8914A",
    jaune: "#F5B885", 
    pink: "#F2A366",
    
    // Couleurs spécifiques à l'app musicale
    note: "#F2A366",
    staff: "#404040",
    sharp: "#34D399",
    flat: "#F87171"
  }
}