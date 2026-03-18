import React, { useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView, Alert, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { styles } from "../../styles/ActualizarPacienteStyle";
import { pacientesService } from "@/services/firebase";
import { Paciente } from "@/types";

function ActualizarPaciente() {
  const [encontrado, setEncontrado] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Estados para búsqueda
  const [busquedaTermino, setBusquedaTermino] = useState("");

  // Estados para edición
  const [dniActual, setDniActual] = useState("");
  const [nombre, setNombre] = useState("");
  const [cartilla, setCartilla] = useState("");
  const [telefono, setTelefono] = useState("");
  const [edad, setEdad] = useState("");
  const [tipoPaciente, setTipoPaciente] = useState<'activo' | 'pensionista' | 'mutualista'>('activo');
  const [pacienteOriginal, setPacienteOriginal] = useState<Paciente | null>(null);

  // ✅ BUSCAR PACIENTE
  const handleBuscar = async () => {
    setLoading(true);
    setError("");

    try {
      if (busquedaTermino.trim() === "") {
        setError("Ingresa un DNI o número de cartilla");
        setLoading(false);
        return;
      }

      console.log("🔍 Buscando paciente:", busquedaTermino);

      // Obtener todos los pacientes
      const todosPacientes = await pacientesService.obtenerTodos();
      
      if (todosPacientes.length === 0) {
        setError("No hay pacientes registrados");
        setLoading(false);
        return;
      }

      // ✅ VALIDAR ANTES DE USAR .toUpperCase()
      const pacienteEncontrado = todosPacientes.find(paciente =>
        (paciente.DNI || "").toUpperCase() === busquedaTermino.toUpperCase() ||
        (paciente.Num_Cartilla || "") === busquedaTermino
      );

      if (pacienteEncontrado) {
        console.log("✅ Paciente encontrado");
        setPacienteOriginal(pacienteEncontrado);
        cargarDatosFormulario(pacienteEncontrado);
        setEncontrado(true);
        setError("");
      } else {
        console.log("❌ Paciente no encontrado");
        setError("Paciente no encontrado");
        setEncontrado(false);
      }
    } catch (err: any) {
      console.error("❌ Error:", err);
      setError(err.message || "Error al buscar paciente");
    } finally {
      setLoading(false);
    }
  };

  // ✅ CARGAR DATOS EN LOS CAMPOS
  const cargarDatosFormulario = (paciente: Paciente) => {
    setDniActual(paciente.DNI);
    setNombre(paciente.Nombre_Paciente);
    setCartilla(paciente.Num_Cartilla);
    setTelefono(paciente.Num_Telefono);
    setEdad(paciente.Edad_Paciente.toString());
    setTipoPaciente(paciente.Tipo_Paciente);
  };

  // ✅ VALIDAR FORMULARIO
  const validarFormulario = (): string | null => {
    if (!nombre.trim()) return "Nombre es requerido";
    if (!cartilla.trim()) return "Número de cartilla es requerido";
    if (!telefono.trim()) return "Teléfono es requerido";
    if (!edad.trim()) return "Edad es requerida";
    
    const edadNumero = parseInt(edad, 10);
    if (isNaN(edadNumero)) return "Edad debe ser un número";
    if (edadNumero < 0 || edadNumero > 150) return "Edad debe estar entre 0 y 150";
    
    return null;
  };

  // ✅ ACTUALIZAR PACIENTE
  const handleActualizar = async () => {
    const validacionError = validarFormulario();
    if (validacionError) {
      setError(validacionError);
      return;
    }

    setLoading(true);
    setError("");

    try {
      console.log("📝 Actualizando paciente:", dniActual);

      const actualizaciones: Partial<Paciente> = {
        Nombre_Paciente: nombre,
        Num_Cartilla: cartilla,
        Num_Telefono: telefono,
        Edad_Paciente: parseInt(edad, 10),  // ✅ Convertir a entero
        Tipo_Paciente: tipoPaciente,
      };

      console.log("📝 Actualizaciones:", actualizaciones);

      await pacientesService.actualizarPaciente(dniActual, actualizaciones);

      console.log("✅ Paciente actualizado");

      Alert.alert("Éxito", "Paciente actualizado correctamente", [
        {
          text: "OK",
          onPress: () => {
            limpiarFormulario();
            setEncontrado(false);
          },
        },
      ]);
    } catch (err: any) {
      console.error("❌ Error:", err);
      setError(err.message || "Error al actualizar paciente");
    } finally {
      setLoading(false);
    }
  };

  // ✅ LIMPIAR FORMULARIO
  const limpiarFormulario = () => {
    setBusquedaTermino("");
    setDniActual("");
    setNombre("");
    setCartilla("");
    setTelefono("");
    setEdad("");
    setTipoPaciente("activo");
    setPacienteOriginal(null);
    setError("");
  };

  // ✅ DESHACER CAMBIOS
  const deshacerCambios = () => {
    if (pacienteOriginal) {
      console.log("🔄 Deshaciendo cambios");
      cargarDatosFormulario(pacienteOriginal);
      setError("");
    }
  };

  const volver = () => {
    router.push("/pages/DashboardPacientes")
  };

  return (
    <ScrollView style={styles.outerScroll} contentContainerStyle={styles.outerScrollContent}>
      <View style={styles.container}>
        <Text style={styles.title}>Actualizar Paciente</Text>

        <View style={styles.formContainer}>
          {/* Mostrar error si existe */}
          {error && (
            <View style={{ backgroundColor: "#FFE6E6", padding: 12, borderRadius: 6, marginBottom: 16 }}>
              <Text style={{ color: "#FF6B6B", fontWeight: "bold" }}>⚠️ {error}</Text>
            </View>
          )}

          {!encontrado ? (
            <>
              {/* FASE 1: BÚSQUEDA */}
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
                style={[styles.button, styles.buttonInsert, loading && { opacity: 0.5 }]}
                onPress={handleBuscar}
                disabled={loading}
              >
                <Text style={styles.buttonText}>
                  {loading ? "BUSCANDO..." : "BUSCAR PACIENTE"}
                </Text>
              </Pressable>
            </>
          ) : (
            <>
              {/* FASE 2: EDICIÓN */}
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#2196F3', marginBottom: 16 }}>
                ✓ Paciente encontrado - Edita los datos
              </Text>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>DNI (No editable):</Text>
                <TextInput 
                  style={[styles.input, styles.inputReadonly]} 
                  value={dniActual}
                  editable={false}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Nombre Completo:</Text>
                <TextInput 
                  style={styles.input} 
                  placeholder="Nombre completo"
                  value={nombre}
                  onChangeText={setNombre}
                  editable={!loading}
                />
              </View>

              <View style={{ flexDirection: 'row', gap: 10 }}>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.label}>Nº Cartilla:</Text>
                  <TextInput 
                    style={styles.input} 
                    placeholder="Cartilla"
                    keyboardType="numeric"
                    value={cartilla}
                    onChangeText={setCartilla}
                    editable={!loading}
                  />
                </View>

                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.label}>Teléfono:</Text>
                  <TextInput 
                    style={styles.input} 
                    placeholder="Telefono"
                    keyboardType="phone-pad"
                    value={telefono}
                    onChangeText={setTelefono}
                    editable={!loading}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Edad:</Text>
                <TextInput 
                  style={styles.input} 
                  placeholder="0-120" 
                  keyboardType="numeric"
                  maxLength={3}
                  value={edad}
                  onChangeText={(v) => {
                    const soloNumeros = v.replace(/[^0-9]/g, "");
                    setEdad(soloNumeros);
                  }}
                  editable={!loading}
                />
              </View>

              {/* Selector de Tipo */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Régimen del Paciente:</Text>
                <View style={{ flexDirection: "row", gap: 8 }}>
                  {(['activo', 'pensionista', 'mutualista'] as const).map((tipo) => (
                    <Pressable
                      key={tipo}
                      style={[
                        styles.button,
                        {
                          backgroundColor: tipoPaciente === tipo ? "#2196F3" : "#e0e0e0",
                          flex: 1,
                        }
                      ]}
                      onPress={() => setTipoPaciente(tipo)}
                      disabled={loading}
                    >
                      <Text style={[styles.buttonText, { color: tipoPaciente === tipo ? "white" : "#666" }]}>
                        {(tipo || "").charAt(0).toUpperCase() + (tipo || "").slice(1)}
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

              {/* Botones de acción */}
              <View style={styles.botonesContainer}>
                <Pressable 
                  style={[styles.button, styles.buttonInsert, loading && { opacity: 0.5 }]}
                  onPress={handleActualizar}
                  disabled={loading}
                >
                  <Text style={styles.buttonText}>
                    {loading ? "ACTUALIZANDO..." : "ACTUALIZAR REGISTRO"}
                  </Text>
                </Pressable>

                <Pressable 
                  style={[styles.button, styles.buttonCancel,]}
                  onPress={deshacerCambios}
                  disabled={loading}
                >
                  <Text style={styles.buttonText}>DESHACER CAMBIOS</Text>
                </Pressable>

                <Pressable 
                  style={[styles.button,]}
                  onPress={limpiarFormulario}
                  disabled={loading}
                >
                  <Text style={styles.buttonText}>NUEVA BÚSQUEDA</Text>
                </Pressable>
              </View>
            </>
          )}

          <View style={[styles.botonesContainer, { marginTop: 10 }]}>
            <Pressable 
              style={[styles.button,]} 
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

export default ActualizarPaciente;