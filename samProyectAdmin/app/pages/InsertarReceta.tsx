import React, { useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView, Alert, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { styles } from "../../styles/InsertarRecetaStyle";
import { recetasService } from "@/services/firebase";
import { pacientesService } from "@/services/firebase";
import { Receta } from "@/types";

function InsertarReceta() {
  const [form, setForm] = useState({
    DNI_Paciente: "",
    Nombre_Especialista: "",
    Affecciones: "",
    Direccion_Centro: "",
    Fecha: "",
  });
  const [loading, setLoading] = useState(false);
  const [pacienteValido, setPacienteValido] = useState(false);
  const [nombrePaciente, setNombrePaciente] = useState("");

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  // ✅ VALIDAR PACIENTE (Si existe)
  const handleValidarPaciente = async () => {
    if (!form.DNI_Paciente.trim()) {
      Alert.alert("Error", "Ingresa un DNI");
      return;
    }

    setLoading(true);
    try {
      console.log("🔍 Validando paciente:", form.DNI_Paciente);

      // Obtener todos los pacientes
      const todosPacientes = await pacientesService.obtenerTodos();
      
      // ✅ VALIDAR ANTES DE USAR .toUpperCase()
      const paciente = todosPacientes.find(p =>
        (p.DNI || "").toUpperCase() === form.DNI_Paciente.toUpperCase()
      );

      if (paciente) {
        console.log("✅ Paciente encontrado:", paciente.Nombre_Paciente);
        setNombrePaciente(paciente.Nombre_Paciente);
        setPacienteValido(true);
      } else {
        console.log("❌ Paciente no encontrado");
        Alert.alert("Error", "El paciente no está registrado en el sistema");
        setPacienteValido(false);
        setNombrePaciente("");
      }
    } catch (error: any) {
      console.error("❌ Error:", error);
      Alert.alert("Error", error.message || "Error al validar paciente");
    } finally {
      setLoading(false);
    }
  };

  // ✅ VALIDAR FORMULARIO
  const validarFormulario = (): string | null => {
    if (!pacienteValido) return "Debes validar un paciente primero";
    if (!form.Nombre_Especialista.trim()) return "Nombre del especialista es requerido";
    if (!form.Affecciones.trim()) return "Afecciones es requerido";
    if (!form.Direccion_Centro.trim()) return "Dirección del centro es requerida";
    if (!form.Fecha.trim()) return "Fecha es requerida";

    // Validar formato de fecha (YYYY-MM-DD)
    const regexFecha = /^\d{4}-\d{2}-\d{2}$/;
    if (!regexFecha.test(form.Fecha)) {
      return "Fecha debe estar en formato YYYY-MM-DD";
    }

    return null;
  };

  // ✅ GUARDAR RECETA
  const handleGuardar = async () => {
    const validacionError = validarFormulario();
    if (validacionError) {
      Alert.alert("Error", validacionError);
      return;
    }

    setLoading(true);
    try {
      console.log("📝 Guardando receta...");

      const nuevaReceta: Omit<Receta, 'ID_Receta'> = {
        DNI_Paciente: form.DNI_Paciente.toUpperCase(),
        Nombre_Especialista: form.Nombre_Especialista,
        Afecciones: form.Affecciones,
        Direccion_Centro: form.Direccion_Centro,
        Fecha: new Date(form.Fecha),  // ✅ Guardar como string, no Date
        Activa: true,
      };

      console.log("📝 Datos a guardar:", nuevaReceta);

      const idReceta = await recetasService.crearReceta(nuevaReceta);

      console.log("✅ Receta guardada con ID:", idReceta);

      Alert.alert("Éxito", "Receta insertada correctamente", [
        {
          text: "OK",
          onPress: () => {
            limpiarFormulario();
            router.back();
          },
        },
      ]);
    } catch (error: any) {
      console.error("❌ Error:", error);
      Alert.alert("Error", error.message || "No se pudo guardar la receta");
    } finally {
      setLoading(false);
    }
  };

  // ✅ LIMPIAR FORMULARIO
  const limpiarFormulario = () => {
    setForm({
      DNI_Paciente: "",
      Nombre_Especialista: "",
      Affecciones: "",
      Direccion_Centro: "",
      Fecha: "",
    });
    setPacienteValido(false);
    setNombrePaciente("");
  };

  const volver = () => {
    router.back();
  };

  return (
    <ScrollView style={styles.outerScroll} contentContainerStyle={styles.outerScrollContent}>
      <View style={styles.container}>
        <Text style={styles.title}>Insertar Receta</Text>

        <View style={styles.formContainer}>
          {/* VALIDACIÓN DE PACIENTE */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>DNI del Paciente:</Text>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="DNI"
                placeholderTextColor="#999"
                value={form.DNI_Paciente}
                onChangeText={(v) => {
                  handleChange("DNI_Paciente", v);
                  setPacienteValido(false);
                  setNombrePaciente("");
                }}
                editable={!loading}
                autoCapitalize="characters"
              />
              <Pressable
                style={[
                  styles.button,
                  {
                    width: 120,
                    paddingVertical: 12,
                    justifyContent: 'center'
                  },
                  loading && { opacity: 0.5 }
                ]}
                onPress={handleValidarPaciente}
                disabled={loading}
              >
                <Text style={styles.buttonText}>
                  {loading ? "..." : "Validar"}
                </Text>
              </Pressable>
            </View>
          </View>

          {/* MOSTRAR PACIENTE VALIDADO */}
          {pacienteValido && (
            <View style={{
              backgroundColor: "#E8F5E9",
              borderLeftColor: "#4CAF50",
              borderLeftWidth: 4,
              padding: 12,
              borderRadius: 6,
              marginBottom: 16
            }}>
              <Text style={{ color: "#2E7D32", fontWeight: 'bold' }}>
                ✓ Paciente encontrado: {nombrePaciente}
              </Text>
            </View>
          )}

          {/* RESTO DEL FORMULARIO */}
          {pacienteValido && (
            <>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Nombre del Especialista:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ej: Dr. García"
                  value={form.Nombre_Especialista}
                  onChangeText={(v) => handleChange("Nombre_Especialista", v)}
                  editable={!loading}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Afecciones:</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Ej: Hipertensión, diabetes..."
                  value={form.Affecciones}
                  onChangeText={(v) => handleChange("Affecciones", v)}
                  multiline
                  numberOfLines={3}
                  editable={!loading}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Dirección del Centro:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="DIRECCIÓN"
                  value={form.Direccion_Centro}
                  onChangeText={(v) => handleChange("Direccion_Centro", v)}
                  editable={!loading}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Fecha (YYYY-MM-DD):</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ej: 2026-01-01"
                  value={form.Fecha}
                  onChangeText={(v) => handleChange("Fecha", v)}
                  editable={!loading}
                />
              </View>

              {loading && (
                <View style={{ alignItems: 'center', marginVertical: 20 }}>
                  <ActivityIndicator size="large" color="#2196F3" />
                  <Text style={{ marginTop: 10, color: '#666' }}>Guardando receta...</Text>
                </View>
              )}

              <View style={styles.botonesContainer}>
                <Pressable
                  style={[styles.button, styles.buttonInsert, loading && { opacity: 0.5 }]}
                  onPress={handleGuardar}
                  disabled={loading}
                >
                  <Text style={styles.buttonText}>
                    {loading ? "GUARDANDO..." : "GUARDAR RECETA"}
                  </Text>
                </Pressable>

                <Pressable
                  style={[styles.button, { backgroundColor: "#FFA500" }]}
                  onPress={limpiarFormulario}
                  disabled={loading}
                >
                  <Text style={styles.buttonText}>LIMPIAR CAMPOS</Text>
                </Pressable>

                <Pressable
                  style={[styles.button,]}
                  onPress={volver}
                  disabled={loading}
                >
                  <Text style={styles.buttonText}>VOLVER</Text>
                </Pressable>
              </View>
            </>
          )}

          {!pacienteValido && (
            <View style={{
              backgroundColor: "#F3E5F5",
              borderLeftColor: "#9C27B0",
              borderLeftWidth: 4,
              padding: 16,
              borderRadius: 6,
              marginVertical: 20,
              alignItems: 'center'
            }}>
              <Text style={{ color: "#6A1B9A", textAlign: 'center', fontWeight: 'bold' }}>
                👆 Ingresa el DNI y valida el paciente para continuar
              </Text>
            </View>
          )}

          {!pacienteValido && (
            <Pressable
              style={[styles.button,]}
              onPress={volver}
            >
              <Text style={styles.buttonText}>VOLVER</Text>
            </Pressable>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

export default InsertarReceta;