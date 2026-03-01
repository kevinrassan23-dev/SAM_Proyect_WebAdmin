import { Platform, StyleSheet } from "react-native";
import theme from "../theme/Theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing(2),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background,

    ...(Platform.OS === "web" && {
      width: "100%",
      maxWidth: "100%",
      padding: theme.spacing(3),

    }),
  },

  title: {
    fontSize: theme.fontSize.title,
    fontWeight: "bold",
    color: theme.colors.secondary,
    textAlign: "center",
    marginBottom: 0.1,
    ...(Platform.OS === "web" && {
        fontSize: 32,
        marginBottom: 0.1,
    }),
  },

  button: {
    backgroundColor: theme.colors.secondary,
    width: "100%",
    maxWidth: 360,
    flexDirection: "row",
    paddingVertical: theme.spacing(2),
    borderRadius: 30,
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(0.1),
    alignItems: "center",
    justifyContent: "center",
    ...(Platform.OS === "web" && {
        width: "100%",
        maxWidth: 400,
        paddingVertical: theme.spacing(2.5),
        marginTop: theme.spacing(0.1),
        cursor: "pointer",
        transition: "all 0.3s ease",
    }),
  },

  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
    ...(Platform.OS === "web" && {
      backgroundColor: theme.colors.primary,
      boxShadow: `0 4px 12px rgba(0, 0, 0, 0.15)`,
    }),
  },

  buttonVolver: {
    backgroundColor: theme.colors.error,
    width: "100%",
    maxWidth: 360,
    flexDirection: "row",
    paddingVertical: theme.spacing(2),
    borderRadius: 30,
    marginBottom: theme.spacing(2),
    alignItems: "center",
    justifyContent: "center",
    ...(Platform.OS === "web" && {
      width: "100%",
      maxWidth: 400,
      paddingVertical: theme.spacing(2.5),
      cursor: "pointer",
      transition: "all 0.3s ease",
    }),
  },

  buttonVolverPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
    ...(Platform.OS === "web" && {
      backgroundColor: "#c82333",
      boxShadow: `0 4px 12px rgba(200, 35, 51, 0.3)`,
    }),
  },

  buttonText: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.large,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
    ...(Platform.OS === "web" && {
      fontSize: 16,
    }),
  },

  panelControlContainer: {
    flex: 1,
    flexDirection: "column",
    gap: 16,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    ...(Platform.OS === "web" && {
      width: "100%",
      maxWidth: 600,
      marginHorizontal: "auto",
      paddingHorizontal: theme.spacing(4),
      gap: 20,
    }),
  },

  // CLASES ADICIONALES PARA MEJOR ORGANIZACIÓN WEB
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: theme.spacing(3),
    width: "100%",
    maxWidth: 480,
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    ...(Platform.OS === "web" && {
      width: "100%",
      maxWidth: 600,
      padding: theme.spacing(4),
      boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
    }),
  },

  header: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: theme.spacing(1),
    ...(Platform.OS === "web" && {
      marginBottom: theme.spacing(1),
    }),
  },

  content: {
    width: "100%",
    ...(Platform.OS === "web" && {
      width: "100%",
      maxWidth: 600,
      marginHorizontal: "auto",
    }),
  },

  buttonGroup: {
    width: "100%",
    gap: 12,
    ...(Platform.OS === "web" && {
      gap: 16,
      marginTop: theme.spacing(2),
    }),
  },
});