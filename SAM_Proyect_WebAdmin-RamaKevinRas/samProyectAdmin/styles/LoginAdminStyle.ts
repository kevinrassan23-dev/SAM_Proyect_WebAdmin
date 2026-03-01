import { Platform, StyleSheet } from "react-native";
import theme from "../theme/Theme";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f0f4f8",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    card: {
        backgroundColor: "#ffffff",
        borderRadius: 20,
        padding: 40,
        width: "100%",
        maxWidth: 450,
        shadowColor: "#000",
        shadowOffset: {
        width: 0,
        height: 4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
    header: {
        alignItems: "center",
        marginBottom: 40,
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: "#e3f2fd",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 20,
    },
    iconText: {
        fontSize: 40,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: theme.colors.secondary,
        marginBottom: 8,
        textAlign: "center",
    },
    subtitle: {
        fontSize: 15,
        color: "#666",
        textAlign: "center",
    },
    form: {
        marginBottom: 30,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: "600",
        color: theme.colors.textPrimary,
        marginBottom: 8,
    },
    input: {
        backgroundColor: theme.colors.background,
        borderWidth: 2,
        borderColor: theme.colors.success,
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        color: "#1a1a1a",
    },

    error: {
        fontSize: 14,
        color: '#dc3545',
        marginBottom: 12,
        paddingHorizontal: 8,
        fontWeight: '500',
        backgroundColor: '#ffe6e6',
        padding: 10,
        borderRadius: 6,
        borderLeftWidth: 4,
        borderLeftColor: '#dc3545',
    },

    inputError: {
        borderColor: theme.colors.error,
    },

    button: {
        backgroundColor: theme.colors.secondary,
        width: Platform.OS === "web" ? "100%" : "80%",
        maxWidth: Platform.OS === "web" ? 360 : undefined,
        flexDirection: "row",
        paddingVertical: theme.spacing(2),
        borderRadius: 30,
        marginBottom: theme.spacing(2),
        alignItems: "center",
        justifyContent: "center",
    },
    
    buttonPressed: {
        backgroundColor: "#0051D5",
        transform: [{ scale: 0.98 }],
    },
    buttonDisabled: {
        backgroundColor: "#ccc",
        shadowOpacity: 0,
    },
    buttonText: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "bold",
        letterSpacing: 0.5,
    },
    footer: {
        alignItems: "center",
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: "#e1e4e8",
    },
    footerText: {
        fontSize: 13,
        color: "#999",
    },
});