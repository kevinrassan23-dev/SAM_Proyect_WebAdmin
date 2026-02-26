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

  textArea: {
    minHeight: 80,
    textAlignVertical: "top",
  },

  familiaSelector: {
    borderWidth: 1,
    borderColor: theme.colors.success,
    borderRadius: 8,
    backgroundColor: theme.colors.background,
    paddingVertical: theme.spacing(1),
  },

  familiaScroll: {
    paddingHorizontal: theme.spacing(1),
  },

  familiaButton: {
    paddingVertical: theme.spacing(0.75),
    paddingHorizontal: theme.spacing(1.5),
    borderRadius: 6,
    marginHorizontal: theme.spacing(0.5),
    backgroundColor: "#f5f5f5",
    borderWidth: 1,
    borderColor: theme.colors.secondary,
  },

  familiaButtonActive: {
    backgroundColor: theme.colors.secondary,
    borderColor: theme.colors.secondary,
  },

  familiaButtonText: {
    fontSize: theme.fontSize.normal,
    color: theme.colors.secondary,
    fontWeight: "500",
  },

  familiaButtonTextActive: {
    color: "#fff",
  },

  tipoSelector: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "space-between",
  },

  tipoButton: {
    flex: 1,
    flexDirection: "row",
    paddingVertical: theme.spacing(1.5),
    paddingHorizontal: theme.spacing(1),
    borderWidth: 1,
    borderColor: theme.colors.secondary,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
    gap: 6,
  },

  tipoButtonActive: {
    backgroundColor: theme.colors.secondary,
    borderColor: theme.colors.secondary,
  },

  tipoButtonText: {
    fontSize: theme.fontSize.normal,
    color: theme.colors.secondary,
    fontWeight: "500",
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
    flexDirection: "row",
    paddingVertical: theme.spacing(1.5),
    borderWidth: 1,
    borderColor: theme.colors.secondary,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
    gap: 6,
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

  resumenContainer: {
    backgroundColor: "#f0f7ff",
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
    padding: theme.spacing(2),
    borderRadius: 8,
    marginVertical: theme.spacing(2),
  },

  resumenTitulo: {
    fontSize: theme.fontSize.large,
    fontWeight: "bold",
    color: theme.colors.primary,
    marginBottom: theme.spacing(1),
  },

  resumenContent: {
    gap: theme.spacing(1),
  },

  resumenFila: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: theme.spacing(0.5),
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },

  resumenLabel: {
    fontSize: theme.fontSize.normal,
    fontWeight: "600",
    color: theme.colors.textPrimary,
  },

  resumenValor: {
    fontSize: theme.fontSize.normal,
    color: theme.colors.secondary,
    fontWeight: "500",
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

  buttonInsert: {
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