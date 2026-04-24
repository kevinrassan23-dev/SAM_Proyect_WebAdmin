import { Platform, StyleSheet } from "react-native";
import theme from "@/theme/Theme";

/**
 * Estilos para pantallas de error, estados vacíos o páginas no encontradas.
 * Centra el contenido visualmente y destaca códigos de error numéricos.
 */
export const styles = StyleSheet.create({
  // Contenedor centrado para mensajes de error
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },

  // Contenedor para animaciones (Lottie/GIF)
  animation: {
    width: 220,
    height: 220,
    marginBottom: 16,
  },

  // Texto destacado (ej. "404")
  codigo: {
    fontSize: 72,
    fontWeight: "bold",
    color: theme.colors.secondary,
    letterSpacing: 4,
    ...(Platform.OS === "web" && {
      fontSize: 90 as any,
    }),
  },

  // Título principal del error
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.colors.textPrimary,
    marginTop: 8,
    textAlign: "center",
    ...(Platform.OS === "web" && {
      fontSize: 28 as any,
    }),
  },

  // Descripción detallada del problema
  descripcion: {
    fontSize: 15,
    color: "#888",
    marginTop: 12,
    textAlign: "center",
    maxWidth: 320,
    lineHeight: 22,
  },

  // Botón de retorno o acción correctiva
  button: {
    marginTop: 32,
    backgroundColor: theme.colors.secondary,
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    ...(Platform.OS === "web" && {
      cursor: "pointer" as any,
      transition: "all 0.3s ease" as any,
    }),
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

console.log(`[${new Date().toLocaleTimeString()}] ErrorStyles inicializados correctamente.`);