import React, { useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView, ActivityIndicator, Platform } from "react-native";
import { router } from "expo-router";
import { styles } from "@/styles/pages/management/administradores/BuscarAdminStyle";
import { adminService } from "@/services/supabase/admin";
import { Administrador } from '@/types/Admin';
import { useAuthGuard } from "@/hooks/useAuthGuard";

/**
 * UTILERÍA: Genera un timestamp actual para los logs
 */
const getTimestamp = () => new Date().toLocaleString();

function BuscarAdmin() {
  useAuthGuard();

  // --- Estados de la Interfaz ---
  const [termino, setTermino] = useState("");
  const [adminsEncontrados, setAdminsEncontrados] = useState<Omit<Administrador, 'password'>[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [buscoRealizado, setBuscoRealizado] = useState(false);

  /**
   * Manejador para la búsqueda por término específico
   */
  const handleBuscar = async () => {
    if (termino.trim() === "") {
      console.log(`[${getTimestamp()}] Intento de busqueda vacio`);
      setError("Ingresa un ID o correo electrónico");
      return;
    }
    console.log(`[${getTimestamp()}] Iniciando busqueda por termino: ${termino}`);
    await realizarBusqueda(false);
  };

  /**
   * Manejador para listar todos los administradores
   */
  const handleMostrarTodos = async () => {
    console.log(`[${getTimestamp()}] Solicitando listado completo de administradores`);
    setTermino("");
    await realizarBusqueda(true);
  };

  /**
   * Lógica centralizada de consulta al servicio de base de datos
   * @param mostrarTodos Booleano que indica si se debe ignorar el filtro de término
   */
  const realizarBusqueda = async (mostrarTodos: boolean) => {
    setLoading(true);
    setError("");
    setAdminsEncontrados([]);
    setBuscoRealizado(true);

    try {
      const todosAdmins = await adminService.obtenerTodos();

      if (todosAdmins.length === 0) {
        console.log(`[${getTimestamp()}] La consulta retorno una lista vacia`);
        setError("No hay administradores registrados en el sistema");
        return;
      }

      if (mostrarTodos) {
        console.log(`[${getTimestamp()}] Se muestran ${todosAdmins.length} registros`);
        setAdminsEncontrados(todosAdmins);
      } else {
        const terminoLower = termino.trim().toLowerCase();
        const resultados = todosAdmins.filter(admin => {
          const email = (admin?.email ?? "").toLowerCase();
          const id = admin?.id?.toString() ?? "";
          return email.includes(terminoLower) || id.includes(terminoLower);
        });

        if (resultados.length > 0) {
          console.log(`[${getTimestamp()}] Busqueda filtrada exitosa. Coincidencias: ${resultados.length}`);
          setAdminsEncontrados(resultados);
        } else {
          console.log(`[${getTimestamp()}] No hubo coincidencias para el termino: ${terminoLower}`);
          setError("No se encontraron coincidencias");
        }
      }
    } catch (err: any) {
      console.log(`[${getTimestamp()}] Error en realizarBusqueda: ${err.message}`);
      setError(err.message || "Error al conectar con la base de datos");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Resetea el estado del componente
   */
  const limpiarCampos = () => {
    console.log(`[${getTimestamp()}] Limpiando campos y resultados`);
    setTermino("");
    setAdminsEncontrados([]);
    setError("");
    setBuscoRealizado(false);
  };

  /**
   * Navegación hacia atrás
   */
  const volver = () => {
    console.log(`[${getTimestamp()}] Navegando de vuelta a MostrarPedidos`);
    router.push("/pages/management/pedidos/MostrarPedidos");
  };

  return (
    <ScrollView style={styles.outerScroll} contentContainerStyle={styles.outerScrollContent}>
      <View style={styles.container}>
        <Text style={styles.title}>Buscar Administrador</Text>

        <View style={styles.formContainer}>
          {/* SECCIÓN DE ENTRADA */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Filtrar por ID o Correo electrónico:</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: 1 o admin@ejemplo.com"
              placeholderTextColor="#999"
              value={termino}
              onChangeText={setTermino}
              editable={!loading}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          {/* MENSAJES DE ERROR */}
          {error ? (
            <View style={{ backgroundColor: "#FFE6E6", padding: 12, borderRadius: 6, marginBottom: 16 }}>
              <Text style={{ color: "#FF6B6B", fontWeight: "bold" }}>Aviso: {error}</Text>
            </View>
          ) : null}

          {/* BOTONES DE ACCIÓN */}
          <View style={styles.botonesContainer}>
            <Pressable
              style={[styles.button, styles.buttonInsert, loading && { opacity: 0.5 }]}
              onPress={handleBuscar}
              disabled={loading}
            >
              <Text style={styles.buttonText}>{loading ? "..." : "BUSCAR"}</Text>
            </Pressable>

            <Pressable
              style={[styles.button, { backgroundColor: '#2196F3' }]}
              onPress={handleMostrarTodos}
              disabled={loading}
            >
              <Text style={styles.buttonText}>MOSTRAR TODOS</Text>
            </Pressable>
          </View>

          {loading && (
            <ActivityIndicator size="large" color="#2196F3" style={{ marginVertical: 20 }} />
          )}

          {/* LISTADO DE RESULTADOS */}
          {!loading && adminsEncontrados.length > 0 && (
            <View style={{ marginTop: 10 }}>
              <Text style={styles.subtitle}>Listado de Administradores ({adminsEncontrados.length})</Text>
              {adminsEncontrados.map((admin, index) => (
                <View key={index} style={styles.tarjeta}>
                  <Text style={styles.tarjetaTitulo}>{admin.nombre ?? `Administrador #${admin.id}`}</Text>

                  <View style={{ borderBottomWidth: 1, borderBottomColor: '#eee', marginVertical: 8 }} />

                  <Text style={styles.tarjetaTexto}>
                    <Text style={{ fontWeight: 'bold' }}>ID:</Text> {admin.id}
                  </Text>

                  <Text style={styles.tarjetaTexto}>
                    <Text style={{ fontWeight: 'bold' }}>Nombre:</Text> {admin.nombre ?? '—'}
                  </Text>

                  <View style={{ backgroundColor: '#f0f7ff', padding: 5, borderRadius: 4, marginVertical: 4 }}>
                    <Text style={[styles.tarjetaTexto, { marginBottom: 0 }]}>
                      <Text style={{ fontWeight: 'bold' }}>Correo:</Text> {admin.email}
                    </Text>
                  </View>

                  <View style={{
                    backgroundColor:
                      admin.rol === 'ADMIN_OWNER'  ? '#4A148C' :
                      admin.rol === 'SYSTEM_ADMIN' ? '#1565C0' :
                      admin.rol === 'GOV_ADMIN'    ? '#E65100' : '#2E7D32',
                    padding: 5,
                    borderRadius: 4,
                    marginVertical: 4,
                    alignSelf: 'flex-start',
                  }}>
                    <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 12 }}>
                      {admin.rol ?? '—'}
                    </Text>
                  </View>

                  <Text style={[styles.tarjetaTexto, { color: '#4CAF50', fontWeight: 'bold', marginTop: 5 }]}>
                    Estatus: Activo
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* FOOTER DE BOTONES */}
          <View style={[styles.botonesContainer, { marginTop: 20 }]}>
            <Pressable style={[styles.button, { backgroundColor: '#FF9800' }]} onPress={limpiarCampos}>
              <Text style={styles.buttonText}>LIMPIAR</Text>
            </Pressable>
            <Pressable style={styles.button} onPress={volver}>
              <Text style={styles.buttonText}>VOLVER</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

export default BuscarAdmin;