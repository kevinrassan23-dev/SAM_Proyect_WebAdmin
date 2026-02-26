import React, { useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView, Alert } from "react-native";
import { router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { styles } from "@/styles/InsertarPacientesRecetasStyle";
import theme from "@/theme/Theme";
import { pacientesService, recetasService } from "@/services/firebase";
import { Paciente, Receta } from "@/types";

function InsertarPacientesRecetas() {
  // Estado para elegir qué insertar
  const [tipoInsert, setTipoInsert] = useState<'pacientes' | 'recetas' | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Estados para PACIENTES
  const [pacienteForm, setPacienteForm] = useState({
    DNI: '',
    Num_Cartilla: '',
    Num_Telefono: '',
    Nombre_Paciente: '',
    Edad_Paciente: '',
    Tipo_Paciente: 'activo' as 'activo' | 'pensionista' | 'mutualista',
    Activo: true,
  });

  // Estados para RECETAS
  const [recetaForm, setRecetaForm] = useState({
    ID_Receta: '',
    DNI_Paciente: '',
    Nombre_Especialista: '',
    Afecciones: '',
    Direccion_Centro: '',
    Fecha: '',
    Activa: true,
  });

  // ============ FUNCIONES PACIENTES ============

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

  const insertarPaciente = async () => {
    setLoading(true);
    setError('');

    try {
      const validacionError = validarFormularioPaciente();
      if (validacionError) {
        setError(validacionError);
        setLoading(false);
        return;
      }

      // Crear documento en Firebase con DNI como ID
      const paciente: Paciente = {
        DNI: pacienteForm.DNI,
        Num_Cartilla: pacienteForm.Num_Cartilla,
        Num_Telefono: pacienteForm.Num_Telefono,
        Nombre_Paciente: pacienteForm.Nombre_Paciente,
        Edad_Paciente: Number(pacienteForm.Edad_Paciente),
        Tipo_Paciente: pacienteForm.Tipo_Paciente,
        Activo: pacienteForm.Activo,
      };

      // Aquí iría la lógica de inserción en Firebase
      // await pacientesService.crearPaciente(paciente);

      Alert.alert('Éxito', 'Paciente insertado correctamente');
      limpiarFormularioPaciente();
    } catch (err: any) {
      setError(err.message || 'Error al insertar paciente');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const limpiarFormularioPaciente = () => {
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

  // ============ FUNCIONES RECETAS ============

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
    
    // Validar formato de fecha (YYYY-MM-DD)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(Fecha)) {
      return 'Fecha debe estar en formato YYYY-MM-DD';
    }
    
    return null;
  };

  const insertarReceta = async () => {
    setLoading(true);
    setError('');

    try {
      const validacionError = validarFormularioReceta();
      if (validacionError) {
        setError(validacionError);
        setLoading(false);
        return;
      }

      // Crear documento en Firebase
      const receta: Receta = {
        ID_Receta: recetaForm.ID_Receta,
        DNI_Paciente: recetaForm.DNI_Paciente,
        Nombre_Especialista: recetaForm.Nombre_Especialista,
        Afecciones: recetaForm.Afecciones,
        Direccion_Centro: recetaForm.Direccion_Centro,
        Fecha: new Date(recetaForm.Fecha),
        Activa: recetaForm.Activa,
      };

      // Aquí iría la lógica de inserción en Firebase
      // await recetasService.crearReceta(receta);

      Alert.alert('Éxito', 'Receta insertada correctamente');
      limpiarFormularioReceta();
    } catch (err: any) {
      setError(err.message || 'Error al insertar receta');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const limpiarFormularioReceta = () => {
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
        <Text style={styles.title}>Insertar Datos</Text>

        {/* SELECCIÓN INICIAL */}
        {tipoInsert === null && (
          <View style={styles.vista}>
            <Pressable
              style={[styles.button, styles.buttonInsert]}
              onPress={() => {
                setTipoInsert('pacientes');
                limpiarFormularioPaciente();
              }}
            >
              <MaterialIcons name="person-add" size={20} color={theme.colors.textSecondary} />
              <Text style={styles.buttonText}>Insertar Paciente</Text>
            </Pressable>

            <Pressable
              style={[styles.button, styles.buttonInsert]}
              onPress={() => {
                setTipoInsert('recetas');
                limpiarFormularioReceta();
              }}
            >
              <MaterialIcons name="add-circle" size={20} color={theme.colors.textSecondary} />
              <Text style={styles.buttonText}>Insertar Receta</Text>
            </Pressable>

            <Pressable
              style={[styles.button, styles.buttonCancel]}
              onPress={volver}
            >
              <Text style={styles.buttonText}>Volver</Text>
            </Pressable>
          </View>
        )}

        {/* FORMULARIO PACIENTES */}
        {tipoInsert === 'pacientes' && (
          <View style={styles.formContainer}>
            <Text style={styles.subtitle}>Nuevo Paciente</Text>

            {error && <Text style={styles.errorText}>{error}</Text>}

            {/* DNI */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>DNI:</Text>
              <TextInput
                style={styles.input}
                placeholder="12345678A"
                value={pacienteForm.DNI}
                onChangeText={(v) => handlePacienteChange('DNI', v)}
                placeholderTextColor="#999"
                editable={!loading}
              />
            </View>

            {/* Número de Cartilla */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Número de Cartilla:</Text>
              <TextInput
                style={styles.input}
                placeholder="123456"
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
                placeholder="600123456"
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
                placeholder="Juan García"
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
                placeholder="45"
                value={pacienteForm.Edad_Paciente}
                onChangeText={(v) => handlePacienteChange('Edad_Paciente', v)}
                placeholderTextColor="#999"
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

            {/* Botones */}
            <View style={styles.botonesContainer}>
              <Pressable
                style={[styles.button, styles.buttonInsert, loading && styles.buttonDisabled]}
                onPress={insertarPaciente}
                disabled={loading}
              >
                <MaterialIcons name="save" size={20} color={theme.colors.textSecondary} />
                <Text style={styles.buttonText}>
                  {loading ? 'Guardando...' : 'Guardar'}
                </Text>
              </Pressable>

              <Pressable
                style={[styles.button, styles.buttonSecondary]}
                onPress={limpiarFormularioPaciente}
              >
                <MaterialIcons name="clear" size={20} color={theme.colors.textSecondary} />
                <Text style={styles.buttonText}>Limpiar</Text>
              </Pressable>

              <Pressable
                style={[styles.button, styles.buttonCancel]}
                onPress={() => setTipoInsert(null)}
              >
                <Text style={styles.buttonText}>Atrás</Text>
              </Pressable>
            </View>
          </View>
        )}

        {/* FORMULARIO RECETAS */}
        {tipoInsert === 'recetas' && (
          <View style={styles.formContainer}>
            <Text style={styles.subtitle}>Nueva Receta</Text>

            {error && <Text style={styles.errorText}>{error}</Text>}

            {/* ID Receta */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>ID de Receta:</Text>
              <TextInput
                style={styles.input}
                placeholder="REC001"
                value={recetaForm.ID_Receta}
                onChangeText={(v) => handleRecetaChange('ID_Receta', v)}
                placeholderTextColor="#999"
                editable={!loading}
              />
            </View>

            {/* DNI Paciente */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>DNI del Paciente:</Text>
              <TextInput
                style={styles.input}
                placeholder="12345678A"
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
                placeholder="Dr. García"
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
                placeholder="Dolor de cabeza, alergias..."
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
                placeholder="Calle Principal 123, Madrid"
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
                placeholder="2024-01-15"
                value={recetaForm.Fecha}
                onChangeText={(v) => handleRecetaChange('Fecha', v)}
                placeholderTextColor="#999"
                editable={!loading}
              />
            </View>

            {/* Botones */}
            <View style={styles.botonesContainer}>
              <Pressable
                style={[styles.button, styles.buttonInsert, loading && styles.buttonDisabled]}
                onPress={insertarReceta}
                disabled={loading}
              >
                <MaterialIcons name="save" size={20} color={theme.colors.textSecondary} />
                <Text style={styles.buttonText}>
                  {loading ? 'Guardando...' : 'Guardar'}
                </Text>
              </Pressable>

              <Pressable
                style={[styles.button, styles.buttonSecondary]}
                onPress={limpiarFormularioReceta}
              >
                <MaterialIcons name="clear" size={20} color={theme.colors.textSecondary} />
                <Text style={styles.buttonText}>Limpiar</Text>
              </Pressable>

              <Pressable
                style={[styles.button, styles.buttonCancel]}
                onPress={() => setTipoInsert(null)}
              >
                <Text style={styles.buttonText}>Atrás</Text>
              </Pressable>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

export default InsertarPacientesRecetas;