import { Platform, StyleSheet } from "react-native";
import theme from "../theme/Theme";

export const styles = StyleSheet.create({
container: {
    flex: 1,
    padding: theme.spacing(2),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background,

    // SOLO WEB
    ...(Platform.OS === "web" && {
    maxWidth: 600,
    marginHorizontal: "auto",
    }),
},

title: {
    fontSize: theme.fontSize.title,
    fontWeight: "bold",
    color: theme.colors.primary,
    marginVertical: theme.spacing(3),
    textAlign: "center",
},

button: {
    backgroundColor: theme.colors.secondary,
    width: Platform.OS === "web" ? "100%" : "80%",
    maxWidth: Platform.OS === "web" ? 360 : undefined,
    flexDirection: "row",
    paddingVertical: theme.spacing(2),
    borderRadius: 10,
    marginBottom: theme.spacing(2),
    alignItems: "center",
    justifyContent: "center",
},

buttonText: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.large,
    fontWeight: "bold",
    textAlign: "center",
},

input: {
    width: Platform.OS === "web" ? "100%" : "80%",
    maxWidth: Platform.OS === "web" ? 360 : undefined,
    backgroundColor: theme.colors.background,
    borderWidth: 2,
    borderColor: theme.colors.success,
    borderRadius: 8,
    padding: theme.spacing(1.5),
    fontSize: theme.fontSize.normal,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing(2),
},

listContainer: {
    width: Platform.OS === "web" ? "100%" : "70%",
    maxWidth: Platform.OS === "web" ? 500 : undefined,
    height: Platform.OS === "web" ? 400 : "60%",
    borderWidth: 2,
    borderColor: theme.colors.success,
    borderRadius: 10,
    backgroundColor: theme.colors.background,
    paddingVertical: theme.spacing(1),
},

scrollContent: {
    paddingHorizontal: theme.spacing(2),
},

vista: {
    flexDirection: "column",
    gap: 16,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
},
});