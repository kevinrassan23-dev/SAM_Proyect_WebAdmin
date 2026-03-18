import React, { useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView, Alert, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { styles } from "../../styles/EliminarRecetaStyle";
import { recetasService } from "@/services/firebase";
import { Receta } from "@/types";

function EliminarReceta() {
  const [fase, setFase] = useState<'buscar' | 'lista' | 'confirmar'>('buscar');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [busquedaTermino, setBusquedaTermino] = useState("");
  const [resultados, setResultados] = useState<Receta[]>([]);
  const [recetaSeleccionada, setRecetaSeleccionada] = useState<Receta | null>(null);

  const formatearFecha = (fecha: any): string => {
    try {
      if (fecha && typeof fecha.toDate === 'function') return fecha.toDate().toLocaleDateString('es-ES');
      if (fecha instanceof Date) return fecha.toLocaleDateString('es-ES');
      return new Date(fecha).toLocaleDateString('es-ES');
    } catch {
      return "Fecha inválida";
    }
  };

  // ✅ BUSCAR POR DNI O ESPECIALISTA
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
        setRecetaSeleccionada(encontradas[0]);
        setFase('confirmar');
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

  // ✅ SELECCIONAR DE LA LISTA
  const seleccionarReceta = (receta: Receta) => {
    setRecetaSeleccionada(receta);
    setFase('confirmar');
  };

  // ✅ ELIMINAR
  const handleEliminar = async () => {
    if (!recetaSeleccionada) return;

    setLoading(true);
    setError("");

    try {
      await recetasService.eliminarReceta(recetaSeleccionada.ID_Receta);
      Alert.alert("Éxito", "Receta eliminada correctamente", [{ text: "OK", onPress: resetear }]);
    } catch (err: any) {
      setError(err.message || "Error al eliminar receta");
    } finally {
      setLoading(false);
    }
  };

  const resetear = () => {
    setBusquedaTermino("");
    setResultados([]);
    setRecetaSeleccionada(null);
    setError("");
    setFase('buscar');
  };

  const TarjetaReceta = ({ receta }: { receta: Receta }) => (
    <View style={styles.tarjeta}>
      <View style={{ gap: 8 }}>
        <Text style={styles.tarjetaTexto}>
          <Text style={{ fontWeight: 'bold' }}>DNI Paciente: </Text>{receta.DNI_Paciente}
        </Text>
        <Text style={styles.tarjetaTexto}>
          <Text style={{ fontWeight: 'bold' }}>Especialista: </Text>{receta.Nombre_Especialista}
        </Text>
        <Text style={styles.tarjetaTexto}>
          <Text style={{ fontWeight: 'bold' }}>Afecciones: </Text>{receta.Afecciones}
        </Text>
        <Text style={styles.tarjetaTexto}>
          <Text style={{ fontWeight: 'bold' }}>Centro: </Text>{receta.Direccion_Centro}
        </Text>
        <Text style={styles.tarjetaTexto}>
          <Text style={{ fontWeight: 'bold' }}>Fecha: </Text>{formatearFecha(receta.Fecha)}
        </Text>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.outerScroll} contentContainerStyle={styles.outerScrollContent}>
      <View style={styles.container}>
        <Text style={styles.title}>Eliminar Receta</Text>

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
                {"Se encontraron " + resultados.length + " recetas — selecciona una para eliminar:"}
              </Text>

              {resultados.map((r) => (
                <Pressable
                  key={r.ID_Receta}
                  onPress={() => seleccionarReceta(r)}
                  style={{
                    backgroundColor: "#FFF5F5",
                    borderWidth: 1,
                    borderColor: "#FF6B6B",
                    borderRadius: 8,
                    padding: 12,
                    marginBottom: 10,
                  }}
                >
                  <Text style={{ fontWeight: 'bold' }}>{"DNI: " + r.DNI_Paciente}</Text>
                  <Text>{"Especialista: " + r.Nombre_Especialista}</Text>
                  <Text>{"Afecciones: " + r.Afecciones}</Text>
                  <Text>{"Fecha: " + formatearFecha(r.Fecha)}</Text>
                </Pressable>
              ))}

              <Pressable style={[styles.button, { backgroundColor: "#9E9E9E" }]} onPress={resetear}>
                <Text style={styles.buttonText}>NUEVA BÚSQUEDA</Text>
              </Pressable>
            </View>
          )}

          {/* FASE 3: CONFIRMACIÓN */}
          {fase === 'confirmar' && recetaSeleccionada && (
            <View>
              <View style={{
                backgroundColor: "#FFF3CD",
                borderLeftColor: "#FFC107",
                borderLeftWidth: 4,
                padding: 16,
                borderRadius: 8,
                marginBottom: 20,
              }}>
                <Text style={{ color: "#856404", fontWeight: 'bold', fontSize: 16, marginBottom: 8 }}>
                  ⚠️ Advertencia
                </Text>
                <Text style={{ color: "#856404", fontSize: 14, lineHeight: 20 }}>
                  ¿Estás seguro de que deseas eliminar esta receta?
                </Text>
                <Text style={{ color: "#856404", fontSize: 12, marginTop: 8, fontStyle: 'italic' }}>
                  Esta acción no se puede deshacer.
                </Text>
              </View>

              <TarjetaReceta receta={recetaSeleccionada} />

              {loading && (
                <View style={{ alignItems: 'center', marginVertical: 20 }}>
                  <ActivityIndicator size="large" color="#FF6B6B" />
                  <Text style={{ marginTop: 10, color: '#666' }}>Eliminando...</Text>
                </View>
              )}

              <View style={styles.botonesContainer}>
                <Pressable
                  style={[styles.button, styles.buttonDelete, loading && { opacity: 0.5 }]}
                  onPress={handleEliminar}
                  disabled={loading}
                >
                  <Text style={styles.buttonText}>{loading ? "ELIMINANDO..." : "ELIMINAR DEFINITIVAMENTE"}</Text>
                </Pressable>

                <Pressable
                  style={[styles.button, { backgroundColor: "#9E9E9E" }]}
                  onPress={resetear}
                  disabled={loading}
                >
                  <Text style={styles.buttonText}>CANCELAR</Text>
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

export default EliminarReceta;