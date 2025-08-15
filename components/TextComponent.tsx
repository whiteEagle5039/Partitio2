import { useThemeColors } from "@/hooks/useThemeColors";
import { useFonts } from "expo-font";
import React from "react";
import { Text, TextProps, StyleSheet, StyleProp, TextStyle } from "react-native";

const stylles = StyleSheet.create({ 
    body5: {  fontSize: 17 },
    body4: {  fontSize: 15 },
    body3: {  fontSize: 17, lineHeight: 20 }, 
    body2: {  fontSize: 18, lineHeight: 20, fontWeight: "bold" }, 
    headline: {  fontSize: 16, lineHeight: 32, fontWeight: "bold" },  
    caption: { fontSize: 12, lineHeight: 15 },  
    subtitle0: {   fontSize: 32, lineHeight:32, fontWeight:"bold"},
    subtitle1: {  fontSize: 24, lineHeight: 24, fontWeight: "bold" }, 
    subtitle2: {  fontSize: 17, lineHeight: 16, fontWeight: "bold" }, 
    subtitle3: {  fontSize: 14, lineHeight: 16, fontWeight: "bold" }, 
});
    
type Props = TextProps & {
    color?: string, 
    variante?: keyof typeof stylles, 
    children?: React.ReactNode, 
    style?: StyleProp<TextStyle>
};

export function TextComponent({ variante, color, style, ...rest }: Props) {
    const colors = useThemeColors();

    const [fontsLoaded] = useFonts({
        'StyreneB-Regular': require('../assets/fonts/StyreneB-Regular-Trial-BF63f6cbe9db1d5.otf'),
    });

    return (
        <Text style={[ stylles[variante ?? "body3"], { color: color ?? colors.text },style]} {...rest}/>
    );
}