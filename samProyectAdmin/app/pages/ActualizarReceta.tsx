import React, { useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView, Alert, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { styles } from "../../styles/ActualizarRecetaStyle";
import { recetasService } from "@/services/firebase";
import { Receta } from "@/types";

function ActualizarReceta() {
  const [fase, setFase] = useState<'buscar' | 'lista' | 'editar'>('buscar');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [busquedaTermino, setBusquedaTermino] = useState("");
  const [resultados, setResultados] = useState<Receta[]>([]);

  const [idReceta, setIdReceta] = useState("");
  const [dniPaciente, setDniPaciente] = useState("");
  const [nombreEspecialista, setNombreEspecialista] = useState("");
  const [afecciones, setAfecciones] = useState("");
  const [direccionCentro, setDireccionCentro] = useState("");
  const [fecha, setFecha] = useState("");
  const [recetaOriginal, setRecetaOriginal] = useState<Receta | null>(null);

  const handleBuscar = async () => {
    if (busquedaTermino.trim() === "") {
      setError("Ingresa un DNI o nombre de especialista");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const encontradas = await recetasService.buscarRecetas(busquedaTermino.trim());
      if (encontradas.length === 0) {
        setError("No se encontraron recetas");
      } else if (encontradas.length === 1) {
        seleccionarReceta(encontradas[0]);
      } else {
        setResultados(encontradas);
        setFase('lista');
      }
    } catch (err: any) {
      setError(err.message || "Error al buscar");
    } finally {
      setLoading(false);
    }
  };

  const seleccionarReceta = (receta: Receta) => {
    setRecetaOriginal(receta);
    cargarDatosFormulario(receta);
    setFase('editar');
  };

  const cargarDatosFormulario = (receta: Receta) => {
    setIdReceta(receta.ID_Receta);
    setDniPaciente(receta.DNI_Paciente);
    setNombreEspecialista(receta.Nombre_Especialista);
    setAfecciones(receta.Afecciones);
    setDireccionCentro(receta.Direccion_Centro);

    const f = receta.Fecha as any;
    let fechaJS: Date;
    if (f && typeof f.toDate === 'function') {
      fechaJS = f.toDate();
    } else if (f instanceof Date) {
      fechaJS = f;
    } else {
      fechaJS = new Date(f);
    }
    setFecha(fechaJS.toISOString().split("T")[0]);
  };

  const validarFormulario = (): string | null => {
    if (!nombreEspecialista.trim()) return "Nombre del especialista es requerido";
    if (!afecciones.trim()) return "Afecciones es requerido";
    if (!direccionCentro.trim()) return "Dirección del centro es requerida";
    if (!fecha.trim()) return "Fecha es requerida";
    if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) return "Fecha debe estar en formato YYYY-MM-DD";
    return null;
  };

  const handleActualizar = async () => {
    const validacionError = validarFormulario();
    if (validacionError) { setError(validacionError); return; }

    setLoading(true);
    setError("");
    try {
      await recetasService.actualizarReceta(idReceta, {
        Nombre_Especialista: nombreEspecialista,
        Afecciones: afecciones,
        Direccion_Centro: direccionCentro,
        Fecha: new Date(fecha),
      });
      Alert.alert("Éxito", "Receta actualizada correctamente", [{ text: "OK", onPress: resetear }]);
    } catch (err: any) {
      setError(err.message || "Error al actualizar receta");
    } finally {
      setLoading(false);
    }
  };

  const resetear = () => {
    setBusquedaTermino("");
    setIdReceta("");
    setDniPaciente("");
    setNombreEspecialista("");
    setAfecciones("");
    setDireccionCentro("");
    setFecha("");
    setRecetaOriginal(null);
    setResultados([]);
    setError("");
    setFase('buscar');
  };

  return (
    <ScrollView style={styles.outerScroll} contentContainerStyle={styles.outerScrollContent}>
      <View style={styles.container}>
        <Text style={styles.title}>Actualizar Receta</Text>

        <View style={styles.formContainer}>

          {error !== "" && (
            <View style={{ backgroundColor: "#FFE6E6", padding: 12, borderRadius: 6, marginBottom: 16 }}>
              <Text style={{ color: "#FF6B6B", fontWeight: "bold" }}>{"⚠️ " + error}</Text>
            </View>
          )}

          {/* FASE 1: BÚSQUEDA */}
          {fase === 'buscar' && (
            <View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>DNI del Paciente o Nombre del Especialista:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ej: 12345678A o Dr. García"
                  placeholderTextColor="#999"
                  value={busquedaTermino}
                  onChangeText={setBusquedaTermino}
                  editable={!loading}
                />
              </View>

              {loading && (
                <View style={{ alignItems: 'center', marginVertical: 20 }}>
                  <ActivityIndicator size="large" color="#2196F3" />
                  <Text style={{ marginTop: 10, color: '#666' }}>Buscando...</Text>
                </View>
              )}

              <Pressable
                style={[styles.button, styles.buttonSearch, loading && { opacity: 0.5 }]}
                onPress={handleBuscar}
                disabled={loading}
              >
                <Text style={styles.buttonText}>{loading ? "BUSCANDO..." : "BUSCAR"}</Text>
              </Pressable>
            </View>
          )}

          {/* FASE 2: LISTA DE RESULTADOS */}
          {fase === 'lista' && (
            <View>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#2196F3', marginBottom: 12 }}>
                {"Se encontraron " + resultados.length + " recetas — selecciona una:"}
              </Text>

              {resultados.map((r) => (
                <Pressable
                  key={r.ID_Receta}
                  onPress={() => seleccionarReceta(r)}
                  style={{
                    backgroundColor: "#F0F8FF",
                    borderWidth: 1,
                    borderColor: "#2196F3",
                    borderRadius: 8,
                    padding: 12,
                    marginBottom: 10,
                  }}
                >
                  <Text style={{ fontWeight: 'bold' }}>{"DNI: " + r.DNI_Paciente}</Text>
                  <Text>{"Especialista: " + r.Nombre_Especialista}</Text>
                  <Text>{"Afecciones: " + r.Afecciones}</Text>
                </Pressable>
              ))}

              <Pressable style={[styles.button, styles.buttonCancel]} onPress={resetear}>
                <Text style={styles.buttonText}>NUEVA BÚSQUEDA</Text>
              </Pressable>
            </View>
          )}

          {/* FASE 3: EDICIÓN */}
          {fase === 'editar' && (
            <View>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#2196F3', marginBottom: 16 }}>
                ✓ Editando receta
              </Text>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>DNI Paciente (No editable):</Text>
                <TextInput
                  style={[styles.input, styles.inputReadonly]}
                  value={dniPaciente}
                  editable={false}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Nombre del Especialista:</Text>
                <TextInput
                  style={styles.input}
                  value={nombreEspecialista}
                  onChangeText={setNombreEspecialista}
                  editable={!loading}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Afecciones:</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={afecciones}
                  onChangeText={setAfecciones}
                  multiline
                  numberOfLines={3}
                  editable={!loading}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Dirección del Centro:</Text>
                <TextInput
                  style={styles.input}
                  value={direccionCentro}
                  onChangeText={setDireccionCentro}
                  editable={!loading}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Fecha (YYYY-MM-DD):</Text>
                <TextInput
                  style={styles.input}
                  value={fecha}
                  onChangeText={setFecha}
                  editable={!loading}
                />
              </View>

              {loading && (
                <View style={{ alignItems: 'center', marginVertical: 20 }}>
                  <ActivityIndicator size="large" color="#2196F3" />
                  <Text style={{ marginTop: 10, color: '#666' }}>Guardando cambios...</Text>
                </View>
              )}

              <View style={styles.botonesContainer}>
                <Pressable
                  style={[styles.button, styles.buttonSearch, loading && { opacity: 0.5 }]}
                  onPress={handleActualizar}
                  disabled={loading}
                >
                  <Text style={styles.buttonText}>{loading ? "GUARDANDO..." : "GUARDAR CAMBIOS"}</Text>
                </Pressable>

                <Pressable
                  style={[styles.button, styles.buttonCancel]}
                  onPress={() => { if (recetaOriginal) cargarDatosFormulario(recetaOriginal); }}
                  disabled={loading}
                >
                  <Text style={styles.buttonText}>DESHACER CAMBIOS</Text>
                </Pressable>

                <Pressable
                  style={[styles.button, {backgroundColor: "#FFA500"}]}
                  onPress={resetear}
                  disabled={loading}
                >
                  <Text style={styles.buttonText}>NUEVA BÚSQUEDA</Text>
                </Pressable>
              </View>
            </View>
          )}

          <View style={[styles.botonesContainer, { marginTop: 10 }]}>
            <Pressable
              style={[styles.button,]}
              onPress={() => router.push("/pages/DashboardRecetas")}
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

export default ActualizarReceta;