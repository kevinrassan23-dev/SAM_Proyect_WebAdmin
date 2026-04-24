import React, { useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { styles } from "@/styles/pages/management/recetas/BuscarRecetaStyle";
import { recetasService } from "@/services/firebase";
import { Receta } from "@/types/receta";
import { useAuthGuard } from "@/hooks/useAuthGuard";

function BuscarReceta() {
  useAuthGuard();

  // --- ESTADOS ---
  const [termino, setTermino] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [resultados, setResultados] = useState<Receta[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [buscoRealizado, setBuscoRealizado] = useState(false);

  /**
   * Convierte Timestamp de Firestore o Date nativo a un objeto Date de JavaScript.
   */
  const toDate = (campo: any): Date | null => {
    if (!campo) return null;
    if (campo instanceof Date) return campo;
    if (campo.seconds) return new Date(campo.seconds * 1000);
    return null;
  };

  /**
   * Verifica si el texto ingresado cumple con el formato de ID de receta (REC-seguido de números).
   */
  const esIdReceta = (t: string) => /^REC-\d+$/i.test(t.trim());

  /**
   * Ejecuta la lógica de filtrado sobre todas las recetas basándose en términos y fechas.
   */
  const handleBuscar = async () => {
    console.log(`[${new Date().toISOString()}] Iniciando búsqueda... Término: "${termino}", Rango: ${fechaInicio} a ${fechaFin}`);
    setLoading(true);
    setError("");
    setResultados([]);
    setBuscoRealizado(true);

    try {
      const todasLasRecetasRaw = await recetasService.obtenerTodas();
      const todasLasRecetas = (todasLasRecetasRaw ?? []).filter(Boolean);

      if (todasLasRecetas.length === 0) {
        console.warn(`[${new Date().toISOString()}] No se encontraron recetas en la base de datos.`);
        setError("No hay recetas registradas");
        return;
      }

      let recetasFiltradas = [...todasLasRecetas];
      const terminoSeguro = (termino ?? "").trim();
      const terminoUpper = terminoSeguro.toUpperCase();

      // --- FILTRO POR TÉRMINO (ID, DNI, CARTILLA, NOMBRE, ESPECIALISTA) ---
      if (terminoSeguro !== "") {
        if (esIdReceta(terminoSeguro)) {
          console.log(`[${new Date().toISOString()}] Aplicando filtro por ID exacto.`);
          recetasFiltradas = recetasFiltradas.filter((receta) =>
            (receta.ID_Receta ?? "").toUpperCase() === terminoUpper
          );
        } else {
          console.log(`[${new Date().toISOString()}] Aplicando filtro por coincidencia de texto.`);
          recetasFiltradas = recetasFiltradas.filter((receta) => {
            if (!receta) return false;
            const dni = (receta.DNI_Paciente ?? "").toString().toUpperCase();
            const cartilla = (receta.Num_Cartilla_Paciente ?? "").toString().toUpperCase();
            const especialista = (receta.Nombre_Especialista ?? "").toString().toUpperCase();
            const nombre = (receta.Nombre_Paciente ?? "").toString().toUpperCase();
            return (
              dni.includes(terminoUpper) ||
              cartilla.includes(terminoUpper) ||
              especialista.includes(terminoUpper) ||
              nombre.includes(terminoUpper)
            );
          });
        }
      }

      // --- FILTRO POR RANGO DE FECHAS ---
      if ((fechaInicio ?? "").trim() !== "" || (fechaFin ?? "").trim() !== "") {
        console.log(`[${new Date().toISOString()}] Aplicando filtros temporales.`);
        recetasFiltradas = recetasFiltradas.filter((receta) => {
          if (!receta?.Fecha_Inicio) return false;

          const fechaReceta = toDate(receta.Fecha_Inicio);
          if (!fechaReceta || isNaN(fechaReceta.getTime())) return false;

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

      console.log(`[${new Date().toISOString()}] Búsqueda finalizada. Resultados: ${recetasFiltradas.length}`);

      if (recetasFiltradas.length > 0) {
        setResultados(recetasFiltradas);
        setError("");
      } else {
        setError("No se encontraron recetas que coincidan con los criterios");
      }
    } catch (err: any) {
      console.error(`[${new Date().toISOString()}] Error en el proceso de búsqueda:`, err);
      setError(err?.message || "Error al buscar recetas");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Resetea los campos de búsqueda y limpia los resultados en pantalla.
   */
  const limpiarCampos = () => {
    console.log(`[${new Date().toISOString()}] Limpiando campos de búsqueda.`);
    setTermino("");
    setFechaInicio("");
    setFechaFin("");
    setResultados([]);
    setError("");
    setBuscoRealizado(false);
  };

  /**
   * Navega de vuelta a la pantalla de gestión de pedidos.
   */
  const volver = () => {
    console.log(`[${new Date().toISOString()}] Volviendo a la gestión de pedidos.`);
    router.push("/pages/management/pedidos/MostrarPedidos");
  };

  return (
    <ScrollView style={styles.outerScroll} contentContainerStyle={styles.outerScrollContent}>
      <View style={styles.container}>
        <Text style={styles.title}>Buscar Receta</Text>

        <View style={styles.formContainer}>
          {/* BANNER DE ERROR */}
          {error && (
            <View style={{ backgroundColor: "#FFE6E6", padding: 12, borderRadius: 6, marginBottom: 16 }}>
              <Text style={{ color: "#FF6B6B", fontWeight: "bold" }}>⚠️ {error}</Text>
            </View>
          )}

          {/* INPUT DE TÉRMINO GENERAL */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Buscar por ID, DNI, Cartilla, Nombre o Especialista:</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: REC-001 o 12345678A o Dr. García"
              placeholderTextColor="#999"
              value={termino}
              onChangeText={(text) => setTermino(text ?? "")}
              editable={!loading}
              autoCapitalize="characters"
            />
          </View>

          {/* FILTROS POR FECHA */}
          <View style={styles.filtroFechas}>
            <Text style={styles.label}>Filtro de Fechas (opcional):</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.labelSecundario}>Fecha Inicio (YYYY-MM-DD):</Text>
              <TextInput
                style={styles.input}
                placeholder="2026-01-01"
                value={fechaInicio}
                onChangeText={(text) => setFechaInicio(text ?? "")}
                editable={!loading}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.labelSecundario}>Fecha Fin (YYYY-MM-DD):</Text>
              <TextInput
                style={styles.input}
                placeholder="2026-12-31"
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
            <Text style={styles.buttonText}>{loading ? "BUSCANDO..." : "BUSCAR"}</Text>
          </Pressable>

          {/* LISTADO DE RESULTADOS */}
          {!loading && buscoRealizado && resultados.length > 0 && (
            <View style={styles.resultadosContainer}>
              <Text style={styles.subtitle}>Resultados ({resultados.length})</Text>

              {resultados.map((receta, index) => {
                const fechaInicioDate = toDate(receta?.Fecha_Inicio);
                const fechaExpiracionDate = toDate(receta?.Fecha_Expiracion);

                return (
                  <View key={index} style={styles.tarjeta}>
                    <Text style={styles.tarjetaTitulo}>
                      ID: {receta?.ID_Receta ?? "Sin ID"}
                    </Text>

                    <View style={{ marginTop: 10, gap: 8 }}>
                      <Text style={styles.tarjetaTexto}>
                        <Text style={{ fontWeight: 'bold' }}>Paciente:</Text>{" "}
                        {receta?.Nombre_Paciente ?? "No disponible"}
                      </Text>

                      <Text style={styles.tarjetaTexto}>
                        <Text style={{ fontWeight: 'bold' }}>DNI:</Text>{" "}
                        {receta?.DNI_Paciente ?? "No disponible"}
                      </Text>

                      <Text style={styles.tarjetaTexto}>
                        <Text style={{ fontWeight: 'bold' }}>Nº Cartilla:</Text>{" "}
                        {receta?.Num_Cartilla_Paciente ?? "No disponible"}
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
                        <Text style={{ fontWeight: 'bold' }}>Medicamentos:</Text>{" "}
                        {receta?.Medicamentos_Recetados ?? "No disponible"}
                      </Text>

                      <Text style={styles.tarjetaTexto}>
                        <Text style={{ fontWeight: 'bold' }}>Centro:</Text>{" "}
                        {receta?.Direccion_Centro ?? "No disponible"}
                      </Text>

                      <Text style={styles.tarjetaTexto}>
                        <Text style={{ fontWeight: 'bold' }}>Fecha Inicio:</Text>{" "}
                        {fechaInicioDate ? fechaInicioDate.toLocaleDateString('es-ES') : "No disponible"}
                      </Text>

                      <Text style={styles.tarjetaTexto}>
                        <Text style={{ fontWeight: 'bold' }}>Fecha Expiración:</Text>{" "}
                        {fechaExpiracionDate ? fechaExpiracionDate.toLocaleDateString('es-ES') : "No disponible"}
                      </Text>

                      <Text style={[styles.tarjetaTexto, { color: receta?.Activa ? '#4CAF50' : '#F44336', fontWeight: 'bold' }]}>
                        Estado: {receta?.Activa ? '✓ Activa' : '✗ Inactiva'}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          )}

          {/* MENSAJE DE RESULTADOS VACÍOS */}
          {!loading && buscoRealizado && resultados.length === 0 && !error && (
            <View style={{ backgroundColor: "#E3F2FD", padding: 16, borderRadius: 8, marginVertical: 16, alignItems: 'center' }}>
              <Text style={{ color: "#1976D2", textAlign: 'center' }}>
                No se encontraron recetas que coincidan con los criterios
              </Text>
            </View>
          )}

          <View style={styles.botonesContainer}>
            <Pressable
              style={[styles.button, { backgroundColor: "#FFC107" }]}
              onPress={limpiarCampos}
              disabled={loading}
            >
              <Text style={styles.buttonText}>LIMPIAR CAMPOS</Text>
            </Pressable>

            <Pressable style={[styles.button]} onPress={volver}>
              <Text style={styles.buttonText}>VOLVER</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

export default BuscarReceta;