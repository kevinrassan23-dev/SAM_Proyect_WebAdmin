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

  labelSecundario: {
    fontSize: theme.fontSize.normal,
    fontWeight: "500",
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing(0.5),
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

  filtroFechas: {
    backgroundColor: "#f5f5f5",
    padding: theme.spacing(2),
    borderRadius: 8,
    marginBottom: theme.spacing(2),
  },

  button: {
    backgroundColor: theme.colors.secondary,
    width: "100%",
    maxWidth: 360,
    flexDirection: "row",
    paddingVertical: theme.spacing(2),
    borderRadius: 8,
    marginBottom: theme.spacing(2),
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    ...(Platform.OS === "web" && {
      width: "100%",
      maxWidth: 400,
      paddingVertical: theme.spacing(2.5),
      cursor: "pointer" as any,
      transition: "all 0.3s ease" as any,
    }),
  },

  buttonPrimary: {
    backgroundColor: theme.colors.primary,
  },

  buttonSecondary: {
    backgroundColor: theme.colors.secondary,
  },

  buttonSearch: {
    backgroundColor: theme.colors.primary,
  },

  buttonCancel: {
    backgroundColor: theme.colors.error,
  },

  buttonDisabled: {
    opacity: 0.5,
  },

  buttonPressed: {
    opacity: 0.8,
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

  resultadosContainer: {
    marginVertical: theme.spacing(2),
    width: "100%",
  },

  tarjeta: {
    backgroundColor: "#f9f9f9",
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
    padding: theme.spacing(2),
    marginVertical: theme.spacing(1),
    borderRadius: 8,
  },

  tarjetaTitulo: {
    fontSize: theme.fontSize.large,
    fontWeight: "bold",
    color: theme.colors.primary,
    marginBottom: theme.spacing(1),
  },

  tarjetaTexto: {
    fontSize: theme.fontSize.normal,
    color: theme.colors.textPrimary,
    marginVertical: theme.spacing(0.5),
  },

  botonesAccion: {
    flexDirection: "column",
    gap: 12,
    marginTop: theme.spacing(3),
    ...(Platform.OS === "web" && {
      gap: 16,
    }),
  },
});