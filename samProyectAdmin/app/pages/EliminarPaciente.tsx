import React, { useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView, Alert, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { styles } from "../../styles/EliminarPacienteStyle";
import { pacientesService } from "@/services/firebase";
import { Paciente } from "@/types";

function EliminarPaciente() {
  const [confirmacion, setConfirmacion] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Estados para búsqueda
  const [busquedaTermino, setBusquedaTermino] = useState("");
  const [pacienteEncontrado, setPacienteEncontrado] = useState<Paciente | null>(null);

  // ✅ BUSCAR PACIENTE
  const handleBuscar = async () => {
    setLoading(true);
    setError("");
    setPacienteEncontrado(null);

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
      const paciente = todosPacientes.find(p =>
        (p.DNI || "").toUpperCase() === busquedaTermino.toUpperCase() ||
        (p.Num_Cartilla || "") === busquedaTermino
      );

      if (paciente) {
        console.log("✅ Paciente encontrado");
        setPacienteEncontrado(paciente);
        setError("");
      } else {
        console.log("❌ Paciente no encontrado");
        setError("Paciente no encontrado");
        setPacienteEncontrado(null);
      }
    } catch (err: any) {
      console.error("❌ Error:", err);
      setError(err.message || "Error al buscar paciente");
    } finally {
      setLoading(false);
    }
  };

  // ✅ CONFIRMAR ELIMINACIÓN (Ir a la segunda pantalla)
  const handleConfirmarEliminacion = () => {
    if (!pacienteEncontrado) {
      setError("Debe buscar un paciente primero");
      return;
    }
    setConfirmacion(true);
  };

  // ✅ ELIMINAR PACIENTE
  const handleEliminar = async () => {
    if (!pacienteEncontrado) {
      setError("Error: No hay paciente para eliminar");
      return;
    }

    setLoading(true);
    setError("");

    try {
      console.log("🗑️ Eliminando paciente:", pacienteEncontrado.DNI);

      await pacientesService.eliminarPaciente(pacienteEncontrado.DNI);

      console.log("✅ Paciente eliminado");

      Alert.alert("Éxito", "Paciente eliminado correctamente", [
        {
          text: "OK",
          onPress: () => {
            limpiarFormulario();
            setConfirmacion(false);
          },
        },
      ]);
    } catch (err: any) {
      console.error("❌ Error:", err);
      setError(err.message || "Error al eliminar paciente");
    } finally {
      setLoading(false);
    }
  };

  // ✅ LIMPIAR FORMULARIO
  const limpiarFormulario = () => {
    setBusquedaTermino("");
    setPacienteEncontrado(null);
    setError("");
  };

  // ✅ VOLVER ATRÁS DESDE CONFIRMACIÓN
  const volverABusqueda = () => {
    setConfirmacion(false);
    limpiarFormulario();
  };

  const volver = () => {
    router.push("/pages/DashboardPacientes");
  };

  return (
    <ScrollView style={styles.outerScroll} contentContainerStyle={styles.outerScrollContent}>
      <View style={styles.container}>
        <Text style={styles.title}>Eliminar Paciente</Text>

        <View style={styles.formContainer}>
          {/* Mostrar error si existe */}
          {error && (
            <View style={{ backgroundColor: "#FFE6E6", padding: 12, borderRadius: 6, marginBottom: 16 }}>
              <Text style={{ color: "#FF6B6B", fontWeight: "bold" }}>⚠️ {error}</Text>
            </View>
          )}

          {!confirmacion ? (
            <>
              {/* FASE 1: BÚSQUEDA */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>DNI o Nº Cartilla:</Text>
                <TextInput 
                  style={styles.input} 
                  placeholder="Ej: 12345678A o 123456"
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

              {/* ✅ MOSTRAR PACIENTE ENCONTRADO */}
              {!loading && pacienteEncontrado && (
                <View style={styles.tarjeta}>
                  <Text style={styles.tarjetaTitulo}>{pacienteEncontrado.Nombre_Paciente}</Text>
                  
                  <View style={{ marginTop: 10, gap: 8 }}>
                    <Text style={styles.tarjetaTexto}>
                      <Text style={{ fontWeight: 'bold' }}>DNI:</Text> {pacienteEncontrado.DNI}
                    </Text>
                    <Text style={styles.tarjetaTexto}>
                      <Text style={{ fontWeight: 'bold' }}>Cartilla:</Text> {pacienteEncontrado.Num_Cartilla}
                    </Text>
                    <Text style={styles.tarjetaTexto}>
                      <Text style={{ fontWeight: 'bold' }}>Teléfono:</Text> {pacienteEncontrado.Num_Telefono}
                    </Text>
                    <Text style={styles.tarjetaTexto}>
                      <Text style={{ fontWeight: 'bold' }}>Edad:</Text> {pacienteEncontrado.Edad_Paciente} años
                    </Text>
                    <Text style={styles.tarjetaTexto}>
                      <Text style={{ fontWeight: 'bold' }}>Régimen:</Text> {(pacienteEncontrado.Tipo_Paciente || "").charAt(0).toUpperCase() + (pacienteEncontrado.Tipo_Paciente || "").slice(1)}
                    </Text>
                  </View>
                </View>
              )}

              <View style={styles.botonesContainer}>
                <Pressable 
                  style={[styles.button, styles.buttonInsert, loading && { opacity: 0.5 }]}
                  onPress={handleBuscar}
                  disabled={loading}
                >
                  <Text style={styles.buttonText}>
                    {loading ? "BUSCANDO..." : "BUSCAR PACIENTE"}
                  </Text>
                </Pressable>

                {/* Botón de confirmar solo si encontró paciente */}
                {!loading && pacienteEncontrado && (
                  <Pressable 
                    style={[styles.button, styles.buttonCancel]}
                    onPress={handleConfirmarEliminacion}
                    disabled={loading}
                  >
                    <Text style={styles.buttonText}>CONFIRMAR ELIMINACIÓN</Text>
                  </Pressable>
                )}
              </View>
            </>
          ) : (
            <>
              {/* FASE 2: CONFIRMACIÓN */}
              <View style={{
                backgroundColor: "#FFF3CD",
                borderLeftColor: "#FFC107",
                borderLeftWidth: 4,
                padding: 16,
                borderRadius: 8,
                marginBottom: 20
              }}>
                <Text style={{
                  color: "#856404",
                  fontWeight: 'bold',
                  fontSize: 16,
                  marginBottom: 8
                }}>
                  ⚠️ Advertencia
                </Text>
                <Text style={{
                  color: "#856404",
                  fontSize: 14,
                  lineHeight: 20
                }}>
                  ¿Estás seguro de que deseas eliminar a <Text style={{ fontWeight: 'bold' }}>{pacienteEncontrado?.Nombre_Paciente}</Text>?
                </Text>
                <Text style={{
                  color: "#856404",
                  fontSize: 12,
                  marginTop: 8,
                  fontStyle: 'italic'
                }}>
                  Esta acción no se puede deshacer.
                </Text>
              </View>

              {pacienteEncontrado && (
                <View style={styles.tarjeta}>
                  <Text style={styles.tarjetaTitulo}>{pacienteEncontrado.Nombre_Paciente}</Text>
                  
                  <View style={{ marginTop: 10, gap: 8 }}>
                    <Text style={styles.tarjetaTexto}>
                      <Text style={{ fontWeight: 'bold' }}>DNI:</Text> {pacienteEncontrado.DNI}
                    </Text>
                    <Text style={styles.tarjetaTexto}>
                      <Text style={{ fontWeight: 'bold' }}>Cartilla:</Text> {pacienteEncontrado.Num_Cartilla}
                    </Text>
                    <Text style={styles.tarjetaTexto}>
                      <Text style={{ fontWeight: 'bold' }}>Teléfono:</Text> {pacienteEncontrado.Num_Telefono}
                    </Text>
                  </View>
                </View>
              )}

              <View style={styles.botonesContainer}>
                <Pressable 
                  style={[styles.button, { backgroundColor: "#F44336" }, loading && { opacity: 0.5 }]}
                  onPress={handleEliminar}
                  disabled={loading}
                >
                  <Text style={styles.buttonText}>
                    {loading ? "ELIMINANDO..." : "ELIMINAR DEFINITIVAMENTE"}
                  </Text>
                </Pressable>

                <Pressable 
                  style={[styles.button, { backgroundColor: "#9E9E9E" }]}
                  onPress={volverABusqueda}
                  disabled={loading}
                >
                  <Text style={styles.buttonText}>CANCELAR</Text>
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

export default EliminarPaciente;