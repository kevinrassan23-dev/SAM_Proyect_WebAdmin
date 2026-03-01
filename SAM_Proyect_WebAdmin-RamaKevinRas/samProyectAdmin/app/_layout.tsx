import React from "react";

// HEADER APP BAR 
import { View, Image } from "react-native";
import { Stack } from "expo-router";
import { usePathname } from "expo-router";
import { styles } from "../styles/LayoutStyle";

function RootLayout() {
  const SAM_LOGO = require("../assets/images/sam_logo.png");
  const pathname = usePathname();

  const hideHeader = pathname === "/pages/LoginAdmin" || pathname === "/";

  return (
    <View style={styles.container}>
      {!hideHeader && (
        <View style={styles.header}>
          <Image source={SAM_LOGO} style={styles.logo} />
        </View>
      )}

      <View style={[styles.content, hideHeader && styles.contentFullHeight]}>
        <Stack screenOptions={{ headerShown: false }} />
      </View>
    </View>
  );
}

export default RootLayout;