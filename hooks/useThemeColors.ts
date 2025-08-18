import { useColorScheme } from "react-native"
import { color } from "@/constants/color"
import { useAppStore } from "@/stores/appStore"

export function useThemeColors(){
    // Récupérer le thème depuis le store (pour override manuel)
    const { themeMode } = useAppStore()
    
    // Utiliser le thème système par défaut
    const systemTheme = useColorScheme() ?? 'dark'
    
    // Si themeMode est défini dans le store, l'utiliser, sinon utiliser le système
    const currentTheme = themeMode || systemTheme
    
    return color[currentTheme]
}