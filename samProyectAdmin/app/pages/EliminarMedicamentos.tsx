import React, { useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView, Alert, FlatList } from "react-native";
import { router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { styles } from "@/styles/EliminarMedicamentosStyle";
import theme from "@/theme/Theme";
import { medicamentosService } from "@/services/supabase";
import { Medicamento } from "@/types";

interface MedicamentoConSeleccion extends Medicamento {
  seleccionado?: boolean;
}

function EliminarMedicamento() {
  // Estados de búsqueda
  const [busquedaTermino, setBusquedaTermino] = useState('');
  const [filtroFamilia, setFiltroFamilia] = useState('');

  // Estados de datos
  const [medicamentos, setMedicamentos] = useState<MedicamentoConSeleccion[]>([]);
  const [medicamentosAEliminar, setMedicamentosAEliminar] = useState<MedicamentoConSeleccion[]>([]);
  const [seleccionarTodos, setSeleccionarTodos] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paso, setPaso] = useState<'lista' | 'confirmacion'>('lista');

  // ============ FUNCIONES BÚSQUEDA Y FILTRO ============

  const buscarMedicamentos = async () => {
    setLoading(true);
    setError('');

    try {
      let resultado = await medicamentosService.obtenerTodos();

      // Filtrar por término si existe
      if (busquedaTermino.trim()) {
        resultado = resultado.filter(m =>
          m.ID_Medicamento.includes(busquedaTermino) ||
          m.Nombre.toLowerCase().includes(busquedaTermino.toLowerCase()) ||
          m.Marca.toLowerCase().includes(busquedaTermino.toLowerCase())
        );
      }

      // Filtrar por familia si existe
      if (filtroFamilia.trim()) {
        resultado = resultado.filter(m =>
          m.Familia.toLowerCase().includes(filtroFamilia.toLowerCase())
        );
      }

      const medicamentosConSeleccion: MedicamentoConSeleccion[] = resultado.map(m => ({
        ...m,
        seleccionado: false,
      }));

      setMedicamentos(medicamentosConSeleccion);
      setSeleccionarTodos(false);

      if (resultado.length === 0) {
        setError('No se encontraron medicamentos');
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
    setBusquedaTermino('');
    setFiltroFamilia('');

    try {
      const resultado = await medicamentosService.obtenerTodos();
      
      const medicamentosConSeleccion: MedicamentoConSeleccion[] = resultado.map(m => ({
        ...m,
        seleccionado: false,
      }));

      setMedicamentos(medicamentosConSeleccion);
      setSeleccionarTodos(false);

      if (resultado.length === 0) {
        setError('No hay medicamentos disponibles');
      }
    } catch (err: any) {
      setError(err.message || 'Error al obtener medicamentos');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // ============ FUNCIONES SELECCIÓN ============

  const toggleMedicamento = (idMedicamento: string) => {
    setMedicamentos(prev =>
      prev.map(m =>
        m.ID_Medicamento === idMedicamento ? { ...m, seleccionado: !m.seleccionado } : m
      )
    );
  };

  const toggleTodosMedicamentos = () => {
    const nuevoEstado = !seleccionarTodos;
    setSeleccionarTodos(nuevoEstado);
    setMedicamentos(prev =>
      prev.map(m => ({ ...m, seleccionado: nuevoEstado }))
    );
  };

  const seleccionarMedicamentosParaEliminar = () => {
    const seleccionados = medicamentos.filter(m => m.seleccionado);

    if (seleccionados.length === 0) {
      setError('Selecciona al menos un medicamento');
      return;
    }

    setMedicamentosAEliminar(seleccionados);
    setPaso('confirmacion');
  };

  // ============ FUNCIONES ELIMINACIÓN ============

  const confirmarEliminacion = async () => {
    setLoading(true);
    setError('');

    try {
      let eliminados = 0;
      let errores = 0;

      for (const medicamento of medicamentosAEliminar) {
        try {
          // Aquí iría la lógica de eliminación en Supabase
          // await medicamentosService.eliminarMedicamento(medicamento.ID_Medicamento);
          eliminados++;
        } catch (err) {
          errores++;
          console.error(`Error eliminando medicamento ${medicamento.ID_Medicamento}:`, err);
        }
      }

      const mensaje = `Se eliminaron ${eliminados} medicamento(s)${errores > 0 ? ` (${errores} errores)` : ''}`;
      Alert.alert('Éxito', mensaje);

      // Limpiar y volver a listar
      await mostrarTodosMedicamentos();
      setMedicamentosAEliminar([]);
      setPaso('lista');
    } catch (err: any) {
      setError(err.message || 'Error al eliminar medicamentos');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const cancelarEliminacion = () => {
    setMedicamentosAEliminar([]);
    setPaso('lista');
    setError('');
  };

  const limpiarBusqueda = () => {
    setBusquedaTermino('');
    setFiltroFamilia('');
    setMedicamentos([]);
    setMedicamentosAEliminar([]);
    setSeleccionarTodos(false);
    setError('');
    setPaso('lista');
  };

  const volver = () => {
    router.back();
  };

  // ============ RENDER ============

  return (
    <ScrollView style={styles.outerScroll} contentContainerStyle={styles.outerScrollContent}>
      <View style={styles.container}>
        <Text style={styles.title}>Eliminar Medicamentos</Text>

        <View style={styles.formContainer}>
          <Text style={styles.subtitle}>
            {paso === 'lista' ? 'Seleccionar Medicamentos' : 'Confirmar Eliminación'}
          </Text>

          {error && <Text style={styles.errorText}>{error}</Text>}

          {/* PASO 1: LISTA */}
          {paso === 'lista' && (
            <>
              {/* Filtro por nombre, marca o ID */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Buscar por ID, Nombre o Marca (opcional):</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ej: MED001 o Paracetamol"
                  value={busquedaTermino}
                  onChangeText={setBusquedaTermino}
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
                  value={filtroFamilia}
                  onChangeText={setFiltroFamilia}
                  placeholderTextColor="#999"
                  editable={!loading}
                />
              </View>

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

              {medicamentos.length > 0 && (
                <>
                  {/* SELECCIONAR TODOS */}
                  <View style={styles.selectAllContainer}>
                    <Pressable
                      style={styles.checkbox}
                      onPress={toggleTodosMedicamentos}
                    >
                      {seleccionarTodos && (
                        <MaterialIcons name="check" size={20} color={theme.colors.primary} />
                      )}
                    </Pressable>
                    <Text style={styles.selectAllText}>
                      Seleccionar todos ({medicamentos.length})
                    </Text>
                  </View>

                  {/* LISTA DE MEDICAMENTOS */}
                  <View style={styles.listaContainer}>
                    {medicamentos.map((medicamento) => (
                      <Pressable
                        key={medicamento.ID_Medicamento}
                        style={[
                          styles.itemContainer,
                          medicamento.seleccionado && styles.itemContainerSelected,
                        ]}
                        onPress={() => toggleMedicamento(medicamento.ID_Medicamento)}
                      >
                        <View style={styles.checkbox}>
                          {medicamento.seleccionado && (
                            <MaterialIcons name="check" size={20} color={theme.colors.primary} />
                          )}
                        </View>
                        <View style={styles.itemContent}>
                          <Text style={styles.itemTitulo}>{medicamento.Nombre}</Text>
                          <Text style={styles.itemMarca}>{medicamento.Marca}</Text>
                          <Text style={styles.itemTexto}>ID: {medicamento.ID_Medicamento}</Text>
                          <Text style={styles.itemTexto}>Familia: {medicamento.Familia}</Text>
                          <View style={styles.itemFooter}>
                            <Text style={styles.itemPrecio}>€{medicamento.Precio.toFixed(2)}</Text>
                            <View style={[
                              styles.stockBadge,
                              { backgroundColor: medicamento.Stock > 0 ? '#4CAF50' : '#F44336' }
                            ]}>
                              <Text style={styles.stockTexto}>{medicamento.Stock} u.</Text>
                            </View>
                          </View>
                        </View>
                      </Pressable>
                    ))}
                  </View>

                  {/* BOTONES ACCIÓN */}
                  <View style={styles.botonesContainer}>
                    <Pressable
                      style={[
                        styles.button,
                        styles.buttonDelete,
                        medicamentos.filter(m => m.seleccionado).length === 0 && styles.buttonDisabled,
                      ]}
                      onPress={seleccionarMedicamentosParaEliminar}
                      disabled={medicamentos.filter(m => m.seleccionado).length === 0}
                    >
                      <MaterialIcons name="delete" size={20} color={theme.colors.textSecondary} />
                      <Text style={styles.buttonText}>
                        Eliminar seleccionados ({medicamentos.filter(m => m.seleccionado).length})
                      </Text>
                    </Pressable>

                    <Pressable
                      style={[styles.button, styles.buttonSecondary]}
                      onPress={limpiarBusqueda}
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
                </>
              )}
            </>
          )}

          {/* PASO 2: CONFIRMACIÓN */}
          {paso === 'confirmacion' && medicamentosAEliminar.length > 0 && (
            <>
              <View style={styles.advertenciaContainer}>
                <MaterialIcons name="warning" size={32} color="#FF6B6B" />
                <Text style={styles.advertenciaTitulo}>Advertencia</Text>
                <Text style={styles.advertenciaTexto}>
                  Estás a punto de eliminar {medicamentosAEliminar.length} medicamento(s). Esta acción no se puede deshacer.
                </Text>
              </View>

              <View style={styles.listaConfirmacion}>
                <Text style={styles.subtitleSmall}>Medicamentos a eliminar:</Text>
                {medicamentosAEliminar.map((medicamento) => (
                  <View key={medicamento.ID_Medicamento} style={styles.itemConfirmacion}>
                    <View style={styles.itemConfirmacionHeader}>
                      <View>
                        <Text style={styles.itemConfirmacionTitulo}>{medicamento.Nombre}</Text>
                        <Text style={styles.itemConfirmacionMarca}>{medicamento.Marca}</Text>
                      </View>
                      <Text style={styles.itemConfirmacionPrecio}>€{medicamento.Precio.toFixed(2)}</Text>
                    </View>
                    <Text style={styles.itemConfirmacionTexto}>ID: {medicamento.ID_Medicamento}</Text>
                    <Text style={styles.itemConfirmacionTexto}>Familia: {medicamento.Familia}</Text>
                    <Text style={[
                      styles.itemConfirmacionTexto,
                      { color: medicamento.Stock > 0 ? '#4CAF50' : '#F44336' }
                    ]}>
                      Stock: {medicamento.Stock} unidades
                    </Text>
                  </View>
                ))}
              </View>

              <View style={styles.resumenEliminacion}>
                <Text style={styles.resumenTitulo}>Resumen de Eliminación</Text>
                <View style={styles.resumenFila}>
                  <Text style={styles.resumenLabel}>Total de medicamentos:</Text>
                  <Text style={styles.resumenValor}>{medicamentosAEliminar.length}</Text>
                </View>
                <View style={styles.resumenFila}>
                  <Text style={styles.resumenLabel}>Stock total:</Text>
                  <Text style={styles.resumenValor}>
                    {medicamentosAEliminar.reduce((sum, m) => sum + m.Stock, 0)} unidades
                  </Text>
                </View>
                <View style={styles.resumenFila}>
                  <Text style={styles.resumenLabel}>Valor total:</Text>
                  <Text style={styles.resumenValor}>
                    €{medicamentosAEliminar.reduce((sum, m) => sum + (m.Precio * m.Stock), 0).toFixed(2)}
                  </Text>
                </View>
              </View>

              <View style={styles.botonesContainer}>
                <Pressable
                  style={[styles.button, styles.buttonDelete, loading && styles.buttonDisabled]}
                  onPress={confirmarEliminacion}
                  disabled={loading}
                >
                  <MaterialIcons name="delete-forever" size={20} color={theme.colors.textSecondary} />
                  <Text style={styles.buttonText}>
                    {loading ? 'Eliminando...' : 'Confirmar eliminación'}
                  </Text>
                </Pressable>

                <Pressable
                  style={[styles.button, styles.buttonSecondary]}
                  onPress={cancelarEliminacion}
                  disabled={loading}
                >
                  <Text style={styles.buttonText}>Cancelar</Text>
                </Pressable>
              </View>
            </>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

export default EliminarMedicamento;