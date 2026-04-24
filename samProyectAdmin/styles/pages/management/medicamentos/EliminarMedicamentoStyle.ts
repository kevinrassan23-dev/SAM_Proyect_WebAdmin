import { Platform, StyleSheet } from "react-native";
import theme from "@/theme/Theme";

export const styles = StyleSheet.create({
  outerScroll: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  outerScrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingVertical: theme.spacing(2),
    ...(Platform.OS === "web" && {
      paddingVertical: theme.spacing(3),
    }),
  },

  container: {
    flex: 1,
    padding: theme.spacing(2),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background,
    minHeight: "100vh" as any,
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
    marginVertical: theme.spacing(3),
    textAlign: "center",
    ...(Platform.OS === "web" && {
      fontSize: 32,
      marginVertical: theme.spacing(4),
    }),
  },

  formContainer: {
    width: "100%",
    maxWidth: 500,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: theme.spacing(3),
    ...(Platform.OS === "web" && {
      width: "100%",
      maxWidth: 600,
      padding: theme.spacing(4),
    }),
  },

  inputGroup: {
    marginBottom: theme.spacing(2),
  },

  label: {
    fontSize: theme.fontSize.normal,
    fontWeight: "600",
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing(1),
  },

  input: {
    borderWidth: 1,
    borderColor: theme.colors.success,
    borderRadius: 8,
    padding: theme.spacing(1.5),
    fontSize: theme.fontSize.normal,
    color: theme.colors.textPrimary,
    backgroundColor: theme.colors.background,
  },

  button: {
    backgroundColor: theme.colors.secondary,
    width: "100%",
    paddingVertical: theme.spacing(2),
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing(1),
    ...(Platform.OS === "web" && {
      paddingVertical: theme.spacing(2.5),
      cursor: "pointer" as any,
      transition: "all 0.3s ease" as any,
    }),
  },

  buttonSearch: {
    borderRadius: 30,
    backgroundColor: theme.colors.primary,
  },

  buttonDelete: {
    borderRadius: 30,
    backgroundColor: theme.colors.error,
  },

  buttonCancel: {
    borderRadius: 30,
    backgroundColor: theme.colors.error,
  },

  buttonText: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.large,
    fontWeight: "bold",
    textAlign: "center",
    ...(Platform.OS === "web" && {
      fontSize: 16,
    }),
  },

  tarjeta: {
    backgroundColor: "#f9f9f9",
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
    padding: theme.spacing(2),
    marginVertical: theme.spacing(1),
    borderRadius: 8,
  },

  tarjetaHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: theme.spacing(1),
  },

  tarjetaTitulo: {
    fontSize: theme.fontSize.large,
    fontWeight: "bold",
    color: theme.colors.primary,
  },

  tarjetaMarca: {
    fontSize: theme.fontSize.normal,
    color: "#666",
    marginTop: theme.spacing(0.5),
  },

  tipoBadge: {
    backgroundColor: "#4CAF50",
    paddingVertical: theme.spacing(0.5),
    paddingHorizontal: theme.spacing(1.5),
    borderRadius: 6,
  },

  tipoTexto: {
    color: "#fff",
    fontSize: theme.fontSize.normal,
    fontWeight: "bold",
  },

  tarjetaTexto: {
    fontSize: theme.fontSize.normal,
    color: theme.colors.textPrimary,
    marginVertical: theme.spacing(0.5),
  },

  advertenciaContainer: {
    backgroundColor: "#FFE6E6",
    borderLeftWidth: 4,
    borderLeftColor: "#FF6B6B",
    padding: theme.spacing(2),
    borderRadius: 8,
    marginVertical: theme.spacing(2),
  },

  advertencia: {
    fontSize: theme.fontSize.normal,
    color: "#FF6B6B",
    fontWeight: "bold",
    textAlign: "center",
  },

  botonesContainer: {
    flexDirection: "column",
    gap: 8,
    marginTop: theme.spacing(2),
  },
});