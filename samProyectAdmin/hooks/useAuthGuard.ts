import { useEffect } from "react";
import { router } from "expo-router";
import { adminAuthService } from "@/services/supabase";

/**
 * HOOK DE PROTECCIÓN DE RUTAS (AUTH GUARD)
 * Se encarga de verificar la sesión del administrador y redirigir
 * en caso de acceso no autorizado.
 */
export function useAuthGuard() {
  useEffect(() => {
    /**
     * SINCRONIZACIÓN DE MONTAJE
     * Se utiliza un breve delay (100ms) para asegurar que el Layout 
     * de Expo Router esté completamente montado antes de intentar 
     * ejecutar una navegación de reemplazo (router.replace).
     */
    const timeout = setTimeout(() => {
      // 1. Verificación de la sesión actual mediante el servicio de Supabase
      const session = adminAuthService.checkSession();

      // 2. Redirección si no existe una sesión activa
      if (!session) {
        console.warn("Acceso denegado: Sesión no encontrada.");
        router.replace("/pages/common/PageError");
      }
    }, 100);

    // Limpieza del timeout para evitar fugas de memoria si el componente se desmonta
    return () => clearTimeout(timeout);
  }, []);
}