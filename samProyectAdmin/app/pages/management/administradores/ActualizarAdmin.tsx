import React, { useState, useEffect, useRef } from "react";
import { View, Text, TextInput, Pressable, ScrollView, ActivityIndicator, Platform } from "react-native";
import { router } from "expo-router";
import { styles } from "@/styles/pages/management/administradores/ActualizarAdminStyle";
import { adminService } from "@/services/supabase/admin";
import { Administrador } from "@/types/Admin";
import { useAuthGuard } from "@/hooks/useAuthGuard";

/**
 * UTILERIA: Genera un timestamp actual para los logs
 */
const getTimestamp = () => new Date().toLocaleString();

/**
 * FUNCIONES DE DIALOGO SISTEMA
 */
const confirmar = (mensaje: string, onConfirm: () => void) => {
  if (Platform.OS === "web") {
    if (window.confirm(mensaje)) onConfirm();
  } else {
    const { Alert } = require("react-native");
    Alert.alert("Confirmar", mensaje, [
      { text: "Cancelar", style: "cancel" },
      { text: "Si", onPress: onConfirm },
    ]);
  }
};

const alertar = (titulo: string, mensaje: string) => {
  if (Platform.OS === "web") {
    window.alert(`${titulo}\n\n${mensaje}`);
  } else {
    const { Alert } = require("react-native");
    Alert.alert(titulo, mensaje, [{ text: "OK" }]);
  }
};

// CONFIGURACION DE ROLES DISPONIBLES
const ROLES = [
  { value: 'SHOP_ADMIN',   label: 'Shop Admin',   desc: 'Solo tienda' },
  { value: 'SYSTEM_ADMIN', label: 'System Admin', desc: 'Administradores y tienda' },
] as const;

function ActualizarAdmin() {
  useAuthGuard();

  // --- Estados de Control ---
  const [encontrado, setEncontrado] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [busquedaTermino, setBusquedaTermino] = useState("");

  // --- Datos del Administrador ---
  const [adminOriginal, setAdminOriginal] = useState<Omit<Administrador, 'password'> | null>(null);
  const [idActual, setIdActual] = useState<number | null>(null);
  const [emailActual, setEmailActual] = useState("");
  const [nombre, setNombre] = useState("");
  const [rol, setRol] = useState<'SHOP_ADMIN' | 'GOV_ADMIN' | 'SYSTEM_ADMIN' | 'ADMIN_OWNER'>('SHOP_ADMIN');
  const [nuevaPassword, setNuevaPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");

  /**
   * Ejecuta la busqueda del administrador en el servicio
   */
  const handleBuscar = async () => {
    setLoading(true);
    setError("");
    console.log(`[${getTimestamp()}] Iniciando busqueda: ${busquedaTermino}`);

    try {
      if (busquedaTermino.trim() === "") {
        setError("Ingresa un ID o correo electronico");
        setLoading(false);
        return;
      }

      const todosAdmins = await adminService.obtenerTodos();

      if (todosAdmins.length === 0) {
        setError("No hay administradores registrados");
        setLoading(false);
        return;
      }

      const terminoSeguro = busquedaTermino.trim().toLowerCase();
      const adminEncontrado = todosAdmins.find(admin =>
        admin.email.toLowerCase() === terminoSeguro ||
        admin.id.toString() === terminoSeguro ||
        (admin.nombre ?? "").toLowerCase().includes(terminoSeguro)
      );

      if (adminEncontrado) {
        // ── Bloquear edición de roles privilegiados
        if (adminEncontrado.rol === 'GOV_ADMIN' || adminEncontrado.rol === 'ADMIN_OWNER') {
          setError("Este administrador no puede ser modificado desde el panel.");
          setEncontrado(false);
          setLoading(false);
          return;
        }

        console.log(`[${getTimestamp()}] Administrador encontrado: ID ${adminEncontrado.id}`);
        setAdminOriginal(adminEncontrado);
        cargarDatosFormulario(adminEncontrado);
        setEncontrado(true);
        setError("");
      } else {
        console.log(`[${getTimestamp()}] Administrador no encontrado para el termino: ${busquedaTermino}`);
        setError("Administrador no encontrado");
        setEncontrado(false);
      }
    } catch (err: any) {
      console.log(`[${getTimestamp()}] Error en busqueda: ${err.message}`);
      setError(err.message || "Error al buscar administrador");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Carga los datos recuperados en los estados del formulario
   */
  const cargarDatosFormulario = (admin: Omit<Administrador, 'password'>) => {
    setIdActual(admin.id);
    setEmailActual(admin.email);
    setNombre(admin.nombre ?? "");
    setRol(admin.rol ?? 'SHOP_ADMIN');
    setNuevaPassword("");
    setConfirmarPassword("");
  };
  
  /**
   * Validación de formato de contraseña
   */
  const validarPassword = (password: string): string | null => {
    if (password.length < 8) return "La contraseña debe tener al menos 8 caracteres.";
    if (!/[A-Z]/.test(password)) return "Debe contener al menos una letra mayúscula.";
    if (!/[a-z]/.test(password)) return "Debe contener al menos una letra minúscula.";
    if (!/[0-9]/.test(password)) return "Debe contener al menos un número.";
    if (!/[^A-Za-z0-9]/.test(password)) return "Debe contener al menos un símbolo especial.";
    return null;
};

  /**
   * Validacion de campos antes de enviar
   */
  const validarFormulario = (): string | null => {
    if (!nombre.trim()) return "Nombre es requerido";
    if (nuevaPassword.length > 0) {
      const errorPassword = validarPassword(nuevaPassword);
      if (errorPassword) return errorPassword;
      if (nuevaPassword !== confirmarPassword) return "Las contraseñas no coinciden";
    }
    return null;
  };

  /**
   * Persistencia de los cambios en la base de datos
   */
  const ejecutarActualizar = async () => {
    const validacionError = validarFormulario();
    if (validacionError) { 
      setError(validacionError); 
      return; 
    }
    if (!idActual) return;

    setLoading(true);
    setError("");
    console.log(`[${getTimestamp()}] Ejecutando actualizacion para ID: ${idActual}`);

    try {
      // Actualizar datos de perfil
      await adminService.actualizarAdmin(idActual, nombre, rol);

      // Actualizar contrasena solo si se ha introducido una nueva
      if (nuevaPassword.length > 0) {
        console.log(`[${getTimestamp()}] Actualizando tambien contrasena para ID: ${idActual}`);
        await adminService.actualizarPassword(idActual, nuevaPassword);
      }

      console.log(`[${getTimestamp()}] Registro actualizado exitosamente`);
      alertar("Exito", "Administrador actualizado correctamente.");
      limpiarFormulario();
    } catch (err: any) {
      console.log(`[${getTimestamp()}] Error en actualizacion: ${err.message}`);
      setError(err.message || "Error al actualizar administrador");
    } finally {
      setLoading(false);
    }
  };

  const handleActualizar = () => {
    confirmar("¿Estas seguro de que deseas actualizar este administrador?", ejecutarActualizar);
  };

  const limpiarFormulario = () => {
    setBusquedaTermino("");
    setAdminOriginal(null);
    setIdActual(null);
    setEmailActual("");
    setNombre("");
    setRol('SHOP_ADMIN');
    setNuevaPassword("");
    setConfirmarPassword("");
    setError("");
    setEncontrado(false);
  };

  const deshacerCambios = () => {
    if (adminOriginal) {
      console.log(`[${getTimestamp()}] Cambios revertidos a valores originales`);
      cargarDatosFormulario(adminOriginal);
      setError("");
    }
  };

  const volver = () => {
    router.push("/pages/management/pedidos/MostrarPedidos");
  };

  return (
    <ScrollView style={styles.outerScroll} contentContainerStyle={styles.outerScrollContent}>
      <View style={styles.container}>
        <Text style={styles.title}>Actualizar Administrador</Text>

        <View style={styles.formContainer}>
          {/* MENSAJES DE ERROR */}
          {error && (
            <View style={{ backgroundColor: "#FFE6E6", padding: 12, borderRadius: 6, marginBottom: 16 }}>
              <Text style={{ color: "#FF6B6B", fontWeight: "bold" }}>Aviso: {error}</Text>
            </View>
          )}

          {!encontrado ? (
            <>
              {/* VISTA DE BUSQUEDA */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>ID, Nombre o Correo electronico:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ej: 1 o admin@ejemplo.com"
                  placeholderTextColor="#999"
                  value={busquedaTermino}
                  onChangeText={setBusquedaTermino}
                  editable={!loading}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>

              {loading && (
                <View style={{ alignItems: 'center', marginVertical: 20 }}>
                  <ActivityIndicator size="large" color="#2196F3" />
                  <Text style={{ marginTop: 10, color: '#666' }}>Buscando administrador...</Text>
                </View>
              )}

              <Pressable
                role="button"
                style={[styles.button, styles.buttonInsert, loading && { opacity: 0.5 }]}
                onPress={handleBuscar}
                disabled={loading}
              >
                <Text style={styles.buttonText}>{loading ? "BUSCANDO..." : "BUSCAR ADMINISTRADOR"}</Text>
              </Pressable>
            </>
          ) : (
            <>
              {/* VISTA DE EDICION */}
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#2196F3', marginBottom: 16 }}>
                Administrador encontrado - Edita los datos
              </Text>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>ID (No editable):</Text>
                <TextInput style={[styles.input, styles.inputReadonly]} value={idActual?.toString()} editable={false} />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Correo electronico (No editable):</Text>
                <TextInput style={[styles.input, styles.inputReadonly]} value={emailActual} editable={false} />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Nombre:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Nombre del administrador"
                  value={nombre}
                  onChangeText={setNombre}
                  editable={!loading}
                />
              </View>

              {/* SELECTOR DE ROL */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Rol:</Text>
                <View style={{ gap: 8 }}>
                  {ROLES.map((r) => (
                    <Pressable
                      key={r.value}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        padding: 12,
                        borderRadius: 8,
                        borderWidth: 2,
                        borderColor: rol === r.value ? '#2196F3' : '#e0e0e0',
                        backgroundColor: rol === r.value ? '#E3F2FD' : '#fafafa',
                      }}
                      onPress={() => setRol(r.value)}
                      disabled={loading}
                    >
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontWeight: 'bold', color: rol === r.value ? '#1565C0' : '#333' }}>
                          {r.label}
                        </Text>
                        <Text style={{ fontSize: 12, color: '#666', marginTop: 2 }}>{r.desc}</Text>
                      </View>
                      {rol === r.value && (
                        <Text style={{ color: '#2196F3', fontWeight: 'bold', fontSize: 16 }}>OK</Text>
                      )}
                    </Pressable>
                  ))}
                </View>
              </View>

              {/* GESTION DE CONTRASEÑA */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Nueva contraseña (opcional):</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Mínimo 8 caracteres"
                  secureTextEntry
                  value={nuevaPassword}
                  onChangeText={setNuevaPassword}
                  editable={!loading}
                />
                {/* ── Indicador visual en tiempo real del estado de la contraseña */}
                {nuevaPassword.length > 0 && (
                  <Text style={{ fontSize: 12, color: validarPassword(nuevaPassword) ? '#E63946' : '#4CAF50', marginTop: 4 }}>
                    {validarPassword(nuevaPassword) ?? "Contraseña válida"}
                  </Text>
                )}
              </View>

              {nuevaPassword.length > 0 && (
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Confirmar nueva contraseña:</Text>
                  <TextInput
                    style={[
                      styles.input,
                      confirmarPassword.length > 0 && nuevaPassword !== confirmarPassword
                        ? { borderColor: '#E63946' } : {},
                    ]}
                    placeholder="Repite la contraseña"
                    secureTextEntry
                    value={confirmarPassword}
                    onChangeText={setConfirmarPassword}
                    editable={!loading}
                  />
                  {confirmarPassword.length > 0 && nuevaPassword !== confirmarPassword && (
                    <Text style={{ fontSize: 12, color: '#E63946', marginTop: 4 }}>Aviso: Las contraseñas no coinciden</Text>
                  )}
                  {confirmarPassword.length > 0 && nuevaPassword === confirmarPassword && (
                    <Text style={{ fontSize: 12, color: '#4CAF50', marginTop: 4 }}>Confirmado: Las contraseñas coinciden</Text>
                  )}
                </View>
              )}

              {loading && (
                <View style={{ alignItems: 'center', marginVertical: 20 }}>
                  <ActivityIndicator size="large" color="#2196F3" />
                  <Text style={{ marginTop: 10, color: '#666' }}>Guardando cambios...</Text>
                </View>
              )}

              <View style={styles.botonesContainer}>
                <Pressable
                  role="button"
                  style={[styles.button, styles.buttonInsert, loading && { opacity: 0.5 }]}
                  onPress={handleActualizar}
                  disabled={loading}
                >
                  <Text style={styles.buttonText}>{loading ? "ACTUALIZANDO..." : "ACTUALIZAR REGISTRO"}</Text>
                </Pressable>

                <Pressable role="button" style={[styles.button, styles.buttonCancel]} onPress={deshacerCambios} disabled={loading}>
                  <Text style={styles.buttonText}>DESHACER CAMBIOS</Text>
                </Pressable>

                <Pressable role="button" style={[styles.button]} onPress={limpiarFormulario} disabled={loading}>
                  <Text style={styles.buttonText}>NUEVA BUSQUEDA</Text>
                </Pressable>
              </View>
            </>
          )}

          <View style={[styles.botonesContainer, { marginTop: 10 }]}>
            <Pressable role="button" style={[styles.button]} onPress={volver} disabled={loading}>
              <Text style={styles.buttonText}>VOLVER</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

export default ActualizarAdmin;