import React, { useState } from "react";
import { View, Text, Pressable, ScrollView, TextInput, Alert, ActivityIndicator, Platform } from "react-native";
import { router } from "expo-router";
import { styles } from "@/styles/pages/management/medicamentos/EliminarMedicamentoStyle";
import { medicamentosService } from "@/services/supabase/medicamentos";
import { Medicamento } from "@/types/medicamento";
import { Ionicons } from "@expo/vector-icons";
import theme from "@/theme/Theme";
import { useAuthGuard } from "@/hooks/useAuthGuard";

/**
 * Muestra alertas nativas o de navegador según la plataforma activa.
 */
const alertar = (titulo: string, mensaje: string, onOk?: () => void) => {
  if (Platform.OS === "web") {
    window.alert(`${titulo}\n\n${mensaje}`);
    onOk?.();
  } else {
    Alert.alert(titulo, mensaje, [{ text: "OK", onPress: onOk }]);
  }
};

function EliminarMedicamento() {
  useAuthGuard();

  // --- ESTADOS ---
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [busquedaTermino, setBusquedaTermino] = useState("");
  const [medEncontrado, setMedEncontrado] = useState<Medicamento | null>(null);
  const [listaMedicamentos, setListaMedicamentos] = useState<Medicamento[]>([]);
  const [mostrandoTodos, setMostrandoTodos] = useState(false);
  const [confirmacion, setConfirmacion] = useState(false);

  /**
   * Busca medicamentos filtrando por ID, nombre, marca o familia.
   */
  const handleBuscar = async () => {
    console.log(`[${new Date().toISOString()}] Iniciando búsqueda con término: ${busquedaTermino}`);
    setLoading(true);
    setError("");
    setMedEncontrado(null);
    setMostrandoTodos(false);
    setListaMedicamentos([]);
    setConfirmacion(false);

    try {
      if (busquedaTermino.trim() === "") {
        setError("Ingresa un ID, nombre, marca o familia");
        return;
      }

      const todos = await medicamentosService.obtenerTodos();
      const termino = busquedaTermino.trim().toUpperCase();

      const encontrados = todos.filter((m: { ID_Medicamento: any; Nombre: any; Marca: any; Familia: any; }) =>
        (m.ID_Medicamento ?? "").toUpperCase().includes(termino) ||
        (m.Nombre ?? "").toUpperCase().includes(termino) ||
        (m.Marca ?? "").toUpperCase().includes(termino) ||
        (m.Familia ?? "").toUpperCase().includes(termino)
      );

      if (encontrados.length === 0) {
        console.warn(`[${new Date().toISOString()}] No se encontraron resultados para: ${termino}`);
        setError("No se encontró ningún medicamento");
      } else if (encontrados.length === 1) {
        setMedEncontrado(encontrados[0]);
      } else {
        setListaMedicamentos(encontrados);
        setMostrandoTodos(true);
      }
    } catch (err: any) {
      console.error(`[${new Date().toISOString()}] Error en handleBuscar:`, err);
      setError(err.message || "Error al buscar medicamento");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Obtiene y muestra la lista completa de medicamentos registrados.
   */
  const handleMostrarTodos = async () => {
    console.log(`[${new Date().toISOString()}] Solicitando lista completa de medicamentos.`);
    setLoading(true);
    setError("");
    setMedEncontrado(null);
    setBusquedaTermino("");
    setConfirmacion(false);

    try {
      const todos = await medicamentosService.obtenerTodos();
      if (todos.length === 0) {
        setError("No hay medicamentos registrados");
        return;
      }
      setListaMedicamentos(todos);
      setMostrandoTodos(true);
    } catch (err: any) {
      console.error(`[${new Date().toISOString()}] Error en handleMostrarTodos:`, err);
      setError(err.message || "Error al obtener medicamentos");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Ejecuta la eliminación lógica/física en el servicio y actualiza el estado local.
   */
  const eliminarMedicamento = async (idMedicamento: string) => {
    if (!idMedicamento) {
      setError("ID de medicamento no válido");
      return;
    }

    console.log(`[${new Date().toISOString()}] Intentando eliminar medicamento ID: ${idMedicamento}`);
    setLoading(true);
    try {
      await medicamentosService.eliminarMedicamento(idMedicamento);
      setListaMedicamentos(prev => prev.filter(m => m.ID_Medicamento !== idMedicamento));
      
      if (medEncontrado?.ID_Medicamento === idMedicamento) {
        limpiarFormulario();
        setConfirmacion(false);
      }
      
      alertar("Éxito", "Medicamento eliminado correctamente.");
    } catch (err: any) {
      console.error(`[${new Date().toISOString()}] Error en eliminarMedicamento:`, err);
      setError(err.message || "Error al eliminar medicamento");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Gestiona la confirmación de eliminación desde la vista de lista.
   */
  const handleEliminarDesdeLista = (med: Medicamento) => {
    const mensaje = `¿Estás seguro de eliminar "${med.Nombre}" de "${med.Marca}" de forma permanente?\n\nEsta acción es irreversible.`;
    
    if (Platform.OS === "web") {
      if (window.confirm(mensaje)) eliminarMedicamento(med.ID_Medicamento);
    } else {
      Alert.alert("Confirmar eliminación", mensaje, [
        { text: "Cancelar", style: "cancel" },
        { text: "Eliminar", style: "destructive", onPress: () => eliminarMedicamento(med.ID_Medicamento) },
      ]);
    }
  };

  /**
   * Llama a la función de eliminación tras la confirmación en modo búsqueda individual.
   */
  const handleEliminar = async () => {
    if (!medEncontrado) return;
    await eliminarMedicamento(medEncontrado.ID_Medicamento);
    setConfirmacion(false);
  };

  /**
   * Limpia todos los estados para reiniciar la interfaz de eliminación.
   */
  const limpiarFormulario = () => {
    console.log(`[${new Date().toISOString()}] Reseteando estados de eliminación.`);
    setBusquedaTermino("");
    setMedEncontrado(null);
    setListaMedicamentos([]);
    setMostrandoTodos(false);
    setError("");
    setConfirmacion(false);
  };

  /**
   * Navega de vuelta a la pantalla de gestión de pedidos.
   */
  const volver = () => {
    console.log(`[${new Date().toISOString()}] Regresando a la pantalla anterior.`);
    router.push("/pages/management/pedidos/MostrarPedidos");
  };

  return (
    <ScrollView style={styles.outerScroll} contentContainerStyle={styles.outerScrollContent}>
      <View style={styles.container}>
        <Text style={styles.title}>Eliminar Medicamento</Text>

        <View style={styles.formContainer}>
          {error !== "" && (
            <View style={{ backgroundColor: "#FFE6E6", padding: 12, borderRadius: 6, marginBottom: 16 }}>
              <Text style={{ color: "#FF6B6B", fontWeight: "bold" }}>⚠️ {error}</Text>
            </View>
          )}

          {!confirmacion ? (
            <>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>ID, Nombre, Marca o Familia:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ej: MED-001 o Paracetamol"
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
                  <Text style={{ marginTop: 10, color: '#666' }}>Cargando...</Text>
                </View>
              )}

              {/* TARJETA MEDICAMENTO INDIVIDUAL */}
              {!loading && medEncontrado && (
                <View style={styles.tarjeta}>
                  <View style={styles.tarjetaHeader}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.tarjetaTitulo}>{medEncontrado.Nombre}</Text>
                      <Text style={styles.tarjetaMarca}>{medEncontrado.Marca}</Text>
                    </View>
                    <View style={[styles.tipoBadge, { backgroundColor: medEncontrado.Tipo === 'con_receta' ? '#E3F2FD' : '#E8F5E9' }]}>
                      <Text style={[styles.tipoTexto, { color: medEncontrado.Tipo === 'con_receta' ? '#1565C0' : '#2E7D32' }]}>
                        {medEncontrado.Tipo === 'con_receta' ? 'Con Receta' : 'Sin Receta'}
                      </Text>
                    </View>
                  </View>
                  <View style={{ marginTop: 10, gap: 8 }}>
                    <Text style={styles.tarjetaTexto}><Text style={{ fontWeight: 'bold' }}>ID:</Text> {medEncontrado.ID_Medicamento}</Text>
                    <Text style={styles.tarjetaTexto}><Text style={{ fontWeight: 'bold' }}>Familia:</Text> {medEncontrado.Familia}</Text>
                    <Text style={styles.tarjetaTexto}><Text style={{ fontWeight: 'bold' }}>Precio:</Text> €{medEncontrado.Precio?.toFixed(2)}</Text>
                    <Text style={styles.tarjetaTexto}><Text style={{ fontWeight: 'bold' }}>Stock:</Text> {medEncontrado.Stock} unidades</Text>
                    
                    {medEncontrado.Fecha_Envase && (
                      <Text style={styles.tarjetaTexto}>
                        <Text style={{ fontWeight: 'bold' }}>Fecha Envase:</Text> {
                          medEncontrado.Fecha_Envase instanceof Date 
                            ? medEncontrado.Fecha_Envase.toLocaleDateString() 
                            : String(medEncontrado.Fecha_Envase)
                        }
                      </Text>
                    )}

                    {medEncontrado.Fecha_Caducidad && (
                      <Text style={styles.tarjetaTexto}>
                        <Text style={{ fontWeight: 'bold' }}>Fecha Caducidad:</Text> {
                          medEncontrado.Fecha_Caducidad instanceof Date 
                            ? medEncontrado.Fecha_Caducidad.toLocaleDateString() 
                            : String(medEncontrado.Fecha_Caducidad)
                        }
                      </Text>
                    )}
                  </View>
                </View>
              )}

              {/* LISTA MÚLTIPLES RESULTADOS */}
              {!loading && mostrandoTodos && listaMedicamentos.length > 0 && !medEncontrado && (
                <View style={{ marginTop: 10 }}>
                  <Text style={styles.label}>
                    {busquedaTermino
                      ? `${listaMedicamentos.length} medicamentos encontrados — selecciona uno:`
                      : `Total: ${listaMedicamentos.length} medicamentos`}
                  </Text>
                  {listaMedicamentos.map((med, index) => (
                    <Pressable
                      key={med.ID_Medicamento ?? `med-${index}`}
                      onPress={() => busquedaTermino
                        ? (setMedEncontrado(med), setMostrandoTodos(false))
                        : handleEliminarDesdeLista(med)
                      }
                      style={busquedaTermino
                        ? { backgroundColor: "#FFF5F5", borderWidth: 1, borderColor: "#FF6B6B", borderRadius: 8, padding: 12, marginBottom: 10 }
                        : styles.tarjeta
                      }
                    >
                      {!busquedaTermino && (
                        <View style={{ alignSelf: 'flex-start', backgroundColor: theme.colors.error, borderRadius: 6, padding: 6, marginBottom: 8 }}>
                          <Ionicons name="trash" size={20} color="#fff" />
                        </View>
                      )}
                      <Text style={styles.tarjetaTitulo}>{med.Nombre}</Text>
                      <Text style={styles.tarjetaTexto}><Text style={{ fontWeight: 'bold' }}>ID:</Text> {med.ID_Medicamento}</Text>
                      <Text style={styles.tarjetaTexto}><Text style={{ fontWeight: 'bold' }}>Marca:</Text> {med.Marca}</Text>
                      <Text style={styles.tarjetaTexto}><Text style={{ fontWeight: 'bold' }}>Familia:</Text> {med.Familia}</Text>
                      <Text style={styles.tarjetaTexto}><Text style={{ fontWeight: 'bold' }}>Precio:</Text> €{med.Precio?.toFixed(2)}</Text>
                      <Text style={styles.tarjetaTexto}><Text style={{ fontWeight: 'bold' }}>Stock:</Text> {med.Stock} unidades</Text>
                    </Pressable>
                  ))}
                </View>
              )}

              <View style={styles.botonesContainer}>
                <Pressable style={[styles.button, styles.buttonSearch, loading && { opacity: 0.5 }]} onPress={handleBuscar} disabled={loading}>
                  <Text style={styles.buttonText}>{loading ? "BUSCANDO..." : "BUSCAR MEDICAMENTO"}</Text>
                </Pressable>

                <Pressable style={[styles.button, { backgroundColor: '#2196F3' }, loading && { opacity: 0.5 }]} onPress={handleMostrarTodos} disabled={loading}>
                  <Text style={styles.buttonText}>MOSTRAR TODOS</Text>
                </Pressable>

                {!loading && medEncontrado && (
                  <Pressable style={[styles.button, styles.buttonDelete]} onPress={() => setConfirmacion(true)} disabled={loading}>
                    <Text style={styles.buttonText}>CONFIRMAR ELIMINACIÓN</Text>
                  </Pressable>
                )}
              </View>
            </>
          ) : (
            <>
              <View style={{ backgroundColor: "#FFF3CD", borderLeftColor: "#FFC107", borderLeftWidth: 4, padding: 16, borderRadius: 8, marginBottom: 20 }}>
                <Text style={{ color: "#856404", fontWeight: 'bold', fontSize: 16, marginBottom: 8 }}>⚠️ Advertencia</Text>
                <Text style={{ color: "#856404", fontSize: 14, lineHeight: 20 }}>
                  ¿Estás seguro de que deseas eliminar <Text style={{ fontWeight: 'bold' }}>{medEncontrado?.Nombre}</Text> de <Text style={{ fontWeight: 'bold' }}>{medEncontrado?.Marca}</Text>?
                </Text>
                <Text style={{ color: "#856404", fontSize: 12, marginTop: 8, fontStyle: 'italic' }}>Esta acción no se puede deshacer.</Text>
              </View>

              {medEncontrado && (
                <View style={styles.tarjeta}>
                  <Text style={styles.tarjetaTitulo}>{medEncontrado.Nombre}</Text>
                  <Text style={styles.tarjetaTexto}><Text style={{ fontWeight: 'bold' }}>ID:</Text> {medEncontrado.ID_Medicamento}</Text>
                  <Text style={styles.tarjetaTexto}><Text style={{ fontWeight: 'bold' }}>Marca:</Text> {medEncontrado.Marca}</Text>
                  <Text style={styles.tarjetaTexto}><Text style={{ fontWeight: 'bold' }}>Familia:</Text> {medEncontrado.Familia}</Text>
                  <Text style={styles.tarjetaTexto}><Text style={{ fontWeight: 'bold' }}>Precio:</Text> €{medEncontrado.Precio?.toFixed(2)}</Text>
                  <Text style={styles.tarjetaTexto}><Text style={{ fontWeight: 'bold' }}>Stock:</Text> {medEncontrado.Stock} unidades</Text>
                </View>
              )}

              <View style={styles.botonesContainer}>
                <Pressable style={[styles.button, styles.buttonDelete, loading && { opacity: 0.5 }]} onPress={handleEliminar} disabled={loading}>
                  <Text style={styles.buttonText}>{loading ? "ELIMINANDO..." : "ELIMINAR DEFINITIVAMENTE"}</Text>
                </Pressable>
                <Pressable style={[styles.button, { backgroundColor: "#9E9E9E" }]} onPress={limpiarFormulario} disabled={loading}>
                  <Text style={styles.buttonText}>CANCELAR</Text>
                </Pressable>
              </View>
            </>
          )}

          <View style={[styles.botonesContainer, { marginTop: 10 }]}>
            <Pressable style={[styles.button]} onPress={volver} disabled={loading}>
              <Text style={styles.buttonText}>VOLVER</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

export default EliminarMedicamento;