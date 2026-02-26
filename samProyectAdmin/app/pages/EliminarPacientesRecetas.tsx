import React, { useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView, Alert, FlatList } from "react-native";
import { router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { styles } from "@/styles/EliminarPacientesRecetasStyle";
import theme from "@/theme/Theme";
import { pacientesService, recetasService } from "@/services/firebase";
import { Paciente, Receta } from "@/types";

interface PacienteConSeleccion extends Paciente {
  seleccionado?: boolean;
}

interface RecetaConSeleccion extends Receta {
  seleccionado?: boolean;
}

function EliminarPacienteReceta() {
  // Estado para elegir qué eliminar
  const [tipoEliminar, setTipoEliminar] = useState<'pacientes' | 'recetas' | null>(null);
  const [paso, setPaso] = useState<'lista' | 'confirmacion'>('lista');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Estados para PACIENTES
  const [busquedaPaciente, setBusquedaPaciente] = useState('');
  const [pacientes, setPacientes] = useState<PacienteConSeleccion[]>([]);
  const [seleccionarTodosPacientes, setSeleccionarTodosPacientes] = useState(false);
  const [pacientesAEliminar, setPacientesAEliminar] = useState<PacienteConSeleccion[]>([]);

  // Estados para RECETAS
  const [busquedaReceta, setBusquedaReceta] = useState('');
  const [recetas, setRecetas] = useState<RecetaConSeleccion[]>([]);
  const [seleccionarTodasRecetas, setSeleccionarTodasRecetas] = useState(false);
  const [recetasAEliminar, setRecetasAEliminar] = useState<RecetaConSeleccion[]>([]);

  // ============ FUNCIONES BÚSQUEDA PACIENTES ============

  const buscarPacientes = async () => {
    setLoading(true);
    setError('');

    try {
      let resultado: Paciente[] = [];

      if (busquedaPaciente.trim() === '') {
        // Si no hay búsqueda, obtener todos
        resultado = await pacientesService.obtenerTodos();
      } else {
        // Buscar por término
        const todos = await pacientesService.obtenerTodos();
        resultado = todos.filter(p =>
          p.DNI.includes(busquedaPaciente) ||
          p.Num_Cartilla.includes(busquedaPaciente) ||
          p.Nombre_Paciente.toLowerCase().includes(busquedaPaciente.toLowerCase())
        );
      }

      const pacientesConSeleccion: PacienteConSeleccion[] = resultado.map(p => ({
        ...p,
        seleccionado: false,
      }));

      setPacientes(pacientesConSeleccion);
      setSeleccionarTodosPacientes(false);

      if (resultado.length === 0) {
        setError('No se encontraron pacientes');
      }
    } catch (err: any) {
      setError(err.message || 'Error al buscar pacientes');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const togglePaciente = (dni: string) => {
    setPacientes(prev =>
      prev.map(p =>
        p.DNI === dni ? { ...p, seleccionado: !p.seleccionado } : p
      )
    );
  };

  const toggleTodosPacientes = () => {
    const nuevoEstado = !seleccionarTodosPacientes;
    setSeleccionarTodosPacientes(nuevoEstado);
    setPacientes(prev =>
      prev.map(p => ({ ...p, seleccionado: nuevoEstado }))
    );
  };

  const seleccionarPacientesParaEliminar = () => {
    const seleccionados = pacientes.filter(p => p.seleccionado);

    if (seleccionados.length === 0) {
      setError('Selecciona al menos un paciente');
      return;
    }

    setPacientesAEliminar(seleccionados);
    setPaso('confirmacion');
  };

  const confirmarEliminacionPacientes = async () => {
    setLoading(true);
    setError('');

    try {
      let eliminados = 0;
      let errores = 0;

      for (const paciente of pacientesAEliminar) {
        try {
          // Aquí iría la lógica de eliminación en Firebase
          // await pacientesService.eliminarPaciente(paciente.DNI);
          eliminados++;
        } catch (err) {
          errores++;
          console.error(`Error eliminando paciente ${paciente.DNI}:`, err);
        }
      }

      const mensaje = `Se eliminaron ${eliminados} paciente(s)${errores > 0 ? ` (${errores} errores)` : ''}`;
      Alert.alert('Éxito', mensaje);

      // Limpiar y volver a listar
      await buscarPacientes();
      setPacientesAEliminar([]);
      setPaso('lista');
    } catch (err: any) {
      setError(err.message || 'Error al eliminar pacientes');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const cancelarEliminacionPacientes = () => {
    setPacientesAEliminar([]);
    setPaso('lista');
    setError('');
  };

  // ============ FUNCIONES BÚSQUEDA RECETAS ============

  const buscarRecetas = async () => {
    setLoading(true);
    setError('');

    try {
      let resultado: Receta[] = [];

      if (busquedaReceta.trim() === '') {
        // Si no hay búsqueda, obtener todas
        resultado = await recetasService.obtenerTodas();
      } else {
        // Buscar por término
        const todas = await recetasService.obtenerTodas();
        resultado = todas.filter(r =>
          r.ID_Receta.includes(busquedaReceta) ||
          r.DNI_Paciente.includes(busquedaReceta) ||
          r.Nombre_Especialista.toLowerCase().includes(busquedaReceta.toLowerCase())
        );
      }

      const recetasConSeleccion: RecetaConSeleccion[] = resultado.map(r => ({
        ...r,
        seleccionado: false,
      }));

      setRecetas(recetasConSeleccion);
      setSeleccionarTodasRecetas(false);

      if (resultado.length === 0) {
        setError('No se encontraron recetas');
      }
    } catch (err: any) {
      setError(err.message || 'Error al buscar recetas');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleReceta = (idReceta: string) => {
    setRecetas(prev =>
      prev.map(r =>
        r.ID_Receta === idReceta ? { ...r, seleccionado: !r.seleccionado } : r
      )
    );
  };

  const toggleTodasRecetas = () => {
    const nuevoEstado = !seleccionarTodasRecetas;
    setSeleccionarTodasRecetas(nuevoEstado);
    setRecetas(prev =>
      prev.map(r => ({ ...r, seleccionado: nuevoEstado }))
    );
  };

  const seleccionarRecetasParaEliminar = () => {
    const seleccionadas = recetas.filter(r => r.seleccionado);

    if (seleccionadas.length === 0) {
      setError('Selecciona al menos una receta');
      return;
    }

    setRecetasAEliminar(seleccionadas);
    setPaso('confirmacion');
  };

  const confirmarEliminacionRecetas = async () => {
    setLoading(true);
    setError('');

    try {
      let eliminadas = 0;
      let errores = 0;

      for (const receta of recetasAEliminar) {
        try {
          // Aquí iría la lógica de eliminación en Firebase
          // await recetasService.eliminarReceta(receta.ID_Receta);
          eliminadas++;
        } catch (err) {
          errores++;
          console.error(`Error eliminando receta ${receta.ID_Receta}:`, err);
        }
      }

      const mensaje = `Se eliminaron ${eliminadas} receta(s)${errores > 0 ? ` (${errores} errores)` : ''}`;
      Alert.alert('Éxito', mensaje);

      // Limpiar y volver a listar
      await buscarRecetas();
      setRecetasAEliminar([]);
      setPaso('lista');
    } catch (err: any) {
      setError(err.message || 'Error al eliminar recetas');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const cancelarEliminacionRecetas = () => {
    setRecetasAEliminar([]);
    setPaso('lista');
    setError('');
  };

  // ============ RENDER ============

  const volver = () => {
    router.back();
  };

  return (
    <ScrollView style={styles.outerScroll} contentContainerStyle={styles.outerScrollContent}>
      <View style={styles.container}>
        <Text style={styles.title}>Eliminar Datos</Text>

        {/* SELECCIÓN INICIAL */}
        {tipoEliminar === null && (
          <View style={styles.vista}>
            <Pressable
              style={[styles.button, styles.buttonDelete]}
              onPress={() => {
                setTipoEliminar('pacientes');
                setPaso('lista');
                setBusquedaPaciente('');
                setPacientes([]);
                setError('');
              }}
            >
              <MaterialIcons name="person-remove" size={20} color={theme.colors.textSecondary} />
              <Text style={styles.buttonText}>Eliminar Paciente</Text>
            </Pressable>

            <Pressable
              style={[styles.button, styles.buttonDelete]}
              onPress={() => {
                setTipoEliminar('recetas');
                setPaso('lista');
                setBusquedaReceta('');
                setRecetas([]);
                setError('');
              }}
            >
              <MaterialIcons name="delete-note" size={20} color={theme.colors.textSecondary} />
              <Text style={styles.buttonText}>Eliminar Receta</Text>
            </Pressable>

            <Pressable
              style={[styles.button, styles.buttonCancel]}
              onPress={volver}
            >
              <Text style={styles.buttonText}>Volver</Text>
            </Pressable>
          </View>
        )}

        {/* ELIMINAR PACIENTES */}
        {tipoEliminar === 'pacientes' && (
          <View style={styles.formContainer}>
            <Text style={styles.subtitle}>
              {paso === 'lista' ? 'Seleccionar Pacientes' : 'Confirmar Eliminación'}
            </Text>

            {error && <Text style={styles.errorText}>{error}</Text>}

            {/* PASO 1: LISTA */}
            {paso === 'lista' && (
              <>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Buscar paciente (opcional):</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="DNI, cartilla o nombre"
                    value={busquedaPaciente}
                    onChangeText={setBusquedaPaciente}
                    placeholderTextColor="#999"
                    editable={!loading}
                  />
                </View>

                <Pressable
                  style={[styles.button, styles.buttonSearch, loading && styles.buttonDisabled]}
                  onPress={buscarPacientes}
                  disabled={loading}
                >
                  <MaterialIcons name="search" size={20} color={theme.colors.textSecondary} />
                  <Text style={styles.buttonText}>
                    {loading ? 'Buscando...' : 'Buscar'}
                  </Text>
                </Pressable>

                {pacientes.length > 0 && (
                  <>
                    {/* SELECCIONAR TODOS */}
                    <View style={styles.selectAllContainer}>
                      <Pressable
                        style={styles.checkbox}
                        onPress={toggleTodosPacientes}
                      >
                        {seleccionarTodosPacientes && (
                          <MaterialIcons name="check" size={20} color={theme.colors.primary} />
                        )}
                      </Pressable>
                      <Text style={styles.selectAllText}>
                        Seleccionar todos ({pacientes.length})
                      </Text>
                    </View>

                    {/* LISTA DE PACIENTES */}
                    <View style={styles.listaContainer}>
                      {pacientes.map((paciente) => (
                        <Pressable
                          key={paciente.DNI}
                          style={[
                            styles.itemContainer,
                            paciente.seleccionado && styles.itemContainerSelected,
                          ]}
                          onPress={() => togglePaciente(paciente.DNI)}
                        >
                          <View style={styles.checkbox}>
                            {paciente.seleccionado && (
                              <MaterialIcons name="check" size={20} color={theme.colors.primary} />
                            )}
                          </View>
                          <View style={styles.itemContent}>
                            <Text style={styles.itemTitulo}>{paciente.Nombre_Paciente}</Text>
                            <Text style={styles.itemTexto}>DNI: {paciente.DNI}</Text>
                            <Text style={styles.itemTexto}>Cartilla: {paciente.Num_Cartilla}</Text>
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
                          pacientes.filter(p => p.seleccionado).length === 0 && styles.buttonDisabled,
                        ]}
                        onPress={seleccionarPacientesParaEliminar}
                        disabled={pacientes.filter(p => p.seleccionado).length === 0}
                      >
                        <MaterialIcons name="delete" size={20} color={theme.colors.textSecondary} />
                        <Text style={styles.buttonText}>
                          Eliminar seleccionados ({pacientes.filter(p => p.seleccionado).length})
                        </Text>
                      </Pressable>

                      <Pressable
                        style={[styles.button, styles.buttonCancel]}
                        onPress={() => setTipoEliminar(null)}
                      >
                        <Text style={styles.buttonText}>Atrás</Text>
                      </Pressable>
                    </View>
                  </>
                )}
              </>
            )}

            {/* PASO 2: CONFIRMACIÓN */}
            {paso === 'confirmacion' && pacientesAEliminar.length > 0 && (
              <>
                <View style={styles.advertenciaContainer}>
                  <MaterialIcons name="warning" size={32} color="#FF6B6B" />
                  <Text style={styles.advertenciaTitulo}>Advertencia</Text>
                  <Text style={styles.advertenciaTexto}>
                    Estás a punto de eliminar {pacientesAEliminar.length} paciente(s). Esta acción no se puede deshacer.
                  </Text>
                </View>

                <View style={styles.listaConfirmacion}>
                  <Text style={styles.subtitleSmall}>Pacientes a eliminar:</Text>
                  {pacientesAEliminar.map((paciente) => (
                    <View key={paciente.DNI} style={styles.itemConfirmacion}>
                      <Text style={styles.itemConfirmacionTitulo}>{paciente.Nombre_Paciente}</Text>
                      <Text style={styles.itemConfirmacionTexto}>DNI: {paciente.DNI}</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.botonesContainer}>
                  <Pressable
                    style={[styles.button, styles.buttonDelete, loading && styles.buttonDisabled]}
                    onPress={confirmarEliminacionPacientes}
                    disabled={loading}
                  >
                    <MaterialIcons name="delete-forever" size={20} color={theme.colors.textSecondary} />
                    <Text style={styles.buttonText}>
                      {loading ? 'Eliminando...' : 'Confirmar eliminación'}
                    </Text>
                  </Pressable>

                  <Pressable
                    style={[styles.button, styles.buttonSecondary]}
                    onPress={cancelarEliminacionPacientes}
                    disabled={loading}
                  >
                    <Text style={styles.buttonText}>Cancelar</Text>
                  </Pressable>
                </View>
              </>
            )}
          </View>
        )}

        {/* ELIMINAR RECETAS */}
        {tipoEliminar === 'recetas' && (
          <View style={styles.formContainer}>
            <Text style={styles.subtitle}>
              {paso === 'lista' ? 'Seleccionar Recetas' : 'Confirmar Eliminación'}
            </Text>

            {error && <Text style={styles.errorText}>{error}</Text>}

            {/* PASO 1: LISTA */}
            {paso === 'lista' && (
              <>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Buscar receta (opcional):</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="ID, DNI o especialista"
                    value={busquedaReceta}
                    onChangeText={setBusquedaReceta}
                    placeholderTextColor="#999"
                    editable={!loading}
                  />
                </View>

                <Pressable
                  style={[styles.button, styles.buttonSearch, loading && styles.buttonDisabled]}
                  onPress={buscarRecetas}
                  disabled={loading}
                >
                  <MaterialIcons name="search" size={20} color={theme.colors.textSecondary} />
                  <Text style={styles.buttonText}>
                    {loading ? 'Buscando...' : 'Buscar'}
                  </Text>
                </Pressable>

                {recetas.length > 0 && (
                  <>
                    {/* SELECCIONAR TODOS */}
                    <View style={styles.selectAllContainer}>
                      <Pressable
                        style={styles.checkbox}
                        onPress={toggleTodasRecetas}
                      >
                        {seleccionarTodasRecetas && (
                          <MaterialIcons name="check" size={20} color={theme.colors.primary} />
                        )}
                      </Pressable>
                      <Text style={styles.selectAllText}>
                        Seleccionar todas ({recetas.length})
                      </Text>
                    </View>

                    {/* LISTA DE RECETAS */}
                    <View style={styles.listaContainer}>
                      {recetas.map((receta) => (
                        <Pressable
                          key={receta.ID_Receta}
                          style={[
                            styles.itemContainer,
                            receta.seleccionado && styles.itemContainerSelected,
                          ]}
                          onPress={() => toggleReceta(receta.ID_Receta)}
                        >
                          <View style={styles.checkbox}>
                            {receta.seleccionado && (
                              <MaterialIcons name="check" size={20} color={theme.colors.primary} />
                            )}
                          </View>
                          <View style={styles.itemContent}>
                            <Text style={styles.itemTitulo}>{receta.Nombre_Especialista}</Text>
                            <Text style={styles.itemTexto}>ID: {receta.ID_Receta}</Text>
                            <Text style={styles.itemTexto}>DNI Paciente: {receta.DNI_Paciente}</Text>
                            <Text style={styles.itemTexto}>
                              Fecha: {new Date(receta.Fecha).toLocaleDateString()}
                            </Text>
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
                          recetas.filter(r => r.seleccionado).length === 0 && styles.buttonDisabled,
                        ]}
                        onPress={seleccionarRecetasParaEliminar}
                        disabled={recetas.filter(r => r.seleccionado).length === 0}
                      >
                        <MaterialIcons name="delete" size={20} color={theme.colors.textSecondary} />
                        <Text style={styles.buttonText}>
                          Eliminar seleccionadas ({recetas.filter(r => r.seleccionado).length})
                        </Text>
                      </Pressable>

                      <Pressable
                        style={[styles.button, styles.buttonCancel]}
                        onPress={() => setTipoEliminar(null)}
                      >
                        <Text style={styles.buttonText}>Atrás</Text>
                      </Pressable>
                    </View>
                  </>
                )}
              </>
            )}

            {/* PASO 2: CONFIRMACIÓN */}
            {paso === 'confirmacion' && recetasAEliminar.length > 0 && (
              <>
                <View style={styles.advertenciaContainer}>
                  <MaterialIcons name="warning" size={32} color="#FF6B6B" />
                  <Text style={styles.advertenciaTitulo}>Advertencia</Text>
                  <Text style={styles.advertenciaTexto}>
                    Estás a punto de eliminar {recetasAEliminar.length} receta(s). Esta acción no se puede deshacer.
                  </Text>
                </View>

                <View style={styles.listaConfirmacion}>
                  <Text style={styles.subtitleSmall}>Recetas a eliminar:</Text>
                  {recetasAEliminar.map((receta) => (
                    <View key={receta.ID_Receta} style={styles.itemConfirmacion}>
                      <Text style={styles.itemConfirmacionTitulo}>{receta.Nombre_Especialista}</Text>
                      <Text style={styles.itemConfirmacionTexto}>ID: {receta.ID_Receta}</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.botonesContainer}>
                  <Pressable
                    style={[styles.button, styles.buttonDelete, loading && styles.buttonDisabled]}
                    onPress={confirmarEliminacionRecetas}
                    disabled={loading}
                  >
                    <MaterialIcons name="delete-forever" size={20} color={theme.colors.textSecondary} />
                    <Text style={styles.buttonText}>
                      {loading ? 'Eliminando...' : 'Confirmar eliminación'}
                    </Text>
                  </Pressable>

                  <Pressable
                    style={[styles.button, styles.buttonSecondary]}
                    onPress={cancelarEliminacionRecetas}
                    disabled={loading}
                  >
                    <Text style={styles.buttonText}>Cancelar</Text>
                  </Pressable>
                </View>
              </>
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

export default EliminarPacienteReceta;