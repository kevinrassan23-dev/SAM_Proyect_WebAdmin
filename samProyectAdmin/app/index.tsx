import { Redirect } from "expo-router";
import React from "react";

/**
 * COMPONENTE RAÍZ DE NAVEGACIÓN
 * Redirige automáticamente al usuario a la página de Login de administradores.
 */
function Index() {
  return (
    // Importamos la ruta padre el índice de la aplicación como la primera que aparece
    <Redirect href="/pages/auth/LoginAdmin" />
  );
}

export default Index;