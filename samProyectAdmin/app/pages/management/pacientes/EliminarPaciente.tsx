import React, { useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView, Alert, ActivityIndicator, Platform } from "react-native";
import { router } from "expo-router";
import { styles } from "@/styles/pages/management/pacientes/EliminarPacienteStyle";
import { pacientesService } from "@/services/firebase";
import { Paciente } from "@/types/paciente";
import { Ionicons } from "@expo/vector-icons";
import theme from "@/theme/Theme";

/**
 * UTILERÍA: Genera un timestamp actual para la trazabilidad en consola
 */
const getTimestamp = () => new Date().toLocaleString();

function EliminarPaciente() {
  // --- Estados de Control de Interfaz ---
  const [confirmacion, setConfirmacion] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // --- Estados de Búsqueda y Datos ---
  const [busquedaTermino, setBusquedaTermino] = useState("");
  const [pacienteEncontrado, setPacienteEncontrado] = useState<Paciente | null>(null);
  const [todosPacientes, setTodosPacientes] = useState<Paciente[]>([]);
  const [mostrandoTodos, setMostrandoTodos] = useState(false);
  const [listaResultados, setListaResultados] = useState<Paciente[]>([]);
  const [mostrandoLista, setMostrandoLista] = useState(false);

  /**
   * Sistema de alertas adaptativo (Web / Mobile)
   */
  const alertar = (titulo: string, mensaje: string) => {
    if (Platform.OS === "web") {
      window.alert(`${titulo}\n\n${mensaje}`);
    } else {
      Alert.alert(titulo, mensaje, [{ text: "OK" }]);
    }
  };

  /**
   * Manejador de búsqueda de pacientes por DNI, Cartilla o Nombre
   */
  const handleBuscar = async () => {
    setLoading(true);
    setError("");
    setPacienteEncontrado(null);
    setMostrandoTodos(false);
    setTodosPacientes([]);
    setMostrandoLista(false);
    setListaResultados([]);

    console.log(`[${getTimestamp()}] Iniciando busqueda de paciente con termino: ${busquedaTermino}`);

    try {
      if (busquedaTermino.trim() === "") {
        setError("Ingresa un DNI o número de cartilla");
        return;
      }

      const todos = await pacientesService.obtenerTodos();
      if (todos.length === 0) {
        setError("No hay pacientes registrados");
        return;
      }

      const termino = busquedaTermino.trim().toUpperCase();
      const encontrados = todos.filter(p =>
        (p.DNI || "").toUpperCase().includes(termino) ||
        (p.Num_Cartilla || "").toUpperCase().includes(termino) ||
        (p.Nombre_Paciente || "").toUpperCase().includes(termino)
      );

      if (encontrados.length === 0) {
        console.log(`[${getTimestamp()}] No se encontraron coincidencias para: ${termino}`);
        setError("Paciente no encontrado");
      } else if (encontrados.length === 1) {
        console.log(`[${getTimestamp()}] Unico paciente encontrado: ${encontrados[0].DNI}`);
        setPacienteEncontrado(encontrados[0]);
      } else {
        console.log(`[${getTimestamp()}] Multiples pacientes encontrados: ${encontrados.length}`);
        setListaResultados(encontrados);
        setMostrandoLista(true);
      }
    } catch (err: any) {
      console.log(`[${getTimestamp()}] Error en handleBuscar: ${err.message}`);
      setError(err.message || "Error al buscar paciente");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Obtiene y despliega la lista total de pacientes registrados
   */
  const handleMostrarTodos = async () => {
    setLoading(true);
    setError("");
    setPacienteEncontrado(null);
    setBusquedaTermino("");
    setConfirmacion(false);
    console.log(`[${getTimestamp()}] Solicitando lista completa de pacientes`);

    try {
      const todos = await pacientesService.obtenerTodos();
      if (todos.length === 0) {
        setError("No hay pacientes registrados");
        return;
      }
      setTodosPacientes(todos);
      setMostrandoTodos(true);
    } catch (err: any) {
      console.log(`[${getTimestamp()}] Error en handleMostrarTodos: ${err.message}`);
      setError(err.message || "Error al obtener pacientes");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Lógica de eliminación definitiva y actualización de estados locales
   */
  const eliminarPaciente = async (dni: string) => {
    setLoading(true);
    console.log(`[${getTimestamp()}] Intentando eliminar paciente con DNI: ${dni}`);
    try {
      await pacientesService.eliminarPaciente(dni);
      
      // Actualización de la lista local para reflejar el borrado sin re-fetch
      setTodosPacientes(prev => prev.filter(p => p.DNI !== dni));
      
      if (pacienteEncontrado?.DNI === dni) {
        limpiarFormulario();
        setConfirmacion(false);
      }
      
      console.log(`[${getTimestamp()}] Paciente con DNI ${dni} eliminado correctamente`);
      alertar("Éxito", "Paciente eliminado correctamente.");
    } catch (err: any) {
      console.log(`[${getTimestamp()}] Error en proceso de eliminacion: ${err.message}`);
      setError(err.message || "Error al eliminar paciente");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Manejador de eliminación desde la lista general con confirmación de usuario
   */
  const handleEliminarDesdeLista = (paciente: Paciente) => {
    const mensaje = `¿Estás seguro de eliminar a ${paciente.Nombre_Paciente} de forma permanente?\n\nEsta acción es irreversible.`;

    if (Platform.OS === "web") {
      if (window.confirm(mensaje)) eliminarPaciente(paciente.DNI);
    } else {
      Alert.alert("Confirmar eliminación", mensaje, [
        { text: "Cancelar", style: "cancel" },
        { text: "Eliminar", style: "destructive", onPress: () => eliminarPaciente(paciente.DNI) },
      ]);
    }
  };

  /**
   * Prepara la interfaz para la confirmación de eliminación individual
   */
  const handleConfirmarEliminacion = () => {
    if (!pacienteEncontrado) {
      setError("Debe buscar un paciente primero");
      return;
    }
    setConfirmacion(true);
  };

  /**
   * Ejecuta la eliminación tras el consentimiento final del usuario
   */
  const handleEliminar = async () => {
    if (!pacienteEncontrado) {
      setError("Error: No hay paciente para eliminar");
      return;
    }
    await eliminarPaciente(pacienteEncontrado.DNI);
    setConfirmacion(false);
  };

  /**
   * Reinicio de todos los estados relacionados con el formulario y resultados
   */
  const limpiarFormulario = () => {
    setBusquedaTermino("");
    setPacienteEncontrado(null);
    setTodosPacientes([]);
    setMostrandoTodos(false);
    setListaResultados([]);      
    setMostrandoLista(false);    
    setError("");
  };

  const volverABusqueda = () => {
    setConfirmacion(false);
    limpiarFormulario();
  };

  const volver = () => {
    console.log(`[${getTimestamp()}] Navegando de vuelta a MostrarPedidos`);
    router.push("/pages/management/pedidos/MostrarPedidos");
  };

  return (
    <ScrollView style={styles.outerScroll} contentContainerStyle={styles.outerScrollContent}>
      <View style={styles.container}>
        <Text style={styles.title}>Eliminar Paciente</Text>

        <View style={styles.formContainer}>
          {/* VISUALIZACIÓN DE ERRORES */}
          {error && (
            <View style={{ backgroundColor: "#FFE6E6", padding: 12, borderRadius: 6, marginBottom: 16 }}>
              <Text style={{ color: "#FF6B6B", fontWeight: "bold" }}>Aviso: {error}</Text>
            </View>
          )}

          {!confirmacion ? (
            <>
              {/* INPUT DE BÚSQUEDA */}
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
                  <Text style={{ marginTop: 10, color: '#666' }}>Cargando...</Text>
                </View>
              )}

              {/* TARJETA DE PACIENTE INDIVIDUAL ENCONTRADO */}
              {!loading && pacienteEncontrado && (
                <View style={styles.tarjeta}>
                  <Text style={styles.tarjetaTitulo}>{pacienteEncontrado.Nombre_Paciente}</Text>
                  <View style={{ marginTop: 10, gap: 8 }}>
                    <Text style={styles.tarjetaTexto}><Text style={{ fontWeight: 'bold' }}>DNI:</Text> {pacienteEncontrado.DNI}</Text>
                    <Text style={styles.tarjetaTexto}><Text style={{ fontWeight: 'bold' }}>Cartilla:</Text> {pacienteEncontrado.Num_Cartilla}</Text>
                    <Text style={styles.tarjetaTexto}><Text style={{ fontWeight: 'bold' }}>Teléfono:</Text> {pacienteEncontrado.Num_Telefono}</Text>
                    <Text style={styles.tarjetaTexto}><Text style={{ fontWeight: 'bold' }}>Edad:</Text> {pacienteEncontrado.Edad_Paciente} años</Text>
                    <Text style={styles.tarjetaTexto}><Text style={{ fontWeight: 'bold' }}>Régimen:</Text> {(pacienteEncontrado.Tipo_Paciente || "").charAt(0).toUpperCase() + (pacienteEncontrado.Tipo_Paciente || "").slice(1)}</Text>
                  </View>
                </View>
              )}

              {/* LISTA COMPLETA DE PACIENTES */}
              {!loading && mostrandoTodos && todosPacientes.length > 0 && (
                <View style={{ marginTop: 10 }}>
                  <Text style={styles.label}>Total: {todosPacientes.length} pacientes</Text>
                  {todosPacientes.map((paciente, index) => (
                    <View key={index} style={styles.tarjeta}>
                      <Pressable
                        onPress={() => handleEliminarDesdeLista(paciente)}
                        disabled={loading}
                        style={{
                          alignSelf: 'flex-start',
                          backgroundColor: theme.colors.error,
                          borderRadius: 6,
                          padding: 6,
                          marginBottom: 8,
                        }}
                      >
                        <Ionicons name="trash" size={20} color="#fff" />
                      </Pressable>

                      <Text style={styles.tarjetaTitulo}>{paciente.Nombre_Paciente}</Text>
                      <Text style={styles.tarjetaTexto}><Text style={{ fontWeight: 'bold' }}>DNI:</Text> {paciente.DNI}</Text>
                      <Text style={styles.tarjetaTexto}><Text style={{ fontWeight: 'bold' }}>Cartilla:</Text> {paciente.Num_Cartilla}</Text>
                      <Text style={styles.tarjetaTexto}><Text style={{ fontWeight: 'bold' }}>Teléfono:</Text> {paciente.Num_Telefono}</Text>
                      <Text style={styles.tarjetaTexto}><Text style={{ fontWeight: 'bold' }}>Edad:</Text> {paciente.Edad_Paciente} años</Text>
                      <Text style={styles.tarjetaTexto}><Text style={{ fontWeight: 'bold' }}>Régimen:</Text> {(paciente.Tipo_Paciente || "").charAt(0).toUpperCase() + (paciente.Tipo_Paciente || "").slice(1)}</Text>
                    </View>
                  ))}
                </View>
              )}

              {/* LISTA DE RESULTADOS CUANDO HAY MÚLTIPLES COINCIDENCIAS */}
              {!loading && mostrandoLista && listaResultados.length > 0 && (
                <View style={{ marginTop: 10 }}>
                  <Text style={styles.label}>{listaResultados.length} pacientes encontrados - selecciona uno:</Text>
                  {listaResultados.map((paciente, index) => (
                    <Pressable
                      key={paciente.DNI ?? `pac-${index}`}
                      onPress={() => { setPacienteEncontrado(paciente); setMostrandoLista(false); setListaResultados([]); }}
                      style={{ backgroundColor: "#F0F8FF", borderWidth: 1, borderColor: "#2196F3", borderRadius: 8, padding: 12, marginBottom: 10 }}
                    >
                      <Text style={{ fontWeight: 'bold', color: '#2196F3' }}>{paciente.Nombre_Paciente}</Text>
                      <Text>DNI: {paciente.DNI}</Text>
                      <Text>Cartilla: {paciente.Num_Cartilla}</Text>
                    </Pressable>
                  ))}
                </View>
              )}

              {/* PANEL DE ACCIONES PRINCIPALES */}
              <View style={styles.botonesContainer}>
                <Pressable
                  style={[styles.button, styles.buttonInsert, loading && { opacity: 0.5 }]}
                  onPress={handleBuscar}
                  disabled={loading}
                >
                  <Text style={styles.buttonText}>{loading ? "BUSCANDO..." : "BUSCAR PACIENTE"}</Text>
                </Pressable>

                <Pressable
                  style={[styles.button, { backgroundColor: '#2196F3' }, loading && { opacity: 0.5 }]}
                  onPress={handleMostrarTodos}
                  disabled={loading}
                >
                  <Text style={styles.buttonText}>MOSTRAR TODOS</Text>
                </Pressable>

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
              {/* VISTA DE ADVERTENCIA DE ELIMINACIÓN */}
              <View style={{ backgroundColor: "#FFF3CD", borderLeftColor: "#FFC107", borderLeftWidth: 4, padding: 16, borderRadius: 8, marginBottom: 20 }}>
                <Text style={{ color: "#856404", fontWeight: 'bold', fontSize: 16, marginBottom: 8 }}>Advertencia</Text>
                <Text style={{ color: "#856404", fontSize: 14, lineHeight: 20 }}>
                  ¿Estás seguro de que deseas eliminar a <Text style={{ fontWeight: 'bold' }}>{pacienteEncontrado?.Nombre_Paciente}</Text>?
                </Text>
                <Text style={{ color: "#856404", fontSize: 12, marginTop: 8, fontStyle: 'italic' }}>
                  Esta acción no se puede deshacer.
                </Text>
              </View>

              {pacienteEncontrado && (
                <View style={styles.tarjeta}>
                  <Text style={styles.tarjetaTitulo}>{pacienteEncontrado.Nombre_Paciente}</Text>
                  <View style={{ marginTop: 10, gap: 8 }}>
                    <Text style={styles.tarjetaTexto}><Text style={{ fontWeight: 'bold' }}>DNI:</Text> {pacienteEncontrado.DNI}</Text>
                    <Text style={styles.tarjetaTexto}><Text style={{ fontWeight: 'bold' }}>Cartilla:</Text> {pacienteEncontrado.Num_Cartilla}</Text>
                    <Text style={styles.tarjetaTexto}><Text style={{ fontWeight: 'bold' }}>Teléfono:</Text> {pacienteEncontrado.Num_Telefono}</Text>
                  </View>
                </View>
              )}

              <View style={styles.botonesContainer}>
                <Pressable
                  style={[styles.button, { backgroundColor: "#F44336" }, loading && { opacity: 0.5 }]}
                  onPress={handleEliminar}
                  disabled={loading}
                >
                  <Text style={styles.buttonText}>{loading ? "ELIMINANDO..." : "ELIMINAR DEFINITIVAMENTE"}</Text>
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
            <Pressable style={[styles.button]} onPress={volver} disabled={loading}>
              <Text style={styles.buttonText}>VOLVER</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

export default EliminarPaciente;