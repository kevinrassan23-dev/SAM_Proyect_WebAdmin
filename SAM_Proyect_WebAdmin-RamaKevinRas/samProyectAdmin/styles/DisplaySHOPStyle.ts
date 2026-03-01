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
      minHeight: "100vh" as any,
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

  subtitle: {
    fontSize: theme.fontSize.large,
    fontWeight: "bold",
    color: theme.colors.info,
    marginVertical: theme.spacing(2),
    textAlign: "center",
  },

  dataText: {
    fontSize: theme.fontSize.normal,
    color: theme.colors.textPrimary,
    marginVertical: theme.spacing(1),
    paddingHorizontal: theme.spacing(2),
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.success,
    paddingVertical: theme.spacing(1),
  },

  input: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: theme.colors.background,
    borderWidth: 2,
    borderColor: theme.colors.success,
    borderRadius: 8,
    padding: theme.spacing(1.5),
    fontSize: theme.fontSize.normal,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing(2),
  },

  inputFocused: {
      borderColor: theme.colors.primary,
      borderWidth: 2,
      shadowColor: theme.colors.primary,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
  },

  button: {
    backgroundColor: theme.colors.secondary,
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
      cursor: "pointer" as any,
      transition: "all 0.3s ease" as any,
    }),
  },

  buttonActive: {
    backgroundColor: theme.colors.secondary,
    ...(Platform.OS === "web" && {
      backgroundColor: theme.colors.secondary,
      boxShadow: `0 4px 12px rgba(0, 0, 0, 0.2)` as any,
    }),
  },

  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
    ...(Platform.OS === "web" && {
      backgroundColor: theme.colors.primary,
      boxShadow: `0 4px 12px rgba(0, 0, 0, 0.15)` as any,
    }),
  },

  buttonDisabled: {
    opacity: 0.5,
    ...(Platform.OS === "web" && {
      cursor: "not-allowed" as any,
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

  listContainer: {
    width: "100%",
    maxWidth: 500,
    height: Platform.OS === "web" ? 400 : "60%",
    borderWidth: 2,
    borderColor: theme.colors.success,
    borderRadius: 10,
    backgroundColor: theme.colors.background,
    paddingVertical: theme.spacing(1),
    marginBottom: theme.spacing(4),
    ...(Platform.OS === "web" && {
        width: "100%",
        maxWidth: 600,
        height: 500,
        marginBottom: theme.spacing(5),
        overflowY: "auto" as any,
        overflowX: "hidden" as any,
    }),
  },

  scrollContent: {
    paddingHorizontal: theme.spacing(2),
    ...(Platform.OS === "web" && {
        paddingHorizontal: theme.spacing(3),
    }),
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
      marginTop: theme.spacing(3),
    }),
  },

  tabla: {
    width: "100%",
    borderWidth: 1,
    borderColor: theme.colors.success,
    borderRadius: 8,
    overflow: "hidden",
  },

  filaTabla: {
      flexDirection: "row",
      alignItems: "center",
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.success,
      minHeight: 48,
  },

  filaUltima: {
      borderBottomWidth: 0,
  },

  labelTabla: {
      width: "40%",
      paddingHorizontal: theme.spacing(1.5),
      paddingVertical: theme.spacing(1),
      fontSize: theme.fontSize.small,
      fontWeight: "bold",
      color: theme.colors.textPrimary,
      backgroundColor: theme.colors.background,
      borderRightWidth: 1,
      borderRightColor: theme.colors.success,
  },

  inputTabla: {
      flex: 1,
      paddingHorizontal: theme.spacing(1.5),
      paddingVertical: theme.spacing(1),
      fontSize: theme.fontSize.normal,
      color: theme.colors.textPrimary,
      backgroundColor: "#fff",
  },

  inputTablaFocused: {
      backgroundColor: "#f0f8ff",
  },

  menuOpciones: {
  width: "100%",
  maxWidth: 360,
  backgroundColor: theme.colors.background,
  borderWidth: 1,
  borderColor: theme.colors.secondary,
  borderRadius: 10,
  marginBottom: theme.spacing(2),
  paddingVertical: theme.spacing(1),
  ...(Platform.OS === "web" && {
    width: "100%",
    maxWidth: 400,
  }),
},

menuItem: {
  flexDirection: "row",
  alignItems: "center",
  paddingVertical: theme.spacing(1.5),
  paddingHorizontal: theme.spacing(2),
  borderBottomWidth: 1,
  borderBottomColor: "#e0e0e0",
},

menuItemText: {
  marginLeft: theme.spacing(2),
  fontSize: theme.fontSize.normal,
  color: theme.colors.secondary,
  fontWeight: "500",
},
});