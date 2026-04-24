import React, { useEffect, useRef, useState } from "react";
import { View, Text, Pressable } from "react-native";
import { router } from "expo-router";
import LottieView from "lottie-react-native";
import { styles } from "@/styles/pages/common/PageErrorStyle";
import { adminAuthService } from "@/services/supabase";

/**
 * UTILERÍA: Genera un timestamp actual para los logs
 */
const getTimestamp = () => new Date().toLocaleString();

/**
 * COMPONENTE DE ERROR / ACCESO DENEGADO
 * Se encarga de mostrar una animación de error y redirigir al usuario
 * al lugar correspondiente según su estado de sesión.
 */
function PageError() {
  const animationRef = useRef<LottieView>(null);
  const [destino, setDestino] = useState<string | null>(null);

  useEffect(() => {
    // 1. Iniciar animación visual
    animationRef.current?.play();

    // 2. Verificar sesión para determinar la ruta de retorno
    const session = adminAuthService.checkSession();
    const rutaDestino = session
      ? "/pages/management/pedidos/MostrarPedidos"
      : "/pages/auth/LoginAdmin";

    setDestino(rutaDestino);

    console.log(`[${getTimestamp()}] Vista de error cargada. Destino de retorno configurado: ${rutaDestino}`);
  }, []);

  /**
   * Ejecuta la redirección basada en el estado de autenticación detectado
   */
  const volver = () => {
    if (destino) {
      console.log(`[${getTimestamp()}] Redirigiendo desde error hacia: ${destino}`);
      router.replace(destino as any);
    }
  };

  return (
    <View style={styles.container}>
      {/* Animación Lottie de error */}
      <LottieView
        ref={animationRef}
        source={require("@/assets/lottie/ErrorIcon.json")}
        autoPlay
        loop
        style={styles.animation}
      />

      {/* Información del Error */}
      <Text style={styles.codigo}>404</Text>
      <Text style={styles.titulo}>Pagina no encontrada</Text>
      <Text style={styles.descripcion}>
        La ruta que intentas acceder no existe o no esta disponible en este momento.
      </Text>

      {/* Botón de Acción Dinámico */}
      <Pressable style={styles.button} onPress={volver}>
        <Text style={styles.buttonText}>
          {destino === "/pages/management/pedidos/MostrarPedidos"
            ? "VOLVER AL INICIO"
            : "IR AL LOGIN"}
        </Text>
      </Pressable>
    </View>
  );
}

export default PageError;