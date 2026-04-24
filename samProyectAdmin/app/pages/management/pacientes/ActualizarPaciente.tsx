import React, { useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView, ActivityIndicator, Platform } from "react-native";
import { router } from "expo-router";
import { styles } from "@/styles/pages/management/pacientes/ActualizarPacienteStyle";
import { pacientesService } from "@/services/firebase";
import { Paciente } from "@/types/paciente";

/**
 * UTILERÍA: Genera un timestamp actual para la trazabilidad en consola
 */
const getTimestamp = () => new Date().toLocaleString();

const PREFIJO_CARTILLA = "BBBBBBBBB";
const PREFIJO_TELEFONO = "+34";

/**
 * Sistema de confirmación adaptativo (Web / Mobile)
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
 * Sistema de alertas adaptativo (Web / Mobile)
 */
const alertar = (titulo: string, mensaje: string) => {
  if (Platform.OS === "web") {
    window.alert(`${titulo}\n\n${mensaje}`);
  } else {
    const { Alert } = require("react-native");
    Alert.alert(titulo, mensaje, [{ text: "OK" }]);
  }
};

function ActualizarPaciente() {
  // --- Estados de Control de Flujo ---
  const [encontrado, setEncontrado] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [busquedaTermino, setBusquedaTermino] = useState("");

  // --- Estados del Formulario ---
  const [dniActual, setDniActual] = useState("");
  const [nombre, setNombre] = useState("");
  const [cartilla, setCartilla] = useState(""); // solo 7 dígitos variables
  const [telefono, setTelefono] = useState(""); // solo 9 dígitos sin +34
  const [edad, setEdad] = useState("");
  const [tipoPaciente, setTipoPaciente] = useState<'activo' | 'pensionista' | 'mutualista'>('activo');
  const [pacienteOriginal, setPacienteOriginal] = useState<Paciente | null>(null);

  /**
   * Manejador de búsqueda inicial de paciente
   */
  const handleBuscar = async () => {
    setLoading(true);
    setError("");
    console.log(`[${getTimestamp()}] Iniciando busqueda para actualizar. Termino: ${busquedaTermino}`);

    try {
      if (busquedaTermino.trim() === "") {
        setError("Ingresa un DNI o número de cartilla");
        setLoading(false);
        return;
      }

      const todosPacientes = await pacientesService.obtenerTodos();

      if (todosPacientes.length === 0) {
        setError("No hay pacientes registrados");
        setLoading(false);
        return;
      }

      const termino = busquedaTermino.trim().toUpperCase();

      const pacienteEncontrado = todosPacientes.find(paciente => {
        const dni = (paciente.DNI ?? "").toUpperCase();
        const cartillaCompleta = (paciente.Num_Cartilla ?? "");
        const cartillaVariable = cartillaCompleta.replace(PREFIJO_CARTILLA, "");
        return (
          dni === termino ||
          cartillaCompleta.includes(busquedaTermino.trim()) ||
          cartillaVariable === busquedaTermino.trim()
        );
      });

      if (pacienteEncontrado) {
        console.log(`[${getTimestamp()}] Paciente localizado: ${pacienteEncontrado.DNI}`);
        setPacienteOriginal(pacienteEncontrado);
        cargarDatosFormulario(pacienteEncontrado);
        setEncontrado(true);
        setError("");
      } else {
        console.log(`[${getTimestamp()}] Busqueda sin resultados para: ${termino}`);
        setError("Paciente no encontrado");
        setEncontrado(false);
      }
    } catch (err: any) {
      console.log(`[${getTimestamp()}] Error en handleBuscar: ${err.message}`);
      setError(err.message || "Error al buscar paciente");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Mapea los datos del objeto Paciente a los estados del formulario
   */
  const cargarDatosFormulario = (paciente: Paciente) => {
    setDniActual(paciente.DNI);
    setNombre(paciente.Nombre_Paciente);
    const cartillaVariable = (paciente.Num_Cartilla ?? "").replace(PREFIJO_CARTILLA, "");
    setCartilla(cartillaVariable);
    const telefonoSinPrefijo = (paciente.Num_Telefono ?? "").replace(PREFIJO_TELEFONO, "");
    setTelefono(telefonoSinPrefijo);
    setEdad(paciente.Edad_Paciente.toString());
    setTipoPaciente(paciente.Tipo_Paciente);
  };

  /**
   * Validación de reglas de negocio antes del envío
   */
  const validarFormulario = (): string | null => {
    if (!nombre.trim()) return "Nombre es requerido";
    if (!cartilla.trim() || cartilla.length !== 7) return "Nº Cartilla debe tener 7 dígitos";
    if (!telefono.trim() || telefono.length !== 9) return "Teléfono debe tener 9 dígitos";
    const edadNumero = parseInt(edad, 10);
    if (isNaN(edadNumero) || edadNumero < 1 || edadNumero > 120) return "Edad debe estar entre 1 y 120";
    return null;
  };

  /**
   * Ejecuta la actualización en Firebase previa validación de integridad
   */
  const ejecutarActualizar = async () => {
    const validacionError = validarFormulario();
    if (validacionError) {
      setError(validacionError);
      return;
    }

    setLoading(true);
    setError("");
    console.log(`[${getTimestamp()}] Procesando actualizacion para DNI: ${dniActual}`);

    try {
      // VALIDACIÓN DE DUPLICADOS (Evitar colisión de datos con otros pacientes)
      const todosPacientes = await pacientesService.obtenerTodos();
      const cartillaCompleta = `${PREFIJO_CARTILLA}${cartilla}`;
      const telefonoCompleto = `${PREFIJO_TELEFONO}${telefono}`;

      const duplicado = todosPacientes.find(p =>
        p.DNI !== dniActual &&
        (p.Num_Cartilla === cartillaCompleta || p.Num_Telefono === telefonoCompleto)
      );

      if (duplicado) {
        console.log(`[${getTimestamp()}] Conflicto detectado: Datos ya existentes en otro registro`);
        const cartillaDuplicada = duplicado.Num_Cartilla === cartillaCompleta;
        const telefonoDuplicado = duplicado.Num_Telefono === telefonoCompleto;

        let mensaje = "";
        if (cartillaDuplicada && telefonoDuplicado) {
          mensaje = "Ya existe un usuario con ese número de teléfono y cartilla";
        } else if (cartillaDuplicada) {
          mensaje = "Ya existe un usuario registrado con ese número de cartilla";
        } else {
          mensaje = "Ya existe un usuario registrado con ese número de teléfono";
        }

        alertar("Duplicado detectado: ", mensaje);
        return; 
      }

      const actualizaciones: Partial<Paciente> = {
        Nombre_Paciente: nombre,
        Num_Cartilla: cartillaCompleta,
        Num_Telefono: telefonoCompleto,
        Edad_Paciente: parseInt(edad, 10),
        Tipo_Paciente: tipoPaciente,
      };

      await pacientesService.actualizarPaciente(dniActual, actualizaciones);

      console.log(`[${getTimestamp()}] Registro actualizado exitosamente`);
      alertar("Éxito", "Paciente actualizado correctamente.");
      limpiarFormulario();
      setEncontrado(false);
    } catch (err: any) {
      console.log(`[${getTimestamp()}] Error en ejecutarActualizar: ${err.message}`);
      setError(err.message || "Error al actualizar paciente");
    } finally {
      setLoading(false);
    }
  };

  const handleActualizar = () => {
    confirmar("¿Estás seguro de que deseas actualizar este paciente?", ejecutarActualizar);
  };

  /**
   * Reinicio total de estados
   */
  const limpiarFormulario = () => {
    console.log(`[${getTimestamp()}] Reseteando formulario de actualizacion`);
    setBusquedaTermino("");
    setDniActual("");
    setNombre("");
    setCartilla("");
    setTelefono("");
    setEdad("");
    setTipoPaciente("activo");
    setPacienteOriginal(null);
    setError("");
    setEncontrado(false);
  };

  /**
   * Revierte los cambios actuales a los valores originales de la base de datos
   */
  const deshacerCambios = () => {
    if (pacienteOriginal) {
      console.log(`[${getTimestamp()}] Revirtiendo cambios a estado original`);
      cargarDatosFormulario(pacienteOriginal);
      setError("");
    }
  };

  const volver = () => {
    console.log(`[${getTimestamp()}] Navegando de vuelta a MostrarPedidos`);
    router.push("/pages/management/pedidos/MostrarPedidos");
  };

  return (
    <ScrollView style={styles.outerScroll} contentContainerStyle={styles.outerScrollContent}>
      <View style={styles.container}>
        <Text style={styles.title}>Actualizar Paciente</Text>

        <View style={styles.formContainer}>
          {/* VISUALIZACIÓN DE ERRORES */}
          {error && (
            <View style={{ backgroundColor: "#FFE6E6", padding: 12, borderRadius: 6, marginBottom: 16 }}>
              <Text style={{ color: "#FF6B6B", fontWeight: "bold" }}>Aviso: {error}</Text>
            </View>
          )}

          {!encontrado ? (
            <>
              {/* SECCIÓN DE BÚSQUEDA */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>DNI o Nº Cartilla:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="DNI/Cartilla"
                  placeholderTextColor="#999"
                  value={busquedaTermino}
                  onChangeText={setBusquedaTermino}
                  editable={!loading}
                  autoCapitalize="characters"
                />
              </View>

              {loading && (
                <View style={{ alignItems: 'center', marginVertical: 20 }}>
                  <ActivityIndicator size="large" color="#2196F3" />
                  <Text style={{ marginTop: 10, color: '#666' }}>Buscando paciente...</Text>
                </View>
              )}

              <Pressable
                role="button"
                style={[styles.button, styles.buttonInsert, loading && { opacity: 0.5 }]}
                onPress={handleBuscar}
                disabled={loading}
              >
                <Text style={styles.buttonText}>{loading ? "BUSCANDO..." : "BUSCAR PACIENTE"}</Text>
              </Pressable>
            </>
          ) : (
            <>
              {/* SECCIÓN DE EDICIÓN */}
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#2196F3', marginBottom: 16 }}>
                ✓ Paciente encontrado - Edita los datos
              </Text>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>DNI (No editable):</Text>
                <TextInput style={[styles.input, styles.inputReadonly]} value={dniActual} editable={false} />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Nombre y apellidos:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Nombre completo"
                  value={nombre}
                  onChangeText={setNombre}
                  editable={!loading}
                />
              </View>

              <View style={{ flexDirection: 'row', gap: 10 }}>
                {/* Cartilla con prefijo B fijo */}
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.label}>Nº Cartilla:</Text>
                  <View style={[styles.input, { flexDirection: 'row', alignItems: 'center', padding: 0 }]}>
                    <View style={{ paddingHorizontal: 10, borderRightWidth: 1, borderRightColor: '#ccc', justifyContent: 'center', height: '100%' }}>
                      <Text style={{ color: '#555', fontWeight: '600' }}>B</Text>
                    </View>
                    <TextInput
                      style={{ flex: 1, paddingHorizontal: 10, color: '#333' }}
                      placeholder="1234567"
                      keyboardType="numeric"
                      value={cartilla}
                      onChangeText={v => setCartilla(v.replace(/[^0-9]/g, "").slice(0, 7))}
                      editable={!loading}
                      maxLength={7}
                    />
                  </View>
                </View>

                {/* Teléfono con prefijo +34 fijo */}
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.label}>Teléfono:</Text>
                  <View style={[styles.input, { flexDirection: 'row', alignItems: 'center', padding: 0 }]}>
                    <View style={{ paddingHorizontal: 10, borderRightWidth: 1, borderRightColor: '#ccc', justifyContent: 'center', height: '100%' }}>
                      <Text style={{ color: '#555', fontWeight: '600' }}>+34</Text>
                    </View>
                    <TextInput
                      style={{ flex: 1, paddingHorizontal: 10, color: '#333' }}
                      placeholder="666666667"
                      keyboardType="phone-pad"
                      value={telefono}
                      onChangeText={v => setTelefono(v.replace(/[^0-9]/g, "").slice(0, 9))}
                      editable={!loading}
                      maxLength={9}
                    />
                  </View>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Edad:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="1-120"
                  keyboardType="numeric"
                  maxLength={3}
                  value={edad}
                  onChangeText={v => setEdad(v.replace(/[^0-9]/g, ""))}
                  editable={!loading}
                />
              </View>

              {/* SELECTOR DE RÉGIMEN */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Régimen del Paciente:</Text>
                <View style={{ flexDirection: "row", gap: 8 }}>
                  {(['activo', 'pensionista', 'mutualista'] as const).map((tipo) => (
                    <Pressable
                      key={tipo}
                      role="button"
                      style={[styles.button, { backgroundColor: tipoPaciente === tipo ? "#2196F3" : "#e0e0e0", flex: 1 }]}
                      onPress={() => setTipoPaciente(tipo)}
                      disabled={loading}
                    >
                      <Text style={[styles.buttonText, { color: tipoPaciente === tipo ? "white" : "#666" }]}>
                        {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              {loading && (
                <View style={{ alignItems: 'center', marginVertical: 20 }}>
                  <ActivityIndicator size="large" color="#2196F3" />
                  <Text style={{ marginTop: 10, color: '#666' }}>Guardando cambios...</Text>
                </View>
              )}

              {/* ACCIONES DE FORMULARIO */}
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
                  <Text style={styles.buttonText}>NUEVA BÚSQUEDA</Text>
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

export default ActualizarPaciente;