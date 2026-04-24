import { Platform, StyleSheet } from "react-native";
import theme from "@/theme/Theme";

/**
 * Estilos para la barra de navegación superior (Header).
 * Implementa posicionamiento fijo/absoluto para mantenerse persistente durante el scroll.
 */
export const styles = StyleSheet.create({
  // Contenedor principal de la vista con flujo vertical
  container: {
    flex: 1,
    flexDirection: "column",
    overflow: "visible" as any,
  },

  // Barra superior con soporte para 'fixed' en Web y 'absolute' en Mobile
  header: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute" as any,
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100, 
    ...(Platform.OS === "web" && {
      width: "100%" as any,
      paddingVertical: 16,
      paddingHorizontal: 24,
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)" as any,
      minHeight: 70,
      position: "fixed" as any,
    }),
  },

  // Logo institucional
  logo: {
    width: 120,
    height: 40,
    resizeMode: "contain",
    marginLeft: "auto",
    ...(Platform.OS === "web" && {
      width: 150 as any,
      height: 50 as any,
      marginRight: 20 as any,
    }),
  },

  // Área de contenido con compensación de margen para no quedar oculto bajo el header
  content: {
    flex: 1,
    marginTop: 72,
    ...(Platform.OS === "web" && {
      width: "100%" as any,
      marginTop: 70 as any,
    }),
  },

  // Variante para contenido que requiere ocupar toda la pantalla sin margen
  contentFullHeight: {
    marginTop: 0,
  },
});

console.log(`[${new Date().toLocaleTimeString()}] HeaderStyles cargados (Offset aplicado: 72px)`);