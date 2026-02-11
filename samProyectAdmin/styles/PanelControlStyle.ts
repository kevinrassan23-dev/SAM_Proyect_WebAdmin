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
    maxWidth: 480,
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
    borderRadius: 30,
    marginBottom: theme.spacing(2),
    alignItems: "center",
    justifyContent: "center",
},

buttonVolver: {
    backgroundColor: theme.colors.error,
    width: Platform.OS === "web" ? "100%" : "80%",
    maxWidth: Platform.OS === "web" ? 360 : undefined,
    flexDirection: "row",
    paddingVertical: theme.spacing(2),
    borderRadius: 30,
    marginBottom: theme.spacing(2),
    alignItems: "center",
    justifyContent: "center",
},

buttonText: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.large,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
},

formaPagoContainer: {
    flex: 1,
    flexDirection: "column",
    gap: 16,
    justifyContent: "center",
    alignItems: "center",

    ...(Platform.OS === "web" && {
    width: "100%",
    maxWidth: 480,
    }),
},
});