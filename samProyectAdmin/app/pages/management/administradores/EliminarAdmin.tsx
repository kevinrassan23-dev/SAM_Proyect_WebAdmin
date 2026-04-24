import React, { useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView, Alert, ActivityIndicator, Platform } from "react-native";
import { router } from "expo-router";
import { styles } from "@/styles/pages/management/administradores/EliminarAdminStyle";
import { adminService } from "@/services/supabase/admin";
import { Administrador } from "@/types/Admin";
import { Ionicons } from "@expo/vector-icons";
import theme from "@/theme/Theme";
import { useAuthGuard } from "@/hooks/useAuthGuard";

/**
 * UTILERIA: Genera un timestamp actual para los logs
 */
const getTimestamp = () => new Date().toLocaleString();

function EliminarAdmin() {
  useAuthGuard();

  // --- Estados de Control de Interfaz ---
  const [confirmacion, setConfirmacion] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // --- Estados de Datos y Busqueda ---
  const [busquedaTermino, setBusquedaTermino] = useState("");
  const [adminEncontrado, setAdminEncontrado] = useState<Omit<Administrador, 'password'> | null>(null);
  const [todosAdmins, setTodosAdmins] = useState<Omit<Administrador, 'password'>[]>([]);
  const [mostrandoTodos, setMostrandoTodos] = useState(false);
  const [listaResultados, setListaResultados] = useState<Omit<Administrador, 'password'>[]>([]);
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
   * Manejador de busqueda de administradores con filtrado multiple
   */
  const handleBuscar = async () => {
    setLoading(true);
    setError("");
    setAdminEncontrado(null);
    setMostrandoTodos(false);
    setTodosAdmins([]);
    setMostrandoLista(false);
    setListaResultados([]);

    console.log(`[${getTimestamp()}] Iniciando busqueda con termino: ${busquedaTermino}`);

    try {
      if (busquedaTermino.trim() === "") {
        setError("Ingresa un ID, nombre o correo electronico");
        return;
      }

      const todos = await adminService.obtenerTodos();
      if (todos.length === 0) {
        setError("No hay administradores registrados");
        return;
      }

      const termino = busquedaTermino.trim().toLowerCase();
      const encontrados = todos.filter(a =>
        a.email.toLowerCase().includes(termino) ||
        a.id.toString().includes(termino) ||
        (a.nombre ?? "").toLowerCase().includes(termino)
      );

      if (encontrados.length === 0) {
        console.log(`[${getTimestamp()}] No se hallaron resultados para: ${termino}`);
        setError("Administrador no encontrado");
      } else if (encontrados.length === 1) {
        // ── Bloquear eliminación de roles privilegiados
        if (encontrados[0].rol === 'GOV_ADMIN' || encontrados[0].rol === 'ADMIN_OWNER') {
          setError("Este administrador no puede ser eliminado desde el panel.");
          return;
        }

        const totalSystemAdmins = todos.filter(a => a.rol === 'SYSTEM_ADMIN').length;
        if (encontrados[0].rol === 'SYSTEM_ADMIN' && totalSystemAdmins <= 1) {
            setError("No se puede eliminar el único administrador con rol de sistema.");
            return;
        }
        console.log(`[${getTimestamp()}] Un unico administrador encontrado: ID ${encontrados[0].id}`);
        setAdminEncontrado(encontrados[0]);
      } else {
        // ── Filtrar roles privilegiados de los resultados múltiples
        const filtrables = encontrados.filter(a => a.rol !== 'GOV_ADMIN' && a.rol !== 'ADMIN_OWNER');
        if (filtrables.length === 0) {
          setError("Los administradores encontrados no pueden ser eliminados desde el panel.");
          return;
        }
        console.log(`[${getTimestamp()}] Multiples coincidencias encontradas: ${filtrables.length}`);
        setListaResultados(filtrables);
        setMostrandoLista(true);
      }
    } catch (err: any) {
      console.log(`[${getTimestamp()}] Error en handleBuscar: ${err.message}`);
      setError(err.message || "Error al buscar administrador");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Obtiene y despliega la lista completa de administradores
   */
  const handleMostrarTodos = async () => {
      setLoading(true);
      setError("");
      setAdminEncontrado(null);
      setBusquedaTermino("");
      setConfirmacion(false);
      console.log(`[${getTimestamp()}] Solicitando lista completa de administradores`);

      try {
        const todos = await adminService.obtenerTodos();
        if (todos.length === 0) {
          setError("No hay administradores registrados");
          return;
        }

        // ── Filtrar roles privilegiados que no pueden eliminarse desde el panel
        const eliminables = todos.filter(a => a.rol !== 'GOV_ADMIN' && a.rol !== 'ADMIN_OWNER');

        if (eliminables.length === 0) {
          setError("No hay administradores eliminables desde el panel.");
          return;
        }

        setTodosAdmins(eliminables);
        setMostrandoTodos(true);
      } catch (err: any) {
        console.log(`[${getTimestamp()}] Error en handleMostrarTodos: ${err.message}`);
        setError(err.message || "Error al obtener administradores");
      } finally {
        setLoading(false);
      }
  };

  /**
   * Logica de eliminacion definitiva en el servicio
   */
  const eliminarAdmin = async (id: number) => {
    setLoading(true);
    console.log(`[${getTimestamp()}] Intentando eliminar administrador con ID: ${id}`);
    try {
      await adminService.eliminarAdministrador(id);
      
      // Actualizar listas locales despues de borrar
      setTodosAdmins(prev => prev.filter(a => a.id !== id));
      if (adminEncontrado?.id === id) {
        limpiarFormulario();
        setConfirmacion(false);
      }
      
      console.log(`[${getTimestamp()}] Eliminacion exitosa de ID: ${id}`);
      alertar("Exito", "Administrador eliminado correctamente.");
    } catch (err: any) {
      console.log(`[${getTimestamp()}] Error en proceso de eliminacion: ${err.message}`);
      setError(err.message || "Error al eliminar administrador");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Manejador para eliminacion desde la lista general con confirmacion previa
   */
  const handleEliminarDesdeLista = async (admin: Omit<Administrador, 'password'>) => {
      if (admin.rol === 'GOV_ADMIN' || admin.rol === 'ADMIN_OWNER') {
          alertar("Operación no permitida", "Este administrador no puede ser eliminado desde el panel.");
          return;
      }

      // ── Verificar que no es el único SYSTEM_ADMIN
      const totalSystemAdmins = todosAdmins.filter(a => a.rol === 'SYSTEM_ADMIN').length;
      if (admin.rol === 'SYSTEM_ADMIN' && totalSystemAdmins <= 1) {
          alertar("Operación no permitida", "No se puede eliminar el único administrador con rol SYSTEM_ADMIN.");
          return;
      }

      const mensaje = `¿Estas seguro de eliminar a ${admin.nombre ?? admin.email} de forma permanente?\n\nEsta accion es irreversible.`;
      if (Platform.OS === "web") {
          if (window.confirm(mensaje)) eliminarAdmin(admin.id);
      } else {
          Alert.alert("Confirmar eliminacion", mensaje, [
              { text: "Cancelar", style: "cancel" },
              { text: "Eliminar", style: "destructive", onPress: () => eliminarAdmin(admin.id) },
          ]);
      }
  };

  /**
   * Prepara la interfaz para la confirmacion de eliminacion individual
   */
  const handleConfirmarEliminacion = () => {
    if (!adminEncontrado) {
      setError("Debe buscar un administrador primero");
      return;
    }
    setConfirmacion(true);
  };

  /**
   * Ejecuta la eliminacion tras la confirmacion del usuario
   */
  const handleEliminar = async () => {
    if (!adminEncontrado) {
      setError("Error: No hay administrador para eliminar");
      return;
    }
    await eliminarAdmin(adminEncontrado.id);
    setConfirmacion(false);
  };

  /**
   * Reset de todos los estados del componente
   */
  const limpiarFormulario = () => {
    setBusquedaTermino("");
    setAdminEncontrado(null);
    setTodosAdmins([]);
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

  /**
   * Sub-componente para visualizar la informacion del administrador
   */
  const TarjetaAdmin = ({ admin }: { admin: Omit<Administrador, 'password'> }) => (
    <>
      <Text style={styles.tarjetaTitulo}>{admin.nombre ?? `Administrador #${admin.id}`}</Text>
      <View style={{ marginTop: 10, gap: 8 }}>
        <Text style={styles.tarjetaTexto}><Text style={{ fontWeight: 'bold' }}>ID:</Text> {admin.id}</Text>
        <Text style={styles.tarjetaTexto}><Text style={{ fontWeight: 'bold' }}>Correo:</Text> {admin.email}</Text>
        <View style={{
          backgroundColor:
            admin.rol === 'ADMIN_OWNER'  ? '#4A148C' :
            admin.rol === 'SYSTEM_ADMIN' ? '#1565C0' :
            admin.rol === 'GOV_ADMIN'    ? '#E65100' : '#2E7D32',
          padding: 5, borderRadius: 4, alignSelf: 'flex-start', marginTop: 4,
        }}>
          <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 12 }}>{admin.rol ?? '—'}</Text>
        </View>
      </View>
    </>
  );

  return (
    <ScrollView style={styles.outerScroll} contentContainerStyle={styles.outerScrollContent}>
      <View style={styles.container}>
        <Text style={styles.title}>Eliminar Administrador</Text>

        <View style={styles.formContainer}>
          {/* VISUALIZACION DE ERRORES */}
          {error && (
            <View style={{ backgroundColor: "#FFE6E6", padding: 12, borderRadius: 6, marginBottom: 16 }}>
              <Text style={{ color: "#FF6B6B", fontWeight: "bold" }}>Aviso: {error}</Text>
            </View>
          )}

          {!confirmacion ? (
            <>
              {/* ENTRADA DE BUSQUEDA */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>ID, Nombre o Correo electronico:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ej: 1 o admin@ejemplo.com"
                  placeholderTextColor="#999"
                  value={busquedaTermino}
                  onChangeText={setBusquedaTermino}
                  editable={!loading}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>

              {loading && (
                <View style={{ alignItems: 'center', marginVertical: 20 }}>
                  <ActivityIndicator size="large" color="#2196F3" />
                  <Text style={{ marginTop: 10, color: '#666' }}>Cargando...</Text>
                </View>
              )}

              {/* RESULTADO INDIVIDUAL */}
              {!loading && adminEncontrado && (
                <View style={styles.tarjeta}>
                  <TarjetaAdmin admin={adminEncontrado} />
                </View>
              )}

              {/* LISTA DE TODOS LOS ADMINISTRADORES */}
              {!loading && mostrandoTodos && todosAdmins.length > 0 && (
                <View style={{ marginTop: 10 }}>
                  <Text style={styles.label}>Total: {todosAdmins.length} administradores</Text>
                  {todosAdmins.map((admin, index) => (
                    <View key={admin.id ?? index} style={styles.tarjeta}>
                      <Pressable
                        onPress={() => handleEliminarDesdeLista(admin)}
                        disabled={loading}
                        style={{ alignSelf: 'flex-start', backgroundColor: theme.colors.error, borderRadius: 6, padding: 6, marginBottom: 8 }}
                      >
                        <Ionicons name="trash" size={20} color="#fff" />
                      </Pressable>
                      <TarjetaAdmin admin={admin} />
                    </View>
                  ))}
                </View>
              )}

              {/* LISTA DE RESULTADOS PARCIALES */}
              {!loading && mostrandoLista && listaResultados.length > 0 && (
                <View style={{ marginTop: 10 }}>
                  <Text style={styles.label}>{listaResultados.length} administradores encontrados - selecciona uno:</Text>
                  {listaResultados.map((admin, index) => (
                    <Pressable
                      key={admin.id ?? `adm-${index}`}
                      onPress={() => { setAdminEncontrado(admin); setMostrandoLista(false); setListaResultados([]); }}
                      style={{ backgroundColor: "#F0F8FF", borderWidth: 1, borderColor: "#2196F3", borderRadius: 8, padding: 12, marginBottom: 10 }}
                    >
                      <Text style={{ fontWeight: 'bold', color: '#2196F3' }}>{admin.nombre ?? `Admin #${admin.id}`}</Text>
                      <Text>ID: {admin.id}</Text>
                      <Text>Correo: {admin.email}</Text>
                    </Pressable>
                  ))}
                </View>
              )}

              {/* PANEL DE ACCIONES */}
              <View style={styles.botonesContainer}>
                <Pressable style={[styles.button, styles.buttonInsert, loading && { opacity: 0.5 }]} onPress={handleBuscar} disabled={loading}>
                  <Text style={styles.buttonText}>{loading ? "BUSCANDO..." : "BUSCAR ADMINISTRADOR"}</Text>
                </Pressable>

                <Pressable style={[styles.button, { backgroundColor: '#2196F3' }, loading && { opacity: 0.5 }]} onPress={handleMostrarTodos} disabled={loading}>
                  <Text style={styles.buttonText}>MOSTRAR TODOS</Text>
                </Pressable>

                {!loading && adminEncontrado && (
                  <Pressable style={[styles.button, styles.buttonCancel]} onPress={handleConfirmarEliminacion} disabled={loading}>
                    <Text style={styles.buttonText}>CONFIRMAR ELIMINACION</Text>
                  </Pressable>
                )}
              </View>
            </>
          ) : (
            <>
              {/* VISTA DE CONFIRMACION CRITICA */}
              <View style={{ backgroundColor: "#FFF3CD", borderLeftColor: "#FFC107", borderLeftWidth: 4, padding: 16, borderRadius: 8, marginBottom: 20 }}>
                <Text style={{ color: "#856404", fontWeight: 'bold', fontSize: 16, marginBottom: 8 }}>Advertencia</Text>
                <Text style={{ color: "#856404", fontSize: 14, lineHeight: 20 }}>
                  ¿Estas seguro de que deseas eliminar a <Text style={{ fontWeight: 'bold' }}>{adminEncontrado?.nombre ?? adminEncontrado?.email}</Text>?
                </Text>
                <Text style={{ color: "#856404", fontSize: 12, marginTop: 8, fontStyle: 'italic' }}>Esta accion no se puede deshacer.</Text>
              </View>

              {adminEncontrado && (
                <View style={styles.tarjeta}>
                  <TarjetaAdmin admin={adminEncontrado} />
                </View>
              )}

              <View style={styles.botonesContainer}>
                <Pressable style={[styles.button, { backgroundColor: "#F44336" }, loading && { opacity: 0.5 }]} onPress={handleEliminar} disabled={loading}>
                  <Text style={styles.buttonText}>{loading ? "ELIMINANDO..." : "ELIMINAR DEFINITIVAMENTE"}</Text>
                </Pressable>
                <Pressable style={[styles.button, { backgroundColor: "#9E9E9E" }]} onPress={volverABusqueda} disabled={loading}>
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

export default EliminarAdmin;