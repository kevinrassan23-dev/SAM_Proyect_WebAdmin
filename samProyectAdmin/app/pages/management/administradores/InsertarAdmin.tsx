import React, { useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView, ActivityIndicator, Platform } from "react-native";
import { router } from "expo-router";
import { styles } from "@/styles/pages/management/administradores/InsertarAdminStyle";
import { adminService } from "@/services/supabase/admin";
import { useAuthGuard } from "@/hooks/useAuthGuard";

/**
 * UTILERÍA: Genera un timestamp actual para los logs
 */
const getTimestamp = () => new Date().toLocaleString();

/**
 * Función de confirmación adaptativa para Web y Mobile
 */
const confirmar = (mensaje: string, onConfirm: () => void) => {
  if (Platform.OS === "web") {
    if (window.confirm(mensaje)) onConfirm();
  } else {
    const { Alert } = require("react-native");
    Alert.alert("Confirmar", mensaje, [
      { text: "Cancelar", style: "cancel" },
      { text: "Sí", onPress: onConfirm },
    ]);
  }
};

/**
 * Función de alerta adaptativa para Web y Mobile
 */
const alertar = (titulo: string, mensaje: string) => {
  if (Platform.OS === "web") {
    window.alert(`${titulo}\n\n${mensaje}`);
  } else {
    const { Alert } = require("react-native");
    Alert.alert(titulo, mensaje, [{ text: "OK" }]);
  }
};

// Definición de roles disponibles en el sistema
const ROLES = [
  { value: 'SHOP_ADMIN',   label: 'Shop Admin',   desc: 'Solo tienda' },
  { value: 'SYSTEM_ADMIN', label: 'System Admin', desc: 'Administradores y tienda' },
] as const;

function InsertarAdmin() {
  useAuthGuard();

  // --- Estado del Formulario ---
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    password: "",
    confirmarPassword: "",
    rol: "SHOP_ADMIN" as 'SHOP_ADMIN' | 'GOV_ADMIN' | 'SYSTEM_ADMIN' | 'ADMIN_OWNER',
  });
  const [loading, setLoading] = useState(false);

  /**
   * Actualiza los campos del formulario de forma dinámica
   */
  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  /**
   * Validación de formato de correo mediante Regex
   */
  const validarEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  /**
   * Reinicia el estado del formulario a sus valores iniciales
   */
  const limpiarFormulario = () => {
    console.log(`[${getTimestamp()}] Limpiando campos del formulario`);
    setForm({ nombre: "", email: "", password: "", confirmarPassword: "", rol: "SHOP_ADMIN" });
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
   * Lógica de envío de datos al servicio de Supabase
   */
  const ejecutarGuardar = async () => {
    // Validaciones de negocio
    if (!form.nombre.trim()) {
      alertar("Error", "Por favor ingresa un nombre.");
      return;
    }

    if (!form.email.trim()) {
      alertar("Error", "Por favor ingresa un correo electrónico.");
      return;
    }

    if (!validarEmail(form.email.trim())) {
      alertar("Error", "El correo electrónico no tiene un formato válido.");
      return;
    }

    if (!form.password.trim()) {
      alertar("Error", "Por favor ingresa una contraseña.");
      return;
    }

    const errorPassword = validarPassword(form.password);
    if (errorPassword) {
      alertar("Error", errorPassword);
      return;
    }

    if (form.password !== form.confirmarPassword) {
      alertar("Error", "Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    console.log(`[${getTimestamp()}] Iniciando registro de admin: ${form.email} con rol: ${form.rol}`);

    try {
      await adminService.crearAdministrador(
        form.email.trim(),
        form.password,
        form.nombre.trim(),
        form.rol,
      );
      
      console.log(`[${getTimestamp()}] Registro exitoso para: ${form.email}`);
      alertar("Éxito", "Administrador registrado correctamente.");
      limpiarFormulario();
    } catch (error: any) {
      console.log(`[${getTimestamp()}] Error en el registro: ${error.message}`);
      alertar("Error", error.message || "No se pudo registrar el administrador.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Manejador para el botón de guardado con confirmación
   */
  const handleGuardar = () => {
    confirmar("¿Estás seguro de que deseas registrar este administrador?", ejecutarGuardar);
  };

  /**
   * Manejador para el botón de limpieza con confirmación
   */
  const handleLimpiar = () => {
    confirmar("¿Estás seguro de que deseas limpiar todos los campos?", limpiarFormulario);
  };

  /**
   * Navegación de retorno
   */
  const volver = () => {
    console.log(`[${getTimestamp()}] Navegando de vuelta a MostrarPedidos`);
    router.push("/pages/management/pedidos/MostrarPedidos");
  };

  return (
    <ScrollView style={styles.outerScroll} contentContainerStyle={styles.outerScrollContent} keyboardShouldPersistTaps="handled">
      <View style={styles.container}>
        <Text style={styles.title}>Insertar Administrador</Text>

        <View style={styles.formContainer}>

          {/* CAMPO: NOMBRE */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nombre:</Text>
            <TextInput
              style={[styles.input, loading && { backgroundColor: '#f0f0f0' }]}
              placeholder="Nombre del administrador"
              value={form.nombre}
              onChangeText={v => handleChange("nombre", v)}
              editable={!loading}
            />
          </View>

          {/* CAMPO: EMAIL */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Correo electrónico:</Text>
            <TextInput
              style={[styles.input, loading && { backgroundColor: '#f0f0f0' }]}
              placeholder="admin@ejemplo.com"
              autoCapitalize="none"
              keyboardType="email-address"
              value={form.email}
              onChangeText={v => handleChange("email", v)}
              editable={!loading}
            />
          </View>

          {/* CAMPO: CONTRASEÑA */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Contraseña:</Text>
            <TextInput
              style={[styles.input, loading && { backgroundColor: '#f0f0f0' }]}
              placeholder="Mínimo 8 caracteres"
              secureTextEntry
              value={form.password}
              onChangeText={v => handleChange("password", v)}
              editable={!loading}
            />
            {/* ── Indicador visual en tiempo real del estado de la contraseña */}
            <Text style={{ fontSize: 12, color: validarPassword(form.password) ? '#E63946' : '#4CAF50', marginTop: 4 }}>
              {form.password.length === 0
                ? "Mín. 8 caracteres, mayúsculas, minúsculas, números y símbolos"
                : validarPassword(form.password) ?? "Contraseña válida"}
            </Text>
          </View>

          {/* CAMPO: CONFIRMAR CONTRASEÑA (con validación visual) */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirmar contraseña:</Text>
            <TextInput
              style={[
                styles.input,
                loading && { backgroundColor: '#f0f0f0' },
                form.confirmarPassword.length > 0 && form.password !== form.confirmarPassword
                  ? { borderColor: '#E63946' }
                  : {},
              ]}
              placeholder="Repite la contraseña"
              secureTextEntry
              value={form.confirmarPassword}
              onChangeText={v => handleChange("confirmarPassword", v)}
              editable={!loading}
            />
            {form.confirmarPassword.length > 0 && form.password !== form.confirmarPassword && (
              <Text style={{ fontSize: 12, color: '#E63946', marginTop: 4 }}>
                Aviso: Las contraseñas no coinciden
              </Text>
            )}
            {form.confirmarPassword.length > 0 && form.password === form.confirmarPassword && (
              <Text style={{ fontSize: 12, color: '#4CAF50', marginTop: 4 }}>
                Confirmado: Las contraseñas coinciden
              </Text>
            )}
          </View>

          {/* SELECTOR DE ROL (Visual) */}
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
                    borderColor: form.rol === r.value ? '#2196F3' : '#e0e0e0',
                    backgroundColor: form.rol === r.value ? '#E3F2FD' : '#fafafa',
                  }}
                  onPress={() => {
                    console.log(`[${getTimestamp()}] Cambio de rol seleccionado: ${r.value}`);
                    handleChange("rol", r.value);
                  }}
                  disabled={loading}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontWeight: 'bold', color: form.rol === r.value ? '#1565C0' : '#333' }}>
                      {r.label}
                    </Text>
                    <Text style={{ fontSize: 12, color: '#666', marginTop: 2 }}>{r.desc}</Text>
                  </View>
                  {form.rol === r.value && (
                    <Text style={{ color: '#2196F3', fontWeight: 'bold', fontSize: 16 }}>Check</Text>
                  )}
                </Pressable>
              ))}
            </View>
          </View>

          {/* SECCIÓN DE ACCIONES */}
          <View style={[styles.botonesContainer, { marginTop: 20 }]}>
            <Pressable
              role="button"
              style={[styles.button, styles.buttonInsert, loading && { opacity: 0.7 }]}
              onPress={handleGuardar}
              disabled={loading}
            >
              {loading
                ? <ActivityIndicator color="white" />
                : <Text style={styles.buttonText}>REGISTRAR ADMINISTRADOR</Text>
              }
            </Pressable>

            <Pressable
              role="button"
              style={[styles.button, styles.buttonCancel]}
              onPress={handleLimpiar}
              disabled={loading}
            >
              <Text style={styles.buttonText}>LIMPIAR CAMPOS</Text>
            </Pressable>

            <Pressable
              role="button"
              style={[styles.button]}
              onPress={volver}
              disabled={loading}
            >
              <Text style={styles.buttonText}>VOLVER</Text>
            </Pressable>
          </View>

        </View>
      </View>
    </ScrollView>
  );
}

export default InsertarAdmin;