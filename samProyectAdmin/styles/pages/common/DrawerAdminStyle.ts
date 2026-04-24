import { Platform, StyleSheet } from "react-native";
import theme from "@/theme/Theme";

/**
 * Estilos para el componente de Navegación Lateral (Drawer).
 * Incluye la gestión del overlay, el panel lateral y elementos de menú colapsables.
 */
export const styles = StyleSheet.create({
  // Botón disparador del menú
  hamburgerButton: {
    padding: 8,
    marginLeft: 4,
    justifyContent: "center",
    alignItems: "center",
    ...(Platform.OS === "web" && {
      cursor: "pointer" as any,
    }),
  },

  // Capa oscura de fondo al abrir el menú
  overlay: {
    position: "absolute" as any,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    zIndex: 99998,
    ...(Platform.OS === "web" && {
      position: "fixed" as any,
      height: "100vh" as any,
      width: "100vw" as any,
    }),
  },

  // Panel lateral deslizante
  drawer: {
    position: "absolute" as any,
    top: 0,
    left: 0,
    width: 290,
    backgroundColor: "#ffffff",
    zIndex: 99999,
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 20,
    ...(Platform.OS === "web" && {
      position: "fixed" as any,
      height: "100vh" as any,
    }),
  },

  // Encabezado del Drawer
  drawerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
    paddingVertical: 25,
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  drawerTitle: {
    color: theme.colors.secondary,
    fontSize: 22,
    fontWeight: "bold",
  },

  // Cuerpo del menú
  drawerContent: {
    flex: 1,
  },

  // Cabeceras de sección colapsables
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    ...(Platform.OS === "web" && {
      cursor: "pointer" as any,
    }),
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 1,
  },

  // Submenús y Elementos de lista
  subMenuHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: "#f9f9f9",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    ...(Platform.OS === "web" && {
      cursor: "pointer" as any,
    }),
  },
  subMenuLabel: {
    flex: 1,
    color: theme.colors.secondary,
    fontSize: 14,
    fontWeight: "600",
  },
  itemButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 45,
    paddingVertical: 10,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#fafafa",
    ...(Platform.OS === "web" && {
      cursor: "pointer" as any,
    }),
  },
  itemLabel: {
    color: "#666",
    fontSize: 13,
  },

  // Botón de cierre de sesión
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 18,
    margin: 20,
    borderRadius: 8,
    backgroundColor: theme.colors.error,
    ...(Platform.OS === "web" && {
      cursor: "pointer" as any,
    }),
  },
  logoutLabel: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});

console.log(`[${new Date().toLocaleTimeString()}] DrawerStyles cargados exitosamente.`);