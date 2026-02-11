import { Platform, StyleSheet } from "react-native";
import theme from "../theme/Theme";

export const styles = StyleSheet.create({
    header: {
        position: Platform.OS === "web" ? "relative" : "absolute",

        top: Platform.OS === "web" ? 0 : 40,
        right: Platform.OS === "web" ? 0 : 20,

        height: Platform.OS === "web" ? 80 : 60,
        width: "100%",

        backgroundColor: theme.colors.background,
        alignItems: "flex-end",
        justifyContent: "center",

        paddingRight: Platform.OS === "web" ? 24 : 10,
        paddingTop: Platform.OS === "web" ? 16 : 0,

        zIndex: 10,

        // SOLO WEB → centramos el contenido
        ...(Platform.OS === "web" && {
        maxWidth: 1200,
        marginHorizontal: "auto",
        }),
    },

    logo: {
        width: Platform.OS === "web" ? 140 : 100,
        height: Platform.OS === "web" ? 60 : 60,
        resizeMode: "contain",
    },

});