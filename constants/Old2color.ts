/**
 * Palette de couleurs moderne pour Partitio
 * Inspirée du design de Claude - tons légers et sophistiqués
 */
const tintColorLight = '#D97706';
const tintColorDark = '#F59E0B';

export const color = {
  light: {
    // Arrière-plans
    background: "#FEFEFE",
    background2: "#F9FAFB", 
    foreground: "#111827",
    
    // Cartes
    card: "#FFFFFF",
    card2: "#F9FAFB",
    cardForeground: "#374151",
    validated: '#059669',
    
    // Popover
    popover: "#FFFFFF",
    popoverForeground: "#111827",
    
    // Couleurs principales - Thème musical avec tons chaleureux
    primary: "#D97706",      // Amber/Orange principal comme Claude
    primary2: "#DC2626",     // Rouge accent
    primary3: "#7C3AED",     // Violet accent
    blueSingle: "#0891B2",   // Cyan plus doux
    primaryForeground: "#FFFFFF",
    
    // Secondaire
    secondary: "#F3F4F6",
    secondaryForeground: "#4B5563",
    
    // Muted
    muted: "#F3F4F6",
    mutedForeground: "#6B7280",
    
    // Accent
    accent: "#FEF3C7",
    accentForeground: "#92400E",
    
    // Destructive
    destructive: "#DC2626",
    destructiveForeground: "#FFFFFF",
    
    // Bordures et inputs
    border: "#E5E7EB",
    borderGreen: "#059669",
    input: "#F9FAFB",
    submit: "#D97706",
    ring: "#FCD34D",
    
    radius: 12,
    
    // Texte
    text: '#111827',
    text2: '#6B7280',
    tint: tintColorLight,
    icon: '#6B7280',
    tabIconDefault: '#9CA3AF',
    tabIconSelected: tintColorLight,
    
    // Couleurs d'accent
    orange: "#EA580C",
    jaune: "#D97706", 
    pink: "#EC4899",
    
    // Couleurs spécifiques à l'app musicale
    note: "#D97706",
    staff: "#E5E7EB",
    sharp: "#059669",
    flat: "#DC2626"
  },
  dark: {
    // Arrière-plans
    background: "#0F0F10",
    background2: "#1C1C1E",
    foreground: "#F9FAFB",
    
    // Cartes
    card: "#1C1C1E",
    card2: "#2D2D30",
    cardForeground: "#E5E7EB",
    validated: '#10B981',
    
    // Popover
    popover: "#1C1C1E",
    popoverForeground: "#F9FAFB",
    
    // Couleurs principales - Plus douces en mode sombre
    primary: "#F59E0B",
    primary2: "#F87171",
    primary3: "#A78BFA",
    blueSingle: "#22D3EE",
    primaryForeground: "#111827",
    
    // Secondaire
    secondary: "#2D2D30",
    secondaryForeground: "#D1D5DB",
    
    // Muted
    muted: "#2D2D30",
    mutedForeground: "#9CA3AF",
    
    // Accent
    accent: "#451A03",
    accentForeground: "#FEF3C7",
    
    // Destructive
    destructive: "#EF4444",
    destructiveForeground: "#F9FAFB",
    
    // Bordures et inputs
    border: "#3F3F46",
    borderGreen: '#10B981',
    input: "#2D2D30",
    submit: "#F59E0B",
    ring: "#FCD34D",
    
    radius: 12,
    
    // Texte
    text: '#F9FAFB',
    text2: '#9CA3AF',
    tint: tintColorDark,
    icon: '#9CA3AF',
    tabIconDefault: '#6B7280',
    tabIconSelected: tintColorDark,
    
    // Couleurs d'accent
    orange: "#FB923C",
    jaune: "#FBBF24", 
    pink: "#F472B6",
    
    // Couleurs spécifiques à l'app musicale
    note: "#FCD34D",
    staff: "#3F3F46",
    sharp: "#34D399",
    flat: "#F87171"
  }
}