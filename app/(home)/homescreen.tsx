//(home)/homescreen.tsx

import { TextComponent } from "@/components/TextComponent";
import { StyleSheet, Text, View } from "react-native";
import { useThemeColors } from "@/hooks/useThemeColors";

export default function HomeScreen(){
    const colors = useThemeColors();

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
            justifyContent: "center",
            alignItems: "center",
        }
    });

    return(
        <View>
            <TextComponent color="">Hello</TextComponent>
        </View>
    )
}

