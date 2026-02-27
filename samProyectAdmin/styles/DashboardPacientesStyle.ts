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
    marginVertical: theme.spacing(3),
    textAlign: "center",
    ...(Platform.OS === "web" && {
      fontSize: 32,
      marginVertical: theme.spacing(4),
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
    alignItems: "center",
    justifyContent: "center",
    ...(Platform.OS === "web" && {
      cursor: "pointer",
      transition: "all 0.3s ease",
      width: "100%",
      maxWidth: 400,
      paddingVertical: theme.spacing(2.5),
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

  buttonText: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.large,
    fontWeight: "bold",
    textAlign: "center",
    ...(Platform.OS === "web" && {
      fontSize: 16,
    }),
  },

input: {
  width: "100%",
  maxWidth: 360,
  backgroundColor: theme.colors.background,
  borderWidth: 2,
  borderColor: theme.colors.success,
  borderRadius: 8,
  padding: theme.spacing(1.5),
  fontSize: theme.fontSize.normal,
  color: theme.colors.textPrimary,
  marginBottom: theme.spacing(2),
  ...(Platform.OS === "web" && {
      width: "100%",
      maxWidth: 400,
      padding: theme.spacing(2),
      fontSize: 16,
      borderWidth: 1,
      borderColor: "#ddd",
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
    marginBottom: theme.spacing(4), // ← Agrega esto
    ...(Platform.OS === "web" && {
      width: "100%",
      maxWidth: 600,
      height: 500,
      overflowY: "auto",
      marginBottom: theme.spacing(5),
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

buttonActive: {
    backgroundColor: theme.colors.success,
    ...(Platform.OS === "web" && {
      backgroundColor: theme.colors.success,
      boxShadow: `0 4px 12px rgba(0, 0, 0, 0.2)`,
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
    ...(Platform.OS === "web" && {
      width: "100%",
      maxWidth: 600,
      marginHorizontal: "auto",
      paddingHorizontal: theme.spacing(4),
    }),
  },

  // NUEVAS CLASES PARA WEB
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: theme.spacing(3),
    width: "100%",
    maxWidth: 500,
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
    marginBottom: theme.spacing(3),
    ...(Platform.OS === "web" && {
      marginBottom: theme.spacing(4),
    }),
  },

  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.background,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: theme.spacing(2),
    ...(Platform.OS === "web" && {
      width: 100,
      height: 100,
      borderRadius: 50,
    }),
  },

  iconText: {
    fontSize: 48,
    ...(Platform.OS === "web" && {
      fontSize: 56,
    }),
  },

  form: {
    width: "100%",
    ...(Platform.OS === "web" && {
      width: "100%",
    }),
  },

  inputGroup: {
    marginBottom: theme.spacing(2),
    ...(Platform.OS === "web" && {
      marginBottom: theme.spacing(3),
    }),
  },

  label: {
    fontSize: theme.fontSize.normal,
    fontWeight: "600",
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing(1),
    ...(Platform.OS === "web" && {
      fontSize: 14,
      marginBottom: theme.spacing(1),
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
    ...(Platform.OS === "web" && {
      marginBottom: theme.spacing(2),
      padding: theme.spacing(2),
    }),
  },

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
});