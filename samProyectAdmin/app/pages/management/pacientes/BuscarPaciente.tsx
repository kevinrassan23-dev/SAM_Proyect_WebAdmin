import React, { useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { styles } from "@/styles/pages/management/pacientes/BuscarPacienteStyle";
import { pacientesService } from "@/services/firebase";
import { Paciente } from "@/types/paciente";

/**
 * UTILERÍA: Genera un timestamp actual para los logs de trazabilidad
 */
const getTimestamp = () => new Date().toLocaleString();

function BuscarPaciente() {
  // --- Estados de Búsqueda y Resultados ---
  const [termino, setTermino] = useState("");
  const [pacientesEncontrados, setPacientesEncontrados] = useState<Paciente[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [buscoRealizado, setBuscoRealizado] = useState(false);

  /**
   * Manejador para búsqueda individual por filtro
   */
  const handleBuscar = async () => {
    if (termino.trim() === "") {
      setError("Ingresa un DNI o número de cartilla");
      return;
    }
    console.log(`[${getTimestamp()}] Ejecutando busqueda filtrada por: ${termino}`);
    await realizarBusqueda(false);
  };

  /**
   * Manejador para obtener la totalidad de los registros
   */
  const handleMostrarTodos = async () => {
    setTermino(""); // Limpiamos el término para indicar que es lista completa
    console.log(`[${getTimestamp()}] Solicitando lista completa de pacientes`);
    await realizarBusqueda(true);
  };

  /**
   * Lógica central de comunicación con Firebase y filtrado local
   * @param mostrarTodos Booleano que define si se aplica filtro o se muestra todo
   */
  const realizarBusqueda = async (mostrarTodos: boolean) => {
    setLoading(true);
    setError("");
    setPacientesEncontrados([]);
    setBuscoRealizado(true);

    try {
      const todosPacientes = await pacientesService.obtenerTodos();
      
      if (todosPacientes.length === 0) {
        console.log(`[${getTimestamp()}] La base de datos esta vacia`);
        setError("No hay pacientes registrados en el sistema");
        return;
      }

      if (mostrarTodos) {
        console.log(`[${getTimestamp()}] Exito: Cargados ${todosPacientes.length} registros`);
        setPacientesEncontrados(todosPacientes);
      } else {
        const terminoUpper = termino.trim().toUpperCase();
        const resultados = todosPacientes.filter(paciente => {
          const dni = (paciente?.DNI ?? "").toUpperCase();
          const cartilla = (paciente?.Num_Cartilla ?? "").toUpperCase();
          return dni.includes(terminoUpper) || cartilla.includes(terminoUpper);
        });

        if (resultados.length > 0) {
          console.log(`[${getTimestamp()}] Exito: Encontradas ${resultados.length} coincidencias`);
          setPacientesEncontrados(resultados);
        } else {
          console.log(`[${getTimestamp()}] Sin resultados para la busqueda: ${terminoUpper}`);
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
    console.log(`[${getTimestamp()}] Limpiando criterios de busqueda y resultados`);
    setTermino("");
    setPacientesEncontrados([]);
    setError("");
    setBuscoRealizado(false);
  };

  /**
   * Navegación de retorno
   */
  const volver = () => {
    console.log(`[${getTimestamp()}] Navegando de vuelta a MostrarPedidos`);
    router.push("/pages/management/pedidos/MostrarPedidos");
  };

  return (
    <ScrollView style={styles.outerScroll} contentContainerStyle={styles.outerScrollContent}>
      <View style={styles.container}>
        <Text style={styles.title}>Buscar Pacientes</Text>

        <View style={styles.formContainer}>
          {/* INPUT DE FILTRO */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Filtrar por DNI o Cartilla:</Text>
            <TextInput 
              style={styles.input} 
              placeholder="Ej: 12345678Z"
              value={termino}
              onChangeText={setTermino}
              editable={!loading}
              autoCapitalize="characters"
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

          {/* RENDERIZADO DINÁMICO DE TARJETAS DE PACIENTE */}
          {!loading && pacientesEncontrados.length > 0 && (
            <View style={{ marginTop: 10 }}>
              <Text style={styles.subtitle}>Listado de Pacientes ({pacientesEncontrados.length})</Text>
              {pacientesEncontrados.map((paciente, index) => (
                <View key={index} style={styles.tarjeta}>
                  <Text style={styles.tarjetaTitulo}>{paciente.Nombre_Paciente}</Text>
                  
                  <View style={{ borderBottomWidth: 1, borderBottomColor: '#eee', marginVertical: 8 }} />

                  <Text style={styles.tarjetaTexto}><Text style={{ fontWeight: 'bold' }}>DNI:</Text> {paciente.DNI}</Text>
                  <Text style={styles.tarjetaTexto}><Text style={{ fontWeight: 'bold' }}>Cartilla:</Text> {paciente.Num_Cartilla}</Text>
                  
                  {/* SECCIÓN: INFORMACIÓN DE TIPO */}
                  <View style={{ backgroundColor: '#f0f7ff', padding: 5, borderRadius: 4, marginVertical: 4 }}>
                    <Text style={[styles.tarjetaTexto, { marginBottom: 0 }]}>
                      <Text style={{ fontWeight: 'bold' }}>Tipo de paciente:</Text> {paciente.Tipo_Paciente?.toUpperCase() ?? 'N/A'}
                    </Text>
                  </View>

                  <Text style={styles.tarjetaTexto}><Text style={{ fontWeight: 'bold' }}>Teléfono:</Text> {paciente.Num_Telefono}</Text>
                  
                  {/* INDICADOR DE ESTADO ACTIVO/INACTIVO */}
                  <Text style={[styles.tarjetaTexto, { color: paciente.Activo ? '#4CAF50' : '#F44336', fontWeight: 'bold', marginTop: 5 }]}>
                    Estado: {paciente.Activo ? 'Check Activo' : 'X Inactivo'}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* BOTONES DE NAVEGACIÓN Y LIMPIEZA */}
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

export default BuscarPaciente;