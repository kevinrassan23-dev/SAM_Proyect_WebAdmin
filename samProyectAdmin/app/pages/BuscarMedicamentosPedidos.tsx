import React, { useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView, FlatList } from "react-native";
import { router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { styles } from "@/styles/BuscarPedidosMedicamentosStyle";
import theme from "@/theme/Theme";
import { pedidosService, medicamentosService } from "@/services/supabase";
import { Pedido, Medicamento } from "@/types";

function BuscarPedidoMedicamento() {
  // Estado para elegir qué buscar
  const [busquedaActiva, setBusquedaActiva] = useState<'pedidos' | 'medicamentos' | null>(null);
  const [termino, setTermino] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  const [filtroFamiliar, setFiltroFamiliar] = useState('');

  // Estados de datos
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ============ FUNCIONES BÚSQUEDA PEDIDOS ============

  const buscarPedidos = async () => {
    setLoading(true);
    setError('');
    try {
      let resultado = await pedidosService.obtenerTodos();

      // Filtrar por término si existe
      if (termino.trim()) {
        resultado = resultado.filter(p =>
          p.ID_Pedido.includes(termino) ||
          p.DNI_Paciente.includes(termino)
        );
      }

      // Filtrar por estado si existe
      if (filtroEstado.trim()) {
        resultado = resultado.filter(p =>
          p.Estado.includes(filtroEstado)
        );
      }

      if (resultado.length > 0) {
        setPedidos(resultado);
      } else {
        setError('No se encontraron pedidos');
        setPedidos([]);
      }
    } catch (err: any) {
      setError(err.message || 'Error al buscar pedidos');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const mostrarTodosPedidos = async () => {
    setLoading(true);
    setError('');
    setTermino('');
    setFiltroEstado('');

    try {
      const resultado = await pedidosService.obtenerTodos();
      if (resultado.length > 0) {
        setPedidos(resultado);
      } else {
        setError('No hay pedidos disponibles');
        setPedidos([]);
      }
    } catch (err: any) {
      setError(err.message || 'Error al obtener pedidos');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const limpiarBusquedaPedidos = () => {
    setTermino('');
    setFiltroEstado('');
    setPedidos([]);
    setError('');
    setBusquedaActiva(null);
  };

  // ============ FUNCIONES BÚSQUEDA MEDICAMENTOS ============

  const buscarMedicamentos = async () => {
    setLoading(true);
    setError('');
    try {
      let resultado = await medicamentosService.obtenerTodos();

      // Filtrar por término si existe
      if (termino.trim()) {
        resultado = resultado.filter(m =>
          m.ID_Medicamento.includes(termino) ||
          m.Nombre.toLowerCase().includes(termino.toLowerCase()) ||
          m.Marca.toLowerCase().includes(termino.toLowerCase())
        );
      }

      // Filtrar por familia si existe
      if (filtroFamiliar.trim()) {
        resultado = resultado.filter(m =>
          m.Familia.toLowerCase().includes(filtroFamiliar.toLowerCase())
        );
      }

      if (resultado.length > 0) {
        setMedicamentos(resultado);
      } else {
        setError('No se encontraron medicamentos');
        setMedicamentos([]);
      }
    } catch (err: any) {
      setError(err.message || 'Error al buscar medicamentos');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const mostrarTodosMedicamentos = async () => {
    setLoading(true);
    setError('');
    setTermino('');
    setFiltroFamiliar('');

    try {
      const resultado = await medicamentosService.obtenerTodos();
      if (resultado.length > 0) {
        setMedicamentos(resultado);
      } else {
        setError('No hay medicamentos disponibles');
        setMedicamentos([]);
      }
    } catch (err: any) {
      setError(err.message || 'Error al obtener medicamentos');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const limpiarBusquedaMedicamentos = () => {
    setTermino('');
    setFiltroFamiliar('');
    setMedicamentos([]);
    setError('');
    setBusquedaActiva(null);
  };

  // ============ RENDER ============

  const volver = () => {
    router.back();
  };

  // Estados pedidos únicos
  const obtenerEstadoUnicos = (pedidos: Pedido[]) => {
    const estados = new Set<string>();
    pedidos.forEach(p => {
      p.Estado.forEach(e => estados.add(e));
    });
    return Array.from(estados);
  };

  return (
    <ScrollView style={styles.outerScroll} contentContainerStyle={styles.outerScrollContent}>
      <View style={styles.container}>
        <Text style={styles.title}>Búsqueda de Datos</Text>

        {/* SELECCIÓN INICIAL */}
        {busquedaActiva === null && (
          <View style={styles.vista}>
            <Pressable
              style={[styles.button, styles.buttonPrimary]}
              onPress={() => {
                setBusquedaActiva('pedidos');
                limpiarBusquedaPedidos();
              }}
            >
              <MaterialIcons name="shopping-cart" size={20} color={theme.colors.textSecondary} />
              <Text style={styles.buttonText}>Buscar Pedidos</Text>
            </Pressable>

            <Pressable
              style={[styles.button, styles.buttonSecondary]}
              onPress={() => {
                setBusquedaActiva('medicamentos');
                limpiarBusquedaMedicamentos();
              }}
            >
              <MaterialIcons name="local-pharmacy" size={20} color={theme.colors.textSecondary} />
              <Text style={styles.buttonText}>Buscar Medicamentos</Text>
            </Pressable>

            <Pressable
              style={[styles.button, styles.buttonCancel]}
              onPress={volver}
            >
              <Text style={styles.buttonText}>Volver</Text>
            </Pressable>
          </View>
        )}

        {/* BÚSQUEDA PEDIDOS */}
        {busquedaActiva === 'pedidos' && (
          <View style={styles.formContainer}>
            <Text style={styles.subtitle}>Buscar Pedidos</Text>

            {/* Filtro por ID o DNI */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Buscar por ID de Pedido o DNI (opcional):</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej: PED001 o 12345678A"
                value={termino}
                onChangeText={setTermino}
                placeholderTextColor="#999"
                editable={!loading}
              />
            </View>

            {/* Filtro por Estado */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Filtro por Estado (opcional):</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej: generado, procesado, entregado"
                value={filtroEstado}
                onChangeText={setFiltroEstado}
                placeholderTextColor="#999"
                editable={!loading}
              />
            </View>

            {error && <Text style={styles.errorText}>{error}</Text>}

            {/* Botones de búsqueda */}
            <View style={styles.botonesBusqueda}>
              <Pressable
                style={[styles.button, styles.buttonSearch, loading && styles.buttonDisabled]}
                onPress={buscarPedidos}
                disabled={loading}
              >
                <MaterialIcons name="search" size={20} color={theme.colors.textSecondary} />
                <Text style={styles.buttonText}>
                  {loading ? 'Buscando...' : 'Buscar'}
                </Text>
              </Pressable>

              <Pressable
                style={[styles.button, styles.buttonInfo, loading && styles.buttonDisabled]}
                onPress={mostrarTodosPedidos}
                disabled={loading}
              >
                <MaterialIcons name="list" size={20} color={theme.colors.textSecondary} />
                <Text style={styles.buttonText}>Mostrar Todos</Text>
              </Pressable>
            </View>

            {/* RESULTADOS */}
            {pedidos.length > 0 && (
              <View style={styles.resultadosContainer}>
                <Text style={styles.subtitleResultados}>
                  Resultados: {pedidos.length} pedido(s)
                </Text>
                <FlatList
                  scrollEnabled={false}
                  data={pedidos}
                  keyExtractor={(item) => item.ID_Pedido}
                  renderItem={({ item }) => (
                    <View style={styles.tarjeta}>
                      <View style={styles.tarjetaHeader}>
                        <Text style={styles.tarjetaTitulo}>{item.ID_Pedido}</Text>
                        <View style={[styles.estadoBadge, { backgroundColor: '#4CAF50' }]}>
                          <Text style={styles.estadoTexto}>
                            {item.Estado[item.Estado.length - 1]}
                          </Text>
                        </View>
                      </View>
                      <Text style={styles.tarjetaTexto}>DNI: {item.DNI_Paciente}</Text>
                      <Text style={styles.tarjetaTexto}>Tipo: {item.Tipo_Paciente}</Text>
                      <Text style={styles.tarjetaTexto}>Descuento: {item.Descuento_Aplicado}%</Text>
                      <Text style={styles.tarjetaTexto}>Precio Total: ${item.Precio_Total.toFixed(2)}</Text>
                      <Text style={styles.tarjetaTexto}>
                        Fecha: {new Date(item.Fecha_Hora).toLocaleString()}
                      </Text>
                      <View style={styles.estadosContainer}>
                        <Text style={styles.estadosLabel}>Estados:</Text>
                        <View style={styles.estadosList}>
                          {item.Estado.map((estado, index) => (
                            <View key={index} style={styles.estadoTag}>
                              <Text style={styles.estadoTagText}>{estado}</Text>
                            </View>
                          ))}
                        </View>
                      </View>
                      {item.Notas && (
                        <Text style={styles.tarjetaTextoNotas}>Notas: {item.Notas}</Text>
                      )}
                    </View>
                  )}
                />
              </View>
            )}

            {/* Botones de acción */}
            <View style={styles.botonesAccion}>
              <Pressable
                style={[styles.button, styles.buttonSecondary]}
                onPress={limpiarBusquedaPedidos}
              >
                <MaterialIcons name="clear" size={20} color={theme.colors.textSecondary} />
                <Text style={styles.buttonText}>Limpiar Campos</Text>
              </Pressable>

              <Pressable
                style={[styles.button, styles.buttonCancel]}
                onPress={volver}
              >
                <Text style={styles.buttonText}>Volver</Text>
              </Pressable>
            </View>
          </View>
        )}

        {/* BÚSQUEDA MEDICAMENTOS */}
        {busquedaActiva === 'medicamentos' && (
          <View style={styles.formContainer}>
            <Text style={styles.subtitle}>Buscar Medicamentos</Text>

            {/* Filtro por nombre, marca o ID */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Buscar por Nombre, Marca o ID (opcional):</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej: Paracetamol o MED001"
                value={termino}
                onChangeText={setTermino}
                placeholderTextColor="#999"
                editable={!loading}
              />
            </View>

            {/* Filtro por Familia */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Filtro por Familia (opcional):</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej: Analgésicos, Antibióticos"
                value={filtroFamiliar}
                onChangeText={setFiltroFamiliar}
                placeholderTextColor="#999"
                editable={!loading}
              />
            </View>

            {error && <Text style={styles.errorText}>{error}</Text>}

            {/* Botones de búsqueda */}
            <View style={styles.botonesBusqueda}>
              <Pressable
                style={[styles.button, styles.buttonSearch, loading && styles.buttonDisabled]}
                onPress={buscarMedicamentos}
                disabled={loading}
              >
                <MaterialIcons name="search" size={20} color={theme.colors.textSecondary} />
                <Text style={styles.buttonText}>
                  {loading ? 'Buscando...' : 'Buscar'}
                </Text>
              </Pressable>

              <Pressable
                style={[styles.button, styles.buttonInfo, loading && styles.buttonDisabled]}
                onPress={mostrarTodosMedicamentos}
                disabled={loading}
              >
                <MaterialIcons name="list" size={20} color={theme.colors.textSecondary} />
                <Text style={styles.buttonText}>Mostrar Todos</Text>
              </Pressable>
            </View>

            {/* RESULTADOS */}
            {medicamentos.length > 0 && (
              <View style={styles.resultadosContainer}>
                <Text style={styles.subtitleResultados}>
                  Resultados: {medicamentos.length} medicamento(s)
                </Text>
                <FlatList
                  scrollEnabled={false}
                  data={medicamentos}
                  keyExtractor={(item) => item.ID_Medicamento}
                  renderItem={({ item }) => (
                    <View style={styles.tarjeta}>
                      <View style={styles.tarjetaHeader}>
                        <View>
                          <Text style={styles.tarjetaTitulo}>{item.Nombre}</Text>
                          <Text style={styles.tarjetaMarca}>{item.Marca}</Text>
                        </View>
                        <View style={[
                          styles.tipoBadge,
                          { backgroundColor: item.Tipo === 'con_receta' ? '#FF9800' : '#4CAF50' }
                        ]}>
                          <Text style={styles.tipoTexto}>
                            {item.Tipo === 'con_receta' ? 'Receta' : 'Libre'}
                          </Text>
                        </View>
                      </View>
                      <Text style={styles.tarjetaTexto}>ID: {item.ID_Medicamento}</Text>
                      <Text style={styles.tarjetaTexto}>Familia: {item.Familia}</Text>
                      <Text style={styles.tarjetaTexto}>Precio: ${item.Precio.toFixed(2)}</Text>
                      <Text style={styles.tarjetaTexto}>Stock: {item.Stock} unidades</Text>
                      <Text style={[
                        styles.tarjetaTexto,
                        { color: item.Stock > 0 ? '#4CAF50' : '#F44336' }
                      ]}>
                        {item.Stock > 0 ? '✓ Disponible' : '✗ Sin stock'}
                      </Text>
                      {item.Descripcion && (
                        <Text style={styles.tarjetaTextoDescripcion}>
                          Descripción: {item.Descripcion}
                        </Text>
                      )}
                      <View style={styles.activoBadge}>
                        <Text style={[
                          styles.activoTexto,
                          { color: item.Activo ? '#4CAF50' : '#999' }
                        ]}>
                          {item.Activo ? '● Activo' : '● Inactivo'}
                        </Text>
                      </View>
                    </View>
                  )}
                />
              </View>
            )}

            {/* Botones de acción */}
            <View style={styles.botonesAccion}>
              <Pressable
                style={[styles.button, styles.buttonSecondary]}
                onPress={limpiarBusquedaMedicamentos}
              >
                <MaterialIcons name="clear" size={20} color={theme.colors.textSecondary} />
                <Text style={styles.buttonText}>Limpiar Campos</Text>
              </Pressable>

              <Pressable
                style={[styles.button, styles.buttonCancel]}
                onPress={volver}
              >
                <Text style={styles.buttonText}>Volver</Text>
              </Pressable>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

export default BuscarPedidoMedicamento;