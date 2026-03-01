import { Platform, StyleSheet } from "react-native";
import theme from "../theme/Theme";

export const styles = StyleSheet.create({
    container: {
    flex: 1,
  },

  header: {
    backgroundColor: "#fff",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
    ...(Platform.OS === "web" && {
      width: "100%" as any,
      paddingVertical: 16,
      paddingHorizontal: 24,
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)" as any,
      minHeight: 70,
    }),
  },

  logo: {
    width: 120,
    height: 40,
    resizeMode: "contain",
    marginLeft: "auto",
    ...(Platform.OS === "web" && {
      width: 150 as any,
      height: 50 as any,
      marginLeft: "auto" as any,
      marginRight: 20 as any,
    }),
  },

  content: {
    flex: 1,
    ...(Platform.OS === "web" && {
      flex: 1,
      width: "100%" as any,
      marginTop: 70 as any,
    }),
  },

  contentFullHeight: {
    marginTop: 0,
  },
});