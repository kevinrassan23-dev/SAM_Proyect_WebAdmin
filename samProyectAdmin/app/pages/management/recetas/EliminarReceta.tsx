import React, { useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView, Alert, ActivityIndicator, Platform } from "react-native";
import { router } from "expo-router";
import { styles } from "@/styles/pages/management/recetas/EliminarRecetaStyle";
import { recetasService } from "@/services/firebase";
import { Receta } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import theme from "@/theme/Theme";
import { useAuthGuard } from "@/hooks/useAuthGuard";

/**
 * Función auxiliar para mostrar alertas consistentes entre Web y Mobile.
 */
const alertar = (titulo: string, mensaje: string, onOk?: () => void) => {
  if (Platform.OS === "web") {
    window.alert(`${titulo}\n\n${mensaje}`);
    onOk?.();
  } else {
    Alert.alert(titulo, mensaje, [{ text: "OK", onPress: onOk }]);
  }
};

/**
 * Convierte campos de fecha de Firebase (Timestamp) o strings a objetos Date de JS.
 */
const toDate = (campo: any): Date | null => {
  if (!campo) return null;
  if (campo instanceof Date) return campo;
  if (campo.seconds) return new Date(campo.seconds * 1000);
  return null;
};

function EliminarReceta() {
  useAuthGuard();

  // --- ESTADOS ---
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [busquedaTermino, setBusquedaTermino] = useState("");
  const [recetaEncontrada, setRecetaEncontrada] = useState<Receta | null>(null);
  const [todasLasRecetas, setTodasLasRecetas] = useState<Receta[]>([]);
  const [mostrandoTodos, setMostrandoTodos] = useState(false);
  const [confirmacion, setConfirmacion] = useState(false);

  /**
   * Busca recetas que coincidan con el ID, DNI, Cartilla o nombres.
   */
  const handleBuscar = async () => {
    console.log(`[${new Date().toISOString()}] Iniciando búsqueda con término: "${busquedaTermino}"`);
    setLoading(true);
    setError("");
    setRecetaEncontrada(null);
    setMostrandoTodos(false);
    setTodasLasRecetas([]);
    setConfirmacion(false);

    try {
      if (busquedaTermino.trim() === "") {
        console.warn(`[${new Date().toISOString()}] Intento de búsqueda con campo vacío.`);
        setError("Ingresa un ID, DNI, cartilla o especialista");
        return;
      }

      const todas = await recetasService.obtenerTodas();
      const termino = busquedaTermino.trim().toUpperCase();

      // Filtrado multicanal (ID, DNI, Cartilla, Nombres)
      const encontradas = todas.filter(r =>
        (r.ID_Receta ?? "").toUpperCase().includes(termino) ||
        (r.DNI_Paciente ?? "").toUpperCase().includes(termino) ||
        (r.Num_Cartilla_Paciente ?? "").toUpperCase().includes(termino) ||
        (r.Nombre_Especialista ?? "").toUpperCase().includes(termino) ||
        (r.Nombre_Paciente ?? "").toUpperCase().includes(termino)
      );

      console.log(`[${new Date().toISOString()}] Resultados encontrados: ${encontradas.length}`);

      if (encontradas.length === 0) {
        setError("No se encontró ninguna receta");
      } else if (encontradas.length === 1) {
        // Si solo hay una, la mostramos directamente para confirmar
        setRecetaEncontrada(encontradas[0]);
      } else {
        // Si hay varias, mostramos la lista de selección
        setTodasLasRecetas(encontradas);
        setMostrandoTodos(true);
      }
    } catch (err: any) {
      console.error(`[${new Date().toISOString()}] Error en handleBuscar:`, err);
      setError(err.message || "Error al buscar receta");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Obtiene y despliega todas las recetas registradas en el sistema.
   */
  const handleMostrarTodos = async () => {
    console.log(`[${new Date().toISOString()}] Solicitando lista completa de recetas.`);
    setLoading(true);
    setError("");
    setRecetaEncontrada(null);
    setBusquedaTermino("");
    setConfirmacion(false);

    try {
      const todas = await recetasService.obtenerTodas();
      console.log(`[${new Date().toISOString()}] Total de recetas recuperadas: ${todas.length}`);
      
      if (todas.length === 0) {
        setError("No hay recetas registradas");
        return;
      }
      setTodasLasRecetas(todas);
      setMostrandoTodos(true);
    } catch (err: any) {
      console.error(`[${new Date().toISOString()}] Error en handleMostrarTodos:`, err);
      setError(err.message || "Error al obtener recetas");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Lógica nuclear para la eliminación definitiva en la base de datos.
   */
  const eliminarReceta = async (idReceta: string) => {
    console.log(`[${new Date().toISOString()}] Intentando eliminar receta ID: ${idReceta}`);
    
    if (!idReceta) {
      console.error(`[${new Date().toISOString()}] ID inválido detectado en la eliminación.`);
      setError("ID de receta no válido");
      return;
    }

    setLoading(true);
    try {
      await recetasService.eliminarReceta(idReceta);
      console.log(`[${new Date().toISOString()}] Receta ${idReceta} eliminada de Firestore.`);
      
      // Actualizar estado local eliminando el item de la lista
      setTodasLasRecetas(prev => prev.filter(r => r.ID_Receta !== idReceta));
      
      if (recetaEncontrada?.ID_Receta === idReceta) {
        limpiarFormulario();
        setConfirmacion(false);
      }
      alertar("Éxito", "Receta eliminada correctamente.");
    } catch (err: any) {
      console.error(`[${new Date().toISOString()}] Error al eliminar receta ${idReceta}:`, err);
      setError(err.message || "Error al eliminar receta");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Gestiona el proceso de confirmación previo a la eliminación desde una lista.
   */
  const handleEliminarDesdeLista = (receta: Receta) => {
    const mensaje = `¿Estás seguro de eliminar la receta ${receta.ID_Receta} de ${receta.Nombre_Paciente ?? receta.DNI_Paciente} de forma permanente?\n\nEsta acción es irreversible.`;
    
    if (Platform.OS === "web") {
      if (window.confirm(mensaje)) eliminarReceta(receta.ID_Receta!);
    } else {
      Alert.alert("Confirmar eliminación", mensaje, [
        { text: "Cancelar", style: "cancel" },
        { text: "Eliminar", style: "destructive", onPress: () => eliminarReceta(receta.ID_Receta!) },
      ]);
    }
  };

  /**
   * Activa el estado visual de confirmación final.
   */
  const handleConfirmarEliminacion = () => {
    console.log(`[${new Date().toISOString()}] Confirmación final solicitada.`);
    if (!recetaEncontrada) return;
    setConfirmacion(true);
  };

  /**
   * Ejecuta la eliminación después de la confirmación explícita del usuario.
   */
  const handleEliminar = async () => {
    if (!recetaEncontrada) return;
    await eliminarReceta(recetaEncontrada.ID_Receta!);
    setConfirmacion(false);
  };

  /**
   * Resetea todos los estados del componente.
   */
  const limpiarFormulario = () => {
    console.log(`[${new Date().toISOString()}] Limpiando formulario y estados.`);
    setBusquedaTermino("");
    setRecetaEncontrada(null);
    setTodasLasRecetas([]);
    setMostrandoTodos(false);
    setError("");
    setConfirmacion(false);
  };

  /**
   * Navega hacia la pantalla de gestión de pedidos.
   */
  const volver = () => {
    console.log(`[${new Date().toISOString()}] Navegando de vuelta a MostrarPedidos.`);
    router.push("/pages/management/pedidos/MostrarPedidos");
  };

  return (
    <ScrollView style={styles.outerScroll} contentContainerStyle={styles.outerScrollContent}>
      <View style={styles.container}>
        <Text style={styles.title}>Eliminar Receta</Text>

        <View style={styles.formContainer}>
          {/* SECCIÓN DE ERRORES */}
          {error !== "" && (
            <View style={{ backgroundColor: "#FFE6E6", padding: 12, borderRadius: 6, marginBottom: 16 }}>
              <Text style={{ color: "#FF6B6B", fontWeight: "bold" }}>⚠️ {error}</Text>
            </View>
          )}

          {!confirmacion ? (
            <>
              {/* CAMPO DE BÚSQUEDA */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>ID, DNI, Cartilla, Paciente o Especialista:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ej: REC-001 o 12345678A"
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

              {/* VISTA: RECETA INDIVIDUAL ENCONTRADA */}
              {!loading && recetaEncontrada && (
                <View style={styles.tarjeta}>
                  <Text style={styles.tarjetaTitulo}>{recetaEncontrada.ID_Receta}</Text>
                  <View style={{ marginTop: 10, gap: 8 }}>
                    <Text style={styles.tarjetaTexto}><Text style={{ fontWeight: 'bold' }}>Paciente:</Text> {recetaEncontrada.Nombre_Paciente ?? recetaEncontrada.DNI_Paciente}</Text>
                    <Text style={styles.tarjetaTexto}><Text style={{ fontWeight: 'bold' }}>DNI:</Text> {recetaEncontrada.DNI_Paciente}</Text>
                    <Text style={styles.tarjetaTexto}><Text style={{ fontWeight: 'bold' }}>Cartilla:</Text> {recetaEncontrada.Num_Cartilla_Paciente}</Text>
                    <Text style={styles.tarjetaTexto}><Text style={{ fontWeight: 'bold' }}>Especialista:</Text> {recetaEncontrada.Nombre_Especialista}</Text>
                    <Text style={styles.tarjetaTexto}><Text style={{ fontWeight: 'bold' }}>Afecciones:</Text> {recetaEncontrada.Afecciones}</Text>
                    <Text style={styles.tarjetaTexto}><Text style={{ fontWeight: 'bold' }}>Medicamentos:</Text> {recetaEncontrada.Medicamentos_Recetados}</Text>
                    <Text style={styles.tarjetaTexto}><Text style={{ fontWeight: 'bold' }}>Centro:</Text> {recetaEncontrada.Direccion_Centro}</Text>
                    <Text style={styles.tarjetaTexto}><Text style={{ fontWeight: 'bold' }}>Inicio:</Text> {toDate(recetaEncontrada.Fecha_Inicio)?.toLocaleDateString('es-ES') ?? "N/A"}</Text>
                    <Text style={styles.tarjetaTexto}><Text style={{ fontWeight: 'bold' }}>Expira:</Text> {toDate(recetaEncontrada.Fecha_Expiracion)?.toLocaleDateString('es-ES') ?? "N/A"}</Text>
                  </View>
                </View>
              )}

              {/* VISTA: LISTADO DE RESULTADOS (Búsqueda múltiple o Todos) */}
              {!loading && mostrandoTodos && todasLasRecetas.length > 0 && !recetaEncontrada && (
                <View style={{ marginTop: 10 }}>
                  <Text style={styles.label}>
                    {busquedaTermino ? `${todasLasRecetas.length} recetas encontradas — selecciona una:` : `Total: ${todasLasRecetas.length} recetas`}
                  </Text>
                  {todasLasRecetas.map((receta, index) => (
                    <Pressable
                      key={receta.ID_Receta ?? `receta-${index}`}
                      onPress={() => busquedaTermino
                        ? (setRecetaEncontrada(receta), setMostrandoTodos(false))
                        : handleEliminarDesdeLista(receta)
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
                      <Text style={styles.tarjetaTitulo}>{receta.ID_Receta}</Text>
                      <Text style={styles.tarjetaTexto}><Text style={{ fontWeight: 'bold' }}>Paciente:</Text> {receta.Nombre_Paciente ?? receta.DNI_Paciente}</Text>
                      <Text style={styles.tarjetaTexto}><Text style={{ fontWeight: 'bold' }}>Especialista:</Text> {receta.Nombre_Especialista}</Text>
                      <Text style={styles.tarjetaTexto}><Text style={{ fontWeight: 'bold' }}>Inicio:</Text> {toDate(receta.Fecha_Inicio)?.toLocaleDateString('es-ES') ?? "N/A"}</Text>
                      <Text style={styles.tarjetaTexto}><Text style={{ fontWeight: 'bold' }}>Expira:</Text> {toDate(receta.Fecha_Expiracion)?.toLocaleDateString('es-ES') ?? "N/A"}</Text>
                    </Pressable>
                  ))}
                </View>
              )}

              <View style={styles.botonesContainer}>
                <Pressable style={[styles.button, styles.buttonSearch, loading && { opacity: 0.5 }]} onPress={handleBuscar} disabled={loading}>
                  <Text style={styles.buttonText}>{loading ? "BUSCANDO..." : "BUSCAR RECETA"}</Text>
                </Pressable>

                <Pressable style={[styles.button, { backgroundColor: '#2196F3' }, loading && { opacity: 0.5 }]} onPress={handleMostrarTodos} disabled={loading}>
                  <Text style={styles.buttonText}>MOSTRAR TODAS</Text>
                </Pressable>

                {!loading && recetaEncontrada && (
                  <Pressable style={[styles.button, styles.buttonDelete]} onPress={handleConfirmarEliminacion} disabled={loading}>
                    <Text style={styles.buttonText}>CONFIRMAR ELIMINACIÓN</Text>
                  </Pressable>
                )}
              </View>
            </>
          ) : (
            <>
              {/* MODO CONFIRMACIÓN FINAL */}
              <View style={{ backgroundColor: "#FFF3CD", borderLeftColor: "#FFC107", borderLeftWidth: 4, padding: 16, borderRadius: 8, marginBottom: 20 }}>
                <Text style={{ color: "#856404", fontWeight: 'bold', fontSize: 16, marginBottom: 8 }}>⚠️ Advertencia</Text>
                <Text style={{ color: "#856404", fontSize: 14, lineHeight: 20 }}>
                  ¿Estás seguro de que deseas eliminar la receta <Text style={{ fontWeight: 'bold' }}>{recetaEncontrada?.ID_Receta}</Text>?
                </Text>
                <Text style={{ color: "#856404", fontSize: 12, marginTop: 8, fontStyle: 'italic' }}>Esta acción no se puede deshacer.</Text>
              </View>

              {recetaEncontrada && (
                <View style={styles.tarjeta}>
                  <Text style={styles.tarjetaTitulo}>{recetaEncontrada.ID_Receta}</Text>
                  <Text style={styles.tarjetaTexto}><Text style={{ fontWeight: 'bold' }}>Paciente:</Text> {recetaEncontrada.Nombre_Paciente ?? recetaEncontrada.DNI_Paciente}</Text>
                  <Text style={styles.tarjetaTexto}><Text style={{ fontWeight: 'bold' }}>Especialista:</Text> {recetaEncontrada.Nombre_Especialista}</Text>
                  <Text style={styles.tarjetaTexto}><Text style={{ fontWeight: 'bold' }}>Inicio:</Text> {toDate(recetaEncontrada.Fecha_Inicio)?.toLocaleDateString('es-ES') ?? "N/A"}</Text>
                  <Text style={styles.tarjetaTexto}><Text style={{ fontWeight: 'bold' }}>Expira:</Text> {toDate(recetaEncontrada.Fecha_Expiracion)?.toLocaleDateString('es-ES') ?? "N/A"}</Text>
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

          {/* BOTÓN GENERAL PARA VOLVER */}
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

export default EliminarReceta;