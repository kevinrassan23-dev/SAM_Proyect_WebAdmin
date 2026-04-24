import React, { useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView, ActivityIndicator, Platform, Alert } from "react-native";
import { router } from "expo-router";
import { styles } from "@/styles/pages/management/medicamentos/BuscarMedicamentoStyle";
import { medicamentosService } from "@/services/supabase/medicamentos";
import { Medicamento } from "@/types/medicamento";
import { useAuthGuard } from "@/hooks/useAuthGuard";

/**
 * Valida si un string cumple con el patrón de identificador de medicamento (MED-seguido de números).
 * @param t Texto a evaluar.
 * @returns boolean indicando si coincide con el patrón.
 */
const esIdMedicamento = (t: string) => /^MED-\d+$/i.test(t.trim());

function BuscarMedicamento() {
  useAuthGuard();

  // --- ESTADOS ---
  const [termino, setTermino] = useState("");
  const [familia, setFamilia] = useState("");
  const [resultados, setResultados] = useState<Medicamento[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [buscoRealizado, setBuscoRealizado] = useState(false);

  /**
   * Ejecuta la lógica de filtrado de medicamentos basándose en los criterios de búsqueda.
   */
  const handleBuscar = async () => {
    console.log(`[${new Date().toISOString()}] Ejecutando búsqueda. Término: "${termino}", Familia: "${familia}"`);
    
    setLoading(true);
    setError("");
    setResultados([]);
    setBuscoRealizado(true);

    try {
      const todosRaw = await medicamentosService.obtenerTodos();
      const todos = (todosRaw ?? []).filter(Boolean);

      if (todos.length === 0) {
        console.warn(`[${new Date().toISOString()}] La base de datos de medicamentos está vacía.`);
        setError("No hay medicamentos registrados");
        return;
      }

      let filtrados = [...todos];
      const terminoSeguro = (termino ?? "").trim();
      const terminoUpper = terminoSeguro.toUpperCase();

      // --- FILTRO POR TEXTO (ID, NOMBRE, MARCA O FAMILIA) ---
      if (terminoSeguro !== "") {
        if (esIdMedicamento(terminoSeguro)) {
          console.log(`[${new Date().toISOString()}] Búsqueda por ID exacto detectada.`);
          filtrados = filtrados.filter(m =>
            (m.ID_Medicamento ?? "").toUpperCase() === terminoUpper
          );
        } else {
          filtrados = filtrados.filter(m => {
            if (!m) return false;
            const id = (m.ID_Medicamento ?? "").toUpperCase();
            const nombre = (m.Nombre ?? "").toUpperCase();
            const marca = (m.Marca ?? "").toUpperCase();
            const familiaM = (m.Familia ?? "").toUpperCase();
            return (
              id.includes(terminoUpper) ||
              nombre.includes(terminoUpper) ||
              marca.includes(terminoUpper) ||
              familiaM.includes(terminoUpper)
            );
          });
        }
      }

      // --- FILTRO ADICIONAL ESPECÍFICO POR FAMILIA ---
      if ((familia ?? "").trim() !== "") {
        const familiaUpper = familia.trim().toUpperCase();
        filtrados = filtrados.filter(m =>
          (m.Familia ?? "").toUpperCase().includes(familiaUpper)
        );
      }

      if (filtrados.length > 0) {
        console.log(`[${new Date().toISOString()}] Se encontraron ${filtrados.length} resultados.`);
        setResultados(filtrados);
        setError("");
      } else {
        console.log(`[${new Date().toISOString()}] No hay coincidencias para los criterios.`);
        setError("No se encontraron medicamentos que coincidan con los criterios");
      }
    } catch (err: any) {
      console.error(`[${new Date().toISOString()}] Error en handleBuscar:`, err);
      setError(err?.message || "Error al buscar medicamentos");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Resetea los filtros y los resultados de la búsqueda.
   */
  const limpiarCampos = () => {
    console.log(`[${new Date().toISOString()}] Limpiando campos de búsqueda.`);
    setTermino("");
    setFamilia("");
    setResultados([]);
    setError("");
    setBuscoRealizado(false);
  };

  /**
   * Regresa a la pantalla de gestión de pedidos.
   */
  const volver = () => {
    console.log(`[${new Date().toISOString()}] Saliendo de búsqueda de medicamentos.`);
    router.push("/pages/management/pedidos/MostrarPedidos");
  };

  return (
    <ScrollView style={styles.outerScroll} contentContainerStyle={styles.outerScrollContent}>
      <View style={styles.container}>
        <Text style={styles.title}>Buscar Medicamento</Text>

        <View style={styles.formContainer}>
          {error && (
            <View style={{ backgroundColor: "#FFE6E6", padding: 12, borderRadius: 6, marginBottom: 16 }}>
              <Text style={{ color: "#FF6B6B", fontWeight: "bold" }}>⚠️ {error}</Text>
            </View>
          )}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Buscar por ID, Nombre o Marca:</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: MED-001 o Paracetamol o Normon"
              placeholderTextColor="#999"
              value={termino}
              onChangeText={(text) => setTermino(text ?? "")}
              editable={!loading}
              autoCapitalize="characters"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Filtro por Familia (opcional):</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: Analgésicos, Antibióticos"
              placeholderTextColor="#999"
              value={familia}
              onChangeText={(text) => setFamilia(text ?? "")}
              editable={!loading}
            />
          </View>

          {loading && (
            <View style={{ alignItems: 'center', marginVertical: 20 }}>
              <ActivityIndicator size="large" color="#2196F3" />
              <Text style={{ marginTop: 10, color: '#666' }}>Buscando medicamentos...</Text>
            </View>
          )}

          <Pressable
            style={[styles.button, styles.buttonSearch, loading && { opacity: 0.5 }]}
            onPress={handleBuscar}
            disabled={loading}
          >
            <Text style={styles.buttonText}>{loading ? "BUSCANDO..." : "BUSCAR"}</Text>
          </Pressable>

          {!loading && buscoRealizado && resultados.length > 0 && (
            <View style={styles.resultadosContainer}>
              <Text style={styles.subtitle}>Resultados ({resultados.length})</Text>

              {resultados.map((med, index) => (
                <View key={med.ID_Medicamento ?? `med-${index}`} style={styles.tarjeta}>
                  <View style={styles.tarjetaHeader}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.tarjetaTitulo}>{med.Nombre}</Text>
                      <Text style={styles.tarjetaMarca}>{med.Marca}</Text>
                    </View>
                    <View style={[styles.tipoBadge, { backgroundColor: med.Tipo === 'con_receta' ? '#E3F2FD' : '#E8F5E9' }]}>
                      <Text style={[styles.tipoTexto, { color: med.Tipo === 'con_receta' ? '#1565C0' : '#2E7D32' }]}>
                        {med.Tipo === 'con_receta' ? 'Con Receta' : 'Sin Receta'}
                      </Text>
                    </View>
                  </View>

                  <View style={{ marginTop: 10, gap: 8 }}>
                    <Text style={styles.tarjetaTexto}>
                      <Text style={{ fontWeight: 'bold' }}>ID:</Text> {med.ID_Medicamento}
                    </Text>
                    <Text style={styles.tarjetaTexto}>
                      <Text style={{ fontWeight: 'bold' }}>Familia:</Text> {med.Familia}
                    </Text>
                    <Text style={styles.tarjetaTexto}>
                      <Text style={{ fontWeight: 'bold' }}>Precio:</Text> €{med.Precio?.toFixed(2)}
                    </Text>
                    <Text style={styles.tarjetaTexto}>
                      <Text style={{ fontWeight: 'bold' }}>Stock:</Text> {med.Stock} unidades
                    </Text>
                    {med.Descripcion ? (
                      <Text style={styles.tarjetaTexto}>
                        <Text style={{ fontWeight: 'bold' }}>Descripción:</Text> {med.Descripcion}
                      </Text>
                    ) : null}
                    {med.Fecha_Envase ? (
                      <Text style={styles.tarjetaTexto}>
                        <Text style={{ fontWeight: 'bold' }}>Fecha Envase:</Text> {
                          med.Fecha_Envase instanceof Date 
                            ? med.Fecha_Envase.toLocaleDateString() 
                            : String(med.Fecha_Envase)
                        }
                      </Text>
                    ) : null}
                    {med.Fecha_Caducidad ? (
                      <Text style={styles.tarjetaTexto}>
                        <Text style={{ fontWeight: 'bold' }}>Fecha Caducidad:</Text> {
                          med.Fecha_Caducidad instanceof Date 
                            ? med.Fecha_Caducidad.toLocaleDateString() 
                            : String(med.Fecha_Caducidad)
                        }
                      </Text>
                    ) : null}
                    <Text style={[styles.tarjetaTexto, { color: med.Activo ? '#4CAF50' : '#F44336', fontWeight: 'bold' }]}>
                      Estado: {med.Activo ? '✓ Disponible' : '✗ No disponible'}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {!loading && buscoRealizado && resultados.length === 0 && !error && (
            <View style={{ backgroundColor: "#E3F2FD", padding: 16, borderRadius: 8, marginVertical: 16, alignItems: 'center' }}>
              <Text style={{ color: "#1976D2", textAlign: 'center' }}>
                No se encontraron medicamentos que coincidan con los criterios
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

export default BuscarMedicamento;