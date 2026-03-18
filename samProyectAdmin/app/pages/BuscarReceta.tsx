import React, { useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { styles } from "../../styles/BuscarRecetaStyle";
import { recetasService } from "@/services/firebase";
import { Receta } from "@/types";

function BuscarReceta() {
  const [termino, setTermino] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [resultados, setResultados] = useState<Receta[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [buscoRealizado, setBuscoRealizado] = useState(false);

  const handleBuscar = async () => {
    setLoading(true);
    setError("");
    setResultados([]);
    setBuscoRealizado(true);

    try {
      console.log("🔍 Buscando recetas...");

      const todasLasRecetasRaw = await recetasService.obtenerTodas();

      // 🔥 ELIMINAMOS undefined / null DEL ARRAY
      const todasLasRecetas = (todasLasRecetasRaw ?? []).filter(Boolean);

      if (todasLasRecetas.length === 0) {
        setError("No hay recetas registradas");
        return;
      }

      let recetasFiltradas = [...todasLasRecetas];

      const terminoSeguro = (termino ?? "").trim();
      const terminoUpper = terminoSeguro.toUpperCase();

      // 🔐 FILTRO SEGURO POR TEXTO
      if (terminoSeguro !== "") {
        recetasFiltradas = recetasFiltradas.filter((receta) => {
          if (!receta) return false;

          const id = (receta.ID_Receta ?? "").toString();
          const dni = (receta.DNI_Paciente ?? "").toString().toUpperCase();
          const especialista = (receta.Nombre_Especialista ?? "").toString().toUpperCase();

          return (
            id.includes(terminoSeguro) ||
            dni.includes(terminoUpper) ||
            especialista.includes(terminoUpper)
          );
        });
      }

      // 🔐 FILTRO SEGURO POR FECHAS
      if ((fechaInicio ?? "").trim() !== "" || (fechaFin ?? "").trim() !== "") {
        recetasFiltradas = recetasFiltradas.filter((receta) => {
          if (!receta?.Fecha) return false;

          const fechaReceta = new Date(receta.Fecha);
          if (isNaN(fechaReceta.getTime())) return false;

          if ((fechaInicio ?? "").trim() !== "") {
            const inicio = new Date(fechaInicio);
            if (!isNaN(inicio.getTime()) && fechaReceta < inicio) return false;
          }

          if ((fechaFin ?? "").trim() !== "") {
            const fin = new Date(fechaFin);
            if (!isNaN(fin.getTime()) && fechaReceta > fin) return false;
          }

          return true;
        });
      }

      if (recetasFiltradas.length > 0) {
        setResultados(recetasFiltradas);
        setError("");
      } else {
        setError("No se encontraron recetas que coincidan con los criterios");
      }

    } catch (err: any) {
      console.error("❌ Error:", err);
      setError(err?.message || "Error al buscar recetas");
    } finally {
      setLoading(false);
    }
  };

  const limpiarCampos = () => {
    setTermino("");
    setFechaInicio("");
    setFechaFin("");
    setResultados([]);
    setError("");
    setBuscoRealizado(false);
  };

  const volver = () => {
    router.back();
  };

  return (
    <ScrollView style={styles.outerScroll} contentContainerStyle={styles.outerScrollContent}>
      <View style={styles.container}>
        <Text style={styles.title}>Buscar Receta</Text>

        <View style={styles.formContainer}>

          {error && (
            <View style={{ backgroundColor: "#FFE6E6", padding: 12, borderRadius: 6, marginBottom: 16 }}>
              <Text style={{ color: "#FF6B6B", fontWeight: "bold" }}>⚠️ {error}</Text>
            </View>
          )}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Buscar por ID, DNI o Especialista:</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: REC001 o 12345678A o Dr. García"
              placeholderTextColor="#999"
              value={termino}
              onChangeText={(text) => setTermino(text ?? "")}
              editable={!loading}
              autoCapitalize="characters"
            />
          </View>

          <View style={styles.filtroFechas}>
            <Text style={styles.label}>Filtro de Fechas (opcional):</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.labelSecundario}>Fecha Inicio (YYYY-MM-DD):</Text>
              <TextInput
                style={styles.input}
                placeholder="2025-01-01"
                value={fechaInicio}
                onChangeText={(text) => setFechaInicio(text ?? "")}
                editable={!loading}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.labelSecundario}>Fecha Fin (YYYY-MM-DD):</Text>
              <TextInput
                style={styles.input}
                placeholder="2025-12-31"
                value={fechaFin}
                onChangeText={(text) => setFechaFin(text ?? "")}
                editable={!loading}
              />
            </View>
          </View>

          {loading && (
            <View style={{ alignItems: 'center', marginVertical: 20 }}>
              <ActivityIndicator size="large" color="#2196F3" />
              <Text style={{ marginTop: 10, color: '#666' }}>Buscando recetas...</Text>
            </View>
          )}

          <Pressable
            style={[styles.button, styles.buttonSearch, loading && { opacity: 0.5 }]}
            onPress={handleBuscar}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "BUSCANDO..." : "BUSCAR"}
            </Text>
          </Pressable>

          {!loading && buscoRealizado && resultados.length > 0 && (
            <View style={styles.resultadosContainer}>
              <Text style={styles.subtitle}>Resultados ({resultados.length})</Text>

              {resultados.map((receta, index) => {
                const fechaValida = receta?.Fecha ? new Date(receta.Fecha) : null;

                return (
                  <View key={index} style={styles.tarjeta}>
                    <Text style={styles.tarjetaTitulo}>
                      ID: {receta?.ID_Receta ?? "Sin ID"}
                    </Text>

                    <View style={{ marginTop: 10, gap: 8 }}>
                      <Text style={styles.tarjetaTexto}>
                        <Text style={{ fontWeight: 'bold' }}>DNI Paciente:</Text>{" "}
                        {receta?.DNI_Paciente ?? "No disponible"}
                      </Text>

                      <Text style={styles.tarjetaTexto}>
                        <Text style={{ fontWeight: 'bold' }}>Especialista:</Text>{" "}
                        {receta?.Nombre_Especialista ?? "No disponible"}
                      </Text>

                      <Text style={styles.tarjetaTexto}>
                        <Text style={{ fontWeight: 'bold' }}>Afecciones:</Text>{" "}
                        {receta?.Afecciones ?? "No disponible"}
                      </Text>

                      <Text style={styles.tarjetaTexto}>
                        <Text style={{ fontWeight: 'bold' }}>Centro:</Text>{" "}
                        {receta?.Direccion_Centro ?? "No disponible"}
                      </Text>

                      <Text style={styles.tarjetaTexto}>
                        <Text style={{ fontWeight: 'bold' }}>Fecha:</Text>{" "}
                        {fechaValida && !isNaN(fechaValida.getTime())
                          ? fechaValida.toLocaleDateString('es-ES')
                          : "Fecha inválida"}
                      </Text>

                      <Text style={[
                        styles.tarjetaTexto,
                        {
                          color: receta?.Activa ? '#4CAF50' : '#F44336',
                          fontWeight: 'bold'
                        }
                      ]}>
                        Estado: {receta?.Activa ? '✓ Activa' : '✗ Inactiva'}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          )}

          {!loading && buscoRealizado && resultados.length === 0 && !error && (
            <View style={{
              backgroundColor: "#E3F2FD",
              padding: 16,
              borderRadius: 8,
              marginVertical: 16,
              alignItems: 'center'
            }}>
              <Text style={{ color: "#1976D2", textAlign: 'center' }}>
                No se encontraron recetas que coincidan con los criterios
              </Text>
            </View>
          )}

          <View style={styles.botonesContainer}>
            <Pressable
              style={[styles.button, {backgroundColor: "#FFC107"}]}
              onPress={limpiarCampos}
              disabled={loading}
            >
              <Text style={styles.buttonText}>LIMPIAR CAMPOS</Text>
            </Pressable>

            <Pressable
              style={[styles.button,]}
              onPress={volver}
            >
              <Text style={styles.buttonText}>VOLVER</Text>
            </Pressable>
          </View>

        </View>
      </View>
    </ScrollView>
  );
}

export default BuscarReceta;