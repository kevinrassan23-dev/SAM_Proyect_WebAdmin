import React, { useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView, Alert } from "react-native";
import { router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { styles } from "@/styles/ActualizarPacientesRecetasStyle";
import theme from "@/theme/Theme";
import { pacientesService, recetasService } from "@/services/firebase";
import { Paciente, Receta } from "@/types";

function ActualizarPacienteReceta() {
  // Estado para elegir qué actualizar
  const [tipoActualizar, setTipoActualizar] = useState<'pacientes' | 'recetas' | null>(null);
  const [paso, setPaso] = useState<'busqueda' | 'edicion'>('busqueda');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Estados para búsqueda PACIENTES
  const [busquedaPaciente, setBusquedaPaciente] = useState('');
  const [pacienteEncontrado, setPacienteEncontrado] = useState<Paciente | null>(null);

  // Estados para edición PACIENTES
  const [pacienteForm, setPacienteForm] = useState({
    DNI: '',
    Num_Cartilla: '',
    Num_Telefono: '',
    Nombre_Paciente: '',
    Edad_Paciente: '',
    Tipo_Paciente: 'activo' as 'activo' | 'pensionista' | 'mutualista',
    Activo: true,
  });

  // Estados para búsqueda RECETAS
  const [busquedaReceta, setBusquedaReceta] = useState('');
  const [recetaEncontrada, setRecetaEncontrada] = useState<Receta | null>(null);

  // Estados para edición RECETAS
  const [recetaForm, setRecetaForm] = useState({
    ID_Receta: '',
    DNI_Paciente: '',
    Nombre_Especialista: '',
    Afecciones: '',
    Direccion_Centro: '',
    Fecha: '',
    Activa: true,
  });

  // ============ FUNCIONES BÚSQUEDA PACIENTES ============

  const buscarPaciente = async () => {
    setLoading(true);
    setError('');

    try {
      if (busquedaPaciente.trim() === '') {
          setError('Ingresa un DNI o número de cartilla');
          setLoading(false);
        return;
      }

      let paciente: Paciente | null = null;

      if (busquedaPaciente.includes('-')) {
          paciente = await pacientesService.obtenerPorDNI(busquedaPaciente);
      } else {
          paciente = await pacientesService.obtenerPorCartilla(busquedaPaciente);
      }

      if (paciente) {
        setPacienteEncontrado(paciente);
        cargarDatosPacienteEnFormulario(paciente);
        setPaso('edicion');
      } else {
        setError('Paciente no encontrado');
        setPacienteEncontrado(null);
      }
    } catch (err: any) {
      setError(err.message || 'Error al buscar paciente');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const cargarDatosPacienteEnFormulario = (paciente: Paciente) => {
    setPacienteForm({
      DNI: paciente.DNI,
      Num_Cartilla: paciente.Num_Cartilla,
      Num_Telefono: paciente.Num_Telefono,
      Nombre_Paciente: paciente.Nombre_Paciente,
      Edad_Paciente: paciente.Edad_Paciente.toString(),
      Tipo_Paciente: paciente.Tipo_Paciente,
      Activo: paciente.Activo,
    });
  };

  const handlePacienteChange = (field: keyof typeof pacienteForm, value: any) => {
    setPacienteForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validarFormularioPaciente = () => {
    const { DNI, Num_Cartilla, Nombre_Paciente, Edad_Paciente } = pacienteForm;
    
    if (!DNI.trim()) return 'DNI es requerido';
    if (!Num_Cartilla.trim()) return 'Número de cartilla es requerido';
    if (!Nombre_Paciente.trim()) return 'Nombre es requerido';
    if (!Edad_Paciente.trim()) return 'Edad es requerida';
    if (isNaN(Number(Edad_Paciente))) return 'Edad debe ser un número';
    
    return null;
  };

  const actualizarPaciente = async () => {
    setLoading(true);
    setError('');

    try {
      const validacionError = validarFormularioPaciente();
      if (validacionError) {
        setError(validacionError);
        setLoading(false);
        return;
      }

      const pacienteActualizado: Paciente = {
        DNI: pacienteForm.DNI,
        Num_Cartilla: pacienteForm.Num_Cartilla,
        Num_Telefono: pacienteForm.Num_Telefono,
        Nombre_Paciente: pacienteForm.Nombre_Paciente,
        Edad_Paciente: Number(pacienteForm.Edad_Paciente),
        Tipo_Paciente: pacienteForm.Tipo_Paciente,
        Activo: pacienteForm.Activo,
      };

      // Aquí iría la lógica de actualización en Firebase
      // await pacientesService.actualizarPaciente(pacienteActualizado);

      Alert.alert('Éxito', 'Paciente actualizado correctamente');
      limpiarBusquedaPaciente();
      setPaso('busqueda');
    } catch (err: any) {
      setError(err.message || 'Error al actualizar paciente');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const limpiarBusquedaPaciente = () => {
    setBusquedaPaciente('');
    setPacienteEncontrado(null);
    setPacienteForm({
      DNI: '',
      Num_Cartilla: '',
      Num_Telefono: '',
      Nombre_Paciente: '',
      Edad_Paciente: '',
      Tipo_Paciente: 'activo',
      Activo: true,
    });
    setError('');
  };

  // ============ FUNCIONES BÚSQUEDA RECETAS ============

  const buscarReceta = async () => {
    setLoading(true);
    setError('');

    try {
      if (busquedaReceta.trim() === '') {
        setError('Ingresa un ID de receta');
        setLoading(false);
        return;
      }

      const receta = await recetasService.obtenerPorID(busquedaReceta);

      if (receta) {
        setRecetaEncontrada(receta);
        cargarDatosRecetaEnFormulario(receta);
        setPaso('edicion');
      } else {
        setError('Receta no encontrada');
        setRecetaEncontrada(null);
      }
    } catch (err: any) {
      setError(err.message || 'Error al buscar receta');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const cargarDatosRecetaEnFormulario = (receta: Receta) => {
    setRecetaForm({
      ID_Receta: receta.ID_Receta,
      DNI_Paciente: receta.DNI_Paciente,
      Nombre_Especialista: receta.Nombre_Especialista,
      Afecciones: receta.Afecciones,
      Direccion_Centro: receta.Direccion_Centro,
      Fecha: receta.Fecha instanceof Date 
        ? receta.Fecha.toISOString().split('T')[0]
        : receta.Fecha,
      Activa: receta.Activa,
    });
  };

  const handleRecetaChange = (field: keyof typeof recetaForm, value: any) => {
    setRecetaForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validarFormularioReceta = () => {
    const { ID_Receta, DNI_Paciente, Nombre_Especialista, Fecha } = recetaForm;
    
    if (!ID_Receta.trim()) return 'ID de Receta es requerido';
    if (!DNI_Paciente.trim()) return 'DNI del paciente es requerido';
    if (!Nombre_Especialista.trim()) return 'Nombre del especialista es requerido';
    if (!Fecha.trim()) return 'Fecha es requerida';
    
    if (!/^\d{4}-\d{2}-\d{2}$/.test(Fecha)) {
      return 'Fecha debe estar en formato YYYY-MM-DD';
    }
    
    return null;
  };

  const actualizarReceta = async () => {
    setLoading(true);
    setError('');

    try {
      const validacionError = validarFormularioReceta();
      if (validacionError) {
        setError(validacionError);
        setLoading(false);
        return;
      }

      const recetaActualizada: Receta = {
        ID_Receta: recetaForm.ID_Receta,
        DNI_Paciente: recetaForm.DNI_Paciente,
        Nombre_Especialista: recetaForm.Nombre_Especialista,
        Afecciones: recetaForm.Afecciones,
        Direccion_Centro: recetaForm.Direccion_Centro,
        Fecha: new Date(recetaForm.Fecha),
        Activa: recetaForm.Activa,
      };

      // Aquí iría la lógica de actualización en Firebase
      // await recetasService.actualizarReceta(recetaActualizada);

      Alert.alert('Éxito', 'Receta actualizada correctamente');
      limpiarBusquedaReceta();
      setPaso('busqueda');
    } catch (err: any) {
      setError(err.message || 'Error al actualizar receta');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const limpiarBusquedaReceta = () => {
    setBusquedaReceta('');
    setRecetaEncontrada(null);
    setRecetaForm({
      ID_Receta: '',
      DNI_Paciente: '',
      Nombre_Especialista: '',
      Afecciones: '',
      Direccion_Centro: '',
      Fecha: '',
      Activa: true,
    });
    setError('');
  };

  // ============ RENDER ============

  const volver = () => {
    router.back();
  };

  return (
    <ScrollView style={styles.outerScroll} contentContainerStyle={styles.outerScrollContent}>
      <View style={styles.container}>
        <Text style={styles.title}>Actualizar Datos</Text>

        {/* SELECCIÓN INICIAL */}
        {tipoActualizar === null && (
          <View style={styles.vista}>
            <Pressable
              style={[styles.button, styles.buttonUpdate]}
              onPress={() => {
                setTipoActualizar('pacientes');
                limpiarBusquedaPaciente();
                setPaso('busqueda');
              }}
            >
              <MaterialIcons name="person-add" size={20} color={theme.colors.textSecondary} />
              <Text style={styles.buttonText}>Actualizar Paciente</Text>
            </Pressable>

            <Pressable
              style={[styles.button, styles.buttonUpdate]}
              onPress={() => {
                setTipoActualizar('recetas');
                limpiarBusquedaReceta();
                setPaso('busqueda');
              }}
            >
              <MaterialIcons name="edit-note" size={20} color={theme.colors.textSecondary} />
              <Text style={styles.buttonText}>Actualizar Receta</Text>
            </Pressable>

            <Pressable
              style={[styles.button, styles.buttonCancel]}
              onPress={volver}
            >
              <Text style={styles.buttonText}>Volver</Text>
            </Pressable>
          </View>
        )}

        {/* BÚSQUEDA Y EDICIÓN PACIENTES */}
        {tipoActualizar === 'pacientes' && (
          <View style={styles.formContainer}>
            <Text style={styles.subtitle}>
              {paso === 'busqueda' ? 'Buscar Paciente' : 'Editar Paciente'}
            </Text>

            {error && <Text style={styles.errorText}>{error}</Text>}

            {/* PASO 1: BÚSQUEDA */}
            {paso === 'busqueda' && (
              <>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>DNI o Número de Cartilla:</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Ej: 12345678A o 123456"
                    value={busquedaPaciente}
                    onChangeText={setBusquedaPaciente}
                    placeholderTextColor="#999"
                    editable={!loading}
                  />
                </View>

                <Pressable
                  style={[styles.button, styles.buttonSearch, loading && styles.buttonDisabled]}
                  onPress={buscarPaciente}
                  disabled={loading}
                >
                  <MaterialIcons name="search" size={20} color={theme.colors.textSecondary} />
                  <Text style={styles.buttonText}>
                    {loading ? 'Buscando...' : 'Buscar'}
                  </Text>
                </Pressable>

                {pacienteEncontrado && (
                  <View style={styles.encontradoInfo}>
                    <Text style={styles.encontradoTitulo}>Paciente encontrado:</Text>
                    <Text style={styles.encontradoTexto}>{pacienteEncontrado.Nombre_Paciente}</Text>
                  </View>
                )}

                <Pressable
                  style={[styles.button, styles.buttonCancel]}
                  onPress={() => setTipoActualizar(null)}
                >
                  <Text style={styles.buttonText}>Atrás</Text>
                </Pressable>
              </>
            )}

            {/* PASO 2: EDICIÓN */}
            {paso === 'edicion' && pacienteEncontrado && (
              <>
                {/* DNI (readonly) */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>DNI:</Text>
                  <TextInput
                    style={[styles.input, styles.inputReadonly]}
                    value={pacienteForm.DNI}
                    editable={false}
                  />
                </View>

                {/* Número de Cartilla */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Número de Cartilla:</Text>
                  <TextInput
                    style={styles.input}
                    value={pacienteForm.Num_Cartilla}
                    onChangeText={(v) => handlePacienteChange('Num_Cartilla', v)}
                    placeholderTextColor="#999"
                    editable={!loading}
                  />
                </View>

                {/* Teléfono */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Número de Teléfono:</Text>
                  <TextInput
                    style={styles.input}
                    value={pacienteForm.Num_Telefono}
                    onChangeText={(v) => handlePacienteChange('Num_Telefono', v)}
                    placeholderTextColor="#999"
                    editable={!loading}
                  />
                </View>

                {/* Nombre */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Nombre:</Text>
                  <TextInput
                    style={styles.input}
                    value={pacienteForm.Nombre_Paciente}
                    onChangeText={(v) => handlePacienteChange('Nombre_Paciente', v)}
                    placeholderTextColor="#999"
                    editable={!loading}
                  />
                </View>

                {/* Edad */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Edad:</Text>
                  <TextInput
                    style={styles.input}
                    value={pacienteForm.Edad_Paciente}
                    onChangeText={(v) => handlePacienteChange('Edad_Paciente', v)}
                    keyboardType="numeric"
                    editable={!loading}
                  />
                </View>

                {/* Tipo de Paciente */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Tipo de Paciente:</Text>
                  <View style={styles.tipoSelector}>
                    {['activo', 'pensionista', 'mutualista'].map((tipo) => (
                      <Pressable
                        key={tipo}
                        style={[
                          styles.tipoButton,
                          pacienteForm.Tipo_Paciente === tipo && styles.tipoButtonActive,
                        ]}
                        onPress={() => handlePacienteChange('Tipo_Paciente', tipo)}
                      >
                        <Text
                          style={[
                            styles.tipoButtonText,
                            pacienteForm.Tipo_Paciente === tipo && styles.tipoButtonTextActive,
                          ]}
                        >
                          {tipo}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </View>

                {/* Activo */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Estado:</Text>
                  <View style={styles.toggleContainer}>
                    <Pressable
                      style={[
                        styles.toggleButton,
                        pacienteForm.Activo && styles.toggleButtonActive,
                      ]}
                      onPress={() => handlePacienteChange('Activo', true)}
                    >
                      <Text style={[
                        styles.toggleText,
                        pacienteForm.Activo && styles.toggleTextActive,
                      ]}>
                        Activo
                      </Text>
                    </Pressable>
                    <Pressable
                      style={[
                        styles.toggleButton,
                        !pacienteForm.Activo && styles.toggleButtonActive,
                      ]}
                      onPress={() => handlePacienteChange('Activo', false)}
                    >
                      <Text style={[
                        styles.toggleText,
                        !pacienteForm.Activo && styles.toggleTextActive,
                      ]}>
                        Inactivo
                      </Text>
                    </Pressable>
                  </View>
                </View>

                {/* Botones */}
                <View style={styles.botonesContainer}>
                  <Pressable
                    style={[styles.button, styles.buttonUpdate, loading && styles.buttonDisabled]}
                    onPress={actualizarPaciente}
                    disabled={loading}
                  >
                    <MaterialIcons name="save" size={20} color={theme.colors.textSecondary} />
                    <Text style={styles.buttonText}>
                      {loading ? 'Guardando...' : 'Guardar cambios'}
                    </Text>
                  </Pressable>

                  <Pressable
                    style={[styles.button, styles.buttonSecondary]}
                    onPress={() => {
                      cargarDatosPacienteEnFormulario(pacienteEncontrado);
                      setError('');
                    }}
                  >
                    <MaterialIcons name="restart-alt" size={20} color={theme.colors.textSecondary} />
                    <Text style={styles.buttonText}>Deshacer cambios</Text>
                  </Pressable>

                  <Pressable
                    style={[styles.button, styles.buttonCancel]}
                    onPress={() => {
                      limpiarBusquedaPaciente();
                      setPaso('busqueda');
                    }}
                  >
                    <Text style={styles.buttonText}>Atrás</Text>
                  </Pressable>
                </View>
              </>
            )}
          </View>
        )}

        {/* BÚSQUEDA Y EDICIÓN RECETAS */}
        {tipoActualizar === 'recetas' && (
          <View style={styles.formContainer}>
            <Text style={styles.subtitle}>
              {paso === 'busqueda' ? 'Buscar Receta' : 'Editar Receta'}
            </Text>

            {error && <Text style={styles.errorText}>{error}</Text>}

            {/* PASO 1: BÚSQUEDA */}
            {paso === 'busqueda' && (
              <>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>ID de Receta:</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Ej: REC001"
                    value={busquedaReceta}
                    onChangeText={setBusquedaReceta}
                    placeholderTextColor="#999"
                    editable={!loading}
                  />
                </View>

                <Pressable
                  style={[styles.button, styles.buttonSearch, loading && styles.buttonDisabled]}
                  onPress={buscarReceta}
                  disabled={loading}
                >
                  <MaterialIcons name="search" size={20} color={theme.colors.textSecondary} />
                  <Text style={styles.buttonText}>
                    {loading ? 'Buscando...' : 'Buscar'}
                  </Text>
                </Pressable>

                {recetaEncontrada && (
                  <View style={styles.encontradoInfo}>
                    <Text style={styles.encontradoTitulo}>Receta encontrada:</Text>
                    <Text style={styles.encontradoTexto}>{recetaEncontrada.Nombre_Especialista}</Text>
                  </View>
                )}

                <Pressable
                  style={[styles.button, styles.buttonCancel]}
                  onPress={() => setTipoActualizar(null)}
                >
                  <Text style={styles.buttonText}>Atrás</Text>
                </Pressable>
              </>
            )}

            {/* PASO 2: EDICIÓN */}
            {paso === 'edicion' && recetaEncontrada && (
              <>
                {/* ID Receta (readonly) */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>ID de Receta:</Text>
                  <TextInput
                    style={[styles.input, styles.inputReadonly]}
                    value={recetaForm.ID_Receta}
                    editable={false}
                  />
                </View>

                {/* DNI Paciente */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>DNI del Paciente:</Text>
                  <TextInput
                    style={styles.input}
                    value={recetaForm.DNI_Paciente}
                    onChangeText={(v) => handleRecetaChange('DNI_Paciente', v)}
                    placeholderTextColor="#999"
                    editable={!loading}
                  />
                </View>

                {/* Nombre Especialista */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Nombre del Especialista:</Text>
                  <TextInput
                    style={styles.input}
                    value={recetaForm.Nombre_Especialista}
                    onChangeText={(v) => handleRecetaChange('Nombre_Especialista', v)}
                    placeholderTextColor="#999"
                    editable={!loading}
                  />
                </View>

                {/* Afecciones */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Afecciones:</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    value={recetaForm.Afecciones}
                    onChangeText={(v) => handleRecetaChange('Afecciones', v)}
                    placeholderTextColor="#999"
                    multiline
                    numberOfLines={3}
                    editable={!loading}
                  />
                </View>

                {/* Dirección Centro */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Dirección del Centro:</Text>
                  <TextInput
                    style={styles.input}
                    value={recetaForm.Direccion_Centro}
                    onChangeText={(v) => handleRecetaChange('Direccion_Centro', v)}
                    placeholderTextColor="#999"
                    editable={!loading}
                  />
                </View>

                {/* Fecha */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Fecha (YYYY-MM-DD):</Text>
                  <TextInput
                    style={styles.input}
                    value={recetaForm.Fecha}
                    onChangeText={(v) => handleRecetaChange('Fecha', v)}
                    placeholderTextColor="#999"
                    editable={!loading}
                  />
                </View>

                {/* Activa */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Estado:</Text>
                  <View style={styles.toggleContainer}>
                    <Pressable
                      style={[
                        styles.toggleButton,
                        recetaForm.Activa && styles.toggleButtonActive,
                      ]}
                      onPress={() => handleRecetaChange('Activa', true)}
                    >
                      <Text style={[
                        styles.toggleText,
                        recetaForm.Activa && styles.toggleTextActive,
                      ]}>
                        Activa
                      </Text>
                    </Pressable>
                    <Pressable
                      style={[
                        styles.toggleButton,
                        !recetaForm.Activa && styles.toggleButtonActive,
                      ]}
                      onPress={() => handleRecetaChange('Activa', false)}
                    >
                      <Text style={[
                        styles.toggleText,
                        !recetaForm.Activa && styles.toggleTextActive,
                      ]}>
                        Inactiva
                      </Text>
                    </Pressable>
                  </View>
                </View>

                {/* Botones */}
                <View style={styles.botonesContainer}>
                  <Pressable
                    style={[styles.button, styles.buttonUpdate, loading && styles.buttonDisabled]}
                    onPress={actualizarReceta}
                    disabled={loading}
                  >
                    <MaterialIcons name="save" size={20} color={theme.colors.textSecondary} />
                    <Text style={styles.buttonText}>
                      {loading ? 'Guardando...' : 'Guardar cambios'}
                    </Text>
                  </Pressable>

                  <Pressable
                    style={[styles.button, styles.buttonSecondary]}
                    onPress={() => {
                      cargarDatosRecetaEnFormulario(recetaEncontrada);
                      setError('');
                    }}
                  >
                    <MaterialIcons name="restart-alt" size={20} color={theme.colors.textSecondary} />
                    <Text style={styles.buttonText}>Deshacer cambios</Text>
                  </Pressable>

                  <Pressable
                    style={[styles.button, styles.buttonCancel]}
                    onPress={() => {
                      limpiarBusquedaReceta();
                      setPaso('busqueda');
                    }}
                  >
                    <Text style={styles.buttonText}>Atrás</Text>
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

export default ActualizarPacienteReceta;