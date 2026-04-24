import React, { useState, useEffect } from "react";
import { View, Image, Text } from "react-native";
import { Stack, usePathname, router } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from "@/styles/pages/common/LayoutStyle";
import DrawerAdmin from "@/components/DrawerAdmin";
import theme from "@/theme/Theme";

/**
 * UTILERÍA: Genera un timestamp actual para los logs
 */
const getTimestamp = () => new Date().toLocaleString();

type RolAdmin = 'SHOP_ADMIN' | 'GOV_ADMIN' | 'SYSTEM_ADMIN' | 'ADMIN_OWNER';

function RootLayout() {
  const SAM_LOGO = require("@/assets/images/sam_logo.png") as number;
  const pathname = usePathname();

  // --- Estados de Autenticación y Perfil ---
  const [rol, setRol] = useState<RolAdmin>('SHOP_ADMIN');
  const [nombreAdmin, setNombreAdmin] = useState("");
  const [verificado, setVerificado] = useState(false);

  // Determina si se debe ocultar el Header (Login y raíz no lo muestran)
  const hideHeader = pathname === "/pages/auth/LoginAdmin" || pathname === "/";

  useEffect(() => {
    console.log(`[${getTimestamp()}] Verificando sesion en ruta: ${pathname}`);

    /**
     * CARGA DE SESIÓN ASÍNCRONA
     * ── Relee AsyncStorage en cada cambio de ruta para reflejar
     * ── siempre el administrador que acaba de autenticarse
     */
    Promise.all([
      AsyncStorage.getItem('adminId'),
      AsyncStorage.getItem('adminRol'),
      AsyncStorage.getItem('adminNombre'),
    ]).then(([id, rolGuardado, nombre]) => {

      // Verificación de seguridad: Si no hay ID y no estamos en Login, redirigir a error
      if (!hideHeader) {
        if (!id) {
          console.log(`[${getTimestamp()}] Intento de acceso no autorizado. ID no encontrado.`);
          setTimeout(() => {
            router.push("/pages/common/PageError");
          }, 500);
          return;
        }
      }

      // ── Actualiza nombre y rol con los datos del admin que inició sesión
      if (rolGuardado) {
        setRol(rolGuardado as RolAdmin);
        console.log(`[${getTimestamp()}] Rol detectado: ${rolGuardado}`);
      }

      if (nombre) {
        setNombreAdmin(nombre);
        console.log(`[${getTimestamp()}] Nombre detectado: ${nombre}`);
      }

      setVerificado(true);
    }).catch(err => {
      console.log(`[${getTimestamp()}] Error al recuperar sesion: ${err}`);
    });

  // ── pathname como dependencia garantiza re-lectura tras cada navegación,
  // ── incluido el router.replace de LoginAdmin → MostrarPedidos
  }, [pathname]);

  // PREVENT RENDER: No renderiza contenido protegido hasta verificar sesión
  if (!verificado && !hideHeader) return null;

  return (
    <View style={styles.container}>
      {/* Contenedor Principal de la Pila de Navegación */}
      <View style={[styles.content, hideHeader && styles.contentFullHeight]}>
        <Stack screenOptions={{ headerShown: false }} />
      </View>

      {/* Renderizado condicional del Header Superior */}
      {!hideHeader && (
        <View style={styles.header}>
          {/* Menú Lateral Dinámico según Rol */}
          <DrawerAdmin rol={rol} />

          {/* Mensaje de Bienvenida (Solo visible en la vista de Pedidos) */}
          {pathname === "/pages/management/pedidos/MostrarPedidos" && (
            <Text style={{
              position: 'absolute' as any,
              left: 0,
              right: 0,
              textAlign: 'center',
              fontSize: 16,
              fontWeight: 'bold',
              color: theme.colors.secondary,
              pointerEvents: 'none' as any,
            }}>
              Bienvenid@{nombreAdmin ? `, ${nombreAdmin} 👋` : ''}
            </Text>
          )}

          {/* Logotipo de la Aplicación */}
          <Image source={SAM_LOGO} style={styles.logo} />
        </View>
      )}
    </View>
  );
}

export default RootLayout;