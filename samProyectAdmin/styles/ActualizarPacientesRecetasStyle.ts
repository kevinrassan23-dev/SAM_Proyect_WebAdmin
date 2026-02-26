import { Platform, StyleSheet } from "react-native";
import theme from "../theme/Theme";

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
    color: theme.colors.primary,
    marginVertical: theme.spacing(3),
    textAlign: "center",
    ...(Platform.OS === "web" && {
      fontSize: 32,
      marginVertical: theme.spacing(4),
    }),
  },

  subtitle: {
    fontSize: theme.fontSize.large,
    fontWeight: "bold",
    color: theme.colors.primary,
    marginVertical: theme.spacing(2),
    textAlign: "center",
  },

  vista: {
    flexDirection: "column",
    gap: 16,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginTop: theme.spacing(2),
    ...(Platform.OS === "web" && {
      width: "100%",
      maxWidth: 600,
      marginHorizontal: "auto",
      paddingHorizontal: theme.spacing(4),
      gap: 20,
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

  inputReadonly: {
    backgroundColor: "#f0f0f0",
    color: "#999",
  },

  textArea: {
    minHeight: 80,
    textAlignVertical: "top",
  },

  tipoSelector: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "space-between",
  },

  tipoButton: {
    flex: 1,
    paddingVertical: theme.spacing(1),
    paddingHorizontal: theme.spacing(1),
    borderWidth: 1,
    borderColor: theme.colors.secondary,
    borderRadius: 6,
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },

  tipoButtonActive: {
    backgroundColor: theme.colors.secondary,
    borderColor: theme.colors.secondary,
  },

  tipoButtonText: {
    fontSize: theme.fontSize.normal,
    color: theme.colors.secondary,
    fontWeight: "500",
    textTransform: "capitalize",
  },

  tipoButtonTextActive: {
    color: "#fff",
  },

  toggleContainer: {
    flexDirection: "row",
    gap: 8,
  },

  toggleButton: {
    flex: 1,
    paddingVertical: theme.spacing(1.5),
    borderWidth: 1,
    borderColor: theme.colors.secondary,
    borderRadius: 6,
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },

  toggleButtonActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },

  toggleText: {
    fontSize: theme.fontSize.normal,
    color: theme.colors.secondary,
    fontWeight: "500",
  },

  toggleTextActive: {
    color: "#fff",
  },

  encontradoInfo: {
    backgroundColor: "#e8f5e9",
    borderLeftWidth: 4,
    borderLeftColor: "#4CAF50",
    padding: theme.spacing(2),
    borderRadius: 6,
    marginVertical: theme.spacing(2),
  },

  encontradoTitulo: {
    fontSize: theme.fontSize.normal,
    fontWeight: "bold",
    color: "#2e7d32",
    marginBottom: theme.spacing(0.5),
  },

  encontradoTexto: {
    fontSize: theme.fontSize.normal,
    color: "#2e7d32",
  },

  button: {
    backgroundColor: theme.colors.secondary,
    width: "100%",
    maxWidth: 360,
    flexDirection: "row",
    paddingVertical: theme.spacing(2),
    borderRadius: 8,
    marginBottom: theme.spacing(1),
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    ...(Platform.OS === "web" && {
      width: "100%",
      maxWidth: "100%",
      paddingVertical: theme.spacing(2.5),
      cursor: "pointer" as any,
      transition: "all 0.3s ease" as any,
    }),
  },

  buttonUpdate: {
    backgroundColor: "#FF9800",
  },

  buttonSearch: {
    backgroundColor: theme.colors.primary,
  },

  buttonSecondary: {
    backgroundColor: theme.colors.secondary,
  },

  buttonCancel: {
    backgroundColor: theme.colors.error,
  },

  buttonDisabled: {
    opacity: 0.5,
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

  errorText: {
    fontSize: 14,
    color: "#dc3545",
    marginBottom: theme.spacing(2),
    paddingHorizontal: theme.spacing(1),
    fontWeight: "500",
    backgroundColor: "#ffe6e6",
    padding: theme.spacing(1.5),
    borderRadius: 6,
    borderLeftWidth: 4,
    borderLeftColor: "#dc3545",
  },

  botonesContainer: {
    marginTop: theme.spacing(2),
    gap: 8,
  },
});