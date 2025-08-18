/**
 * Palette de couleurs moderne pour Partitio
 * Thème musical avec des tons sophistiqués
 */
const tintColorLight = '#6366F1';
const tintColorDark = '#A5B4FC';

export const color = {
  light: {
    // Arrière-plans
    background: "#FAFAFA",
    background2: "#F8FAFC", 
    foreground: "#1E293B",
    
    // Cartes
    card: "#FFFFFF",
    card2: "#F1F5F9",
    cardForeground: "#334155",
    validated: '#10B981',
    
    // Popover
    popover: "#FFFFFF",
    popoverForeground: "#1E293B",
    
    // Couleurs principales - Thème musical
    primary: "#6366F1",      // Indigo moderne
    primary2: "#8B5CF6",     // Violet
    primary3: "#EC4899",     // Rose
    blueSingle: "#06B6D4",   // Cyan
    primaryForeground: "#FFFFFF",
    
    // Secondaire
    secondary: "#F1F5F9",
    secondaryForeground: "#475569",
    
    // Muted
    muted: "#F8FAFC",
    mutedForeground: "#64748B",
    
    // Accent
    accent: "#EEF2FF",
    accentForeground: "#4338CA",
    
    // Destructive
    destructive: "#EF4444",
    destructiveForeground: "#FFFFFF",
    
    // Bordures et inputs
    border: "#E2E8F0",
    borderGreen: "#10B981",
    input: "#F1F5F9",
    submit: "#6366F1",
    ring: "#A5B4FC",
    
    radius: 12,
    
    // Texte
    text: '#1E293B',
    text2: '#64748B',
    tint: tintColorLight,
    icon: '#64748B',
    tabIconDefault: '#94A3B8',
    tabIconSelected: tintColorLight,
    
    // Couleurs d'accent
    orange: "#F97316",
    jaune: "#EAB308", 
    pink: "#EC4899",
    
    // Couleurs spécifiques à l'app musicale
    note: "#6366F1",
    staff: "#E2E8F0",
    sharp: "#059669",
    flat: "#DC2626"
  },
  dark: {
    // Arrière-plans
    background: "#0F172A",
    background2: "#1E293B",
    foreground: "#F1F5F9",
    
    // Cartes
    card: "#1E293B",
    card2: "#334155",
    cardForeground: "#F1F5F9",
    validated: '#10B981',
    
    // Popover
    popover: "#1E293B",
    popoverForeground: "#F1F5F9",
    
    // Couleurs principales
    primary: "#8B5CF6",
    primary2: "#A855F7",
    primary3: "#F472B6",
    blueSingle: "#22D3EE",
    primaryForeground: "#0F172A",
    
    // Secondaire
    secondary: "#334155",
    secondaryForeground: "#CBD5E1",
    
    // Muted
    muted: "#334155",
    mutedForeground: "#94A3B8",
    
    // Accent
    accent: "#312E81",
    accentForeground: "#C7D2FE",
    
    // Destructive
    destructive: "#DC2626",
    destructiveForeground: "#F1F5F9",
    
    // Bordures et inputs
    border: "#475569",
    borderGreen: "#10B981",
    input: "#334155",
    submit: "#8B5CF6",
    ring: "#A5B4FC",
    
    radius: 12,
    
    // Texte
    text: '#F1F5F9',
    text2: '#94A3B8',
    tint: tintColorDark,
    icon: '#94A3B8',
    tabIconDefault: '#64748B',
    tabIconSelected: tintColorDark,
    
    // Couleurs d'accent
    orange: "#FB923C",
    jaune: "#FDE047", 
    pink: "#F472B6",
    
    // Couleurs spécifiques à l'app musicale
    note: "#A5B4FC",
    staff: "#475569",
    sharp: "#34D399",
    flat: "#F87171"
  }
}