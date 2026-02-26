import React, { useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView, Alert } from "react-native";
import { router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { styles } from "@/styles/ActualizarMedicamentosStyle";
import theme from "@/theme/Theme";
import { medicamentosService } from "@/services/supabase";
import { Medicamento } from "@/types";

function ActualizarMedicamento() {
  // Estado para elegir si buscar o actualizar
  const [paso, setPaso] = useState<'busqueda' | 'edicion'>('busqueda');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Estados para búsqueda
  const [busquedaTermino, setBusquedaTermino] = useState('');
  const [medicamentoEncontrado, setMedicamentoEncontrado] = useState<Medicamento | null>(null);

  // Estados para formulario de edición
  const [medicamentoForm, setMedicamentoForm] = useState({
    ID_Medicamento: '',
    Nombre: '',
    Marca: '',
    Precio: '',
    Descripcion: '',
    Familia: '',
    Tipo: 'sin_receta' as 'con_receta' | 'sin_receta',
    Stock: '',
    Activo: true,
  });

  // ============ FUNCIONES BÚSQUEDA ============

  const buscarMedicamento = async () => {
    setLoading(true);
    setError('');

    try {
      if (busquedaTermino.trim() === '') {
        setError('Ingresa un ID, nombre o marca del medicamento');
        setLoading(false);
        return;
      }

      // Obtener todos y filtrar
      const todos = await medicamentosService.obtenerTodos();
      const encontrado = todos.find(m =>
        m.ID_Medicamento.includes(busquedaTermino) ||
        m.Nombre.toLowerCase().includes(busquedaTermino.toLowerCase()) ||
        m.Marca.toLowerCase().includes(busquedaTermino.toLowerCase())
      );

      if (encontrado) {
        setMedicamentoEncontrado(encontrado);
        cargarDatosMedicamentoEnFormulario(encontrado);
        setPaso('edicion');
      } else {
        setError('Medicamento no encontrado');
        setMedicamentoEncontrado(null);
      }
    } catch (err: any) {
      setError(err.message || 'Error al buscar medicamento');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const cargarDatosMedicamentoEnFormulario = (medicamento: Medicamento) => {
    setMedicamentoForm({
      ID_Medicamento: medicamento.ID_Medicamento,
      Nombre: medicamento.Nombre,
      Marca: medicamento.Marca,
      Precio: medicamento.Precio.toString(),
      Descripcion: medicamento.Descripcion,
      Familia: medicamento.Familia,
      Tipo: medicamento.Tipo,
      Stock: medicamento.Stock.toString(),
      Activo: medicamento.Activo,
    });
  };

  // ============ FUNCIONES EDICIÓN ============

  const handleMedicamentoChange = (field: keyof typeof medicamentoForm, value: any) => {
    setMedicamentoForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validarFormularioMedicamento = () => {
    const { ID_Medicamento, Nombre, Marca, Precio, Familia, Stock } = medicamentoForm;
    
    if (!ID_Medicamento.trim()) return 'ID de Medicamento es requerido';
    if (!Nombre.trim()) return 'Nombre es requerido';
    if (!Marca.trim()) return 'Marca es requerida';
    if (!Precio.trim()) return 'Precio es requerido';
    if (isNaN(Number(Precio))) return 'Precio debe ser un número';
    if (!Familia.trim()) return 'Familia es requerida';
    if (!Stock.trim()) return 'Stock es requerido';
    if (isNaN(Number(Stock))) return 'Stock debe ser un número';
    
    return null;
  };

  const actualizarMedicamento = async () => {
    setLoading(true);
    setError('');

    try {
      const validacionError = validarFormularioMedicamento();
      if (validacionError) {
        setError(validacionError);
        setLoading(false);
        return;
      }

      const medicamentoActualizado: Medicamento = {
        ID_Medicamento: medicamentoForm.ID_Medicamento,
        Nombre: medicamentoForm.Nombre,
        Marca: medicamentoForm.Marca,
        Precio: Number(medicamentoForm.Precio),
        Descripcion: medicamentoForm.Descripcion,
        Familia: medicamentoForm.Familia,
        Tipo: medicamentoForm.Tipo,
        Stock: Number(medicamentoForm.Stock),
        Activo: medicamentoForm.Activo,
      };

      // Aquí iría la lógica de actualización en Supabase
      // await medicamentosService.actualizarMedicamento(medicamentoActualizado.ID_Medicamento, medicamentoActualizado);

      Alert.alert('Éxito', 'Medicamento actualizado correctamente');
      limpiarBusqueda();
      setPaso('busqueda');
    } catch (err: any) {
      setError(err.message || 'Error al actualizar medicamento');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const deshacerCambios = () => {
    if (medicamentoEncontrado) {
      cargarDatosMedicamentoEnFormulario(medicamentoEncontrado);
      setError('');
    }
  };

  const limpiarBusqueda = () => {
    setBusquedaTermino('');
    setMedicamentoEncontrado(null);
    setMedicamentoForm({
      ID_Medicamento: '',
      Nombre: '',
      Marca: '',
      Precio: '',
      Descripcion: '',
      Familia: '',
      Tipo: 'sin_receta',
      Stock: '',
      Activo: true,
    });
    setError('');
  };

  const volver = () => {
    router.back();
  };

  // Familias de medicamentos comunes
  const familias = [
    'Analgésicos',
    'Antibióticos',
    'Antiinflamatorios',
    'Antihistamínicos',
    'Antidepresivos',
    'Antihipertensivos',
    'Antiácidos',
    'Vitaminas',
    'Antitusivos',
    'Descongestionantes',
    'Otros',
  ];

  return (
    <ScrollView style={styles.outerScroll} contentContainerStyle={styles.outerScrollContent}>
      <View style={styles.container}>
        <Text style={styles.title}>Actualizar Medicamento</Text>

        <View style={styles.formContainer}>
          <Text style={styles.subtitle}>
            {paso === 'busqueda' ? 'Buscar Medicamento' : 'Editar Medicamento'}
          </Text>

          {error && <Text style={styles.errorText}>{error}</Text>}

          {/* PASO 1: BÚSQUEDA */}
          {paso === 'busqueda' && (
            <>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Buscar por ID, Nombre o Marca:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ej: MED001 o Paracetamol"
                  value={busquedaTermino}
                  onChangeText={setBusquedaTermino}
                  placeholderTextColor="#999"
                  editable={!loading}
                />
              </View>

              <Pressable
                style={[styles.button, styles.buttonSearch, loading && styles.buttonDisabled]}
                onPress={buscarMedicamento}
                disabled={loading}
              >
                <MaterialIcons name="search" size={20} color={theme.colors.textSecondary} />
                <Text style={styles.buttonText}>
                  {loading ? 'Buscando...' : 'Buscar'}
                </Text>
              </Pressable>

              {medicamentoEncontrado && (
                <View style={styles.encontradoInfo}>
                  <MaterialIcons name="check-circle" size={24} color="#4CAF50" />
                  <Text style={styles.encontradoTitulo}>Medicamento encontrado:</Text>
                  <Text style={styles.encontradoTexto}>{medicamentoEncontrado.Nombre}</Text>
                  <Text style={styles.encontradoTextoSecundario}>
                    {medicamentoEncontrado.Marca} - €{medicamentoEncontrado.Precio.toFixed(2)}
                  </Text>
                </View>
              )}

              <Pressable
                style={[styles.button, styles.buttonCancel]}
                onPress={() => router.back()}
              >
                <Text style={styles.buttonText}>Atrás</Text>
              </Pressable>
            </>
          )}

          {/* PASO 2: EDICIÓN */}
          {paso === 'edicion' && medicamentoEncontrado && (
            <>
              {/* ID Medicamento (readonly) */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>ID de Medicamento:</Text>
                <TextInput
                  style={[styles.input, styles.inputReadonly]}
                  value={medicamentoForm.ID_Medicamento}
                  editable={false}
                />
              </View>

              {/* Nombre */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Nombre del Medicamento:</Text>
                <TextInput
                  style={styles.input}
                  value={medicamentoForm.Nombre}
                  onChangeText={(v) => handleMedicamentoChange('Nombre', v)}
                  placeholderTextColor="#999"
                  editable={!loading}
                />
              </View>

              {/* Marca */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Marca:</Text>
                <TextInput
                  style={styles.input}
                  value={medicamentoForm.Marca}
                  onChangeText={(v) => handleMedicamentoChange('Marca', v)}
                  placeholderTextColor="#999"
                  editable={!loading}
                />
              </View>

              {/* Precio */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Precio (€):</Text>
                <TextInput
                  style={styles.input}
                  value={medicamentoForm.Precio}
                  onChangeText={(v) => handleMedicamentoChange('Precio', v)}
                  placeholderTextColor="#999"
                  keyboardType="decimal-pad"
                  editable={!loading}
                />
              </View>

              {/* Familia */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Familia de Medicamento:</Text>
                <View style={styles.familiaSelector}>
                  <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    style={styles.familiaScroll}
                  >
                    {familias.map((familia) => (
                      <Pressable
                        key={familia}
                        style={[
                          styles.familiaButton,
                          medicamentoForm.Familia === familia && styles.familiaButtonActive,
                        ]}
                        onPress={() => handleMedicamentoChange('Familia', familia)}
                      >
                        <Text
                          style={[
                            styles.familiaButtonText,
                            medicamentoForm.Familia === familia && styles.familiaButtonTextActive,
                          ]}
                        >
                          {familia}
                        </Text>
                      </Pressable>
                    ))}
                  </ScrollView>
                </View>
              </View>

              {/* Tipo de Medicamento */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Tipo de Medicamento:</Text>
                <View style={styles.tipoSelector}>
                  {['sin_receta', 'con_receta'].map((tipo) => (
                    <Pressable
                      key={tipo}
                      style={[
                        styles.tipoButton,
                        medicamentoForm.Tipo === tipo && styles.tipoButtonActive,
                      ]}
                      onPress={() => handleMedicamentoChange('Tipo', tipo)}
                    >
                      <MaterialIcons 
                        name={tipo === 'sin_receta' ? 'done' : 'assignment'} 
                        size={16} 
                        color={medicamentoForm.Tipo === tipo ? '#fff' : theme.colors.secondary}
                      />
                      <Text
                        style={[
                          styles.tipoButtonText,
                          medicamentoForm.Tipo === tipo && styles.tipoButtonTextActive,
                        ]}
                      >
                        {tipo === 'sin_receta' ? 'Sin Receta' : 'Con Receta'}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              {/* Stock */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Stock (unidades):</Text>
                <TextInput
                  style={styles.input}
                  value={medicamentoForm.Stock}
                  onChangeText={(v) => handleMedicamentoChange('Stock', v)}
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                  editable={!loading}
                />
              </View>

              {/* Descripción */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Descripción (opcional):</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={medicamentoForm.Descripcion}
                  onChangeText={(v) => handleMedicamentoChange('Descripcion', v)}
                  placeholderTextColor="#999"
                  multiline
                  numberOfLines={3}
                  editable={!loading}
                />
              </View>

              {/* Activo */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Estado:</Text>
                <View style={styles.toggleContainer}>
                  <Pressable
                    style={[
                      styles.toggleButton,
                      medicamentoForm.Activo && styles.toggleButtonActive,
                    ]}
                    onPress={() => handleMedicamentoChange('Activo', true)}
                  >
                    <MaterialIcons 
                      name="check-circle" 
                      size={18} 
                      color={medicamentoForm.Activo ? '#fff' : theme.colors.secondary}
                    />
                    <Text
                      style={[
                        styles.toggleText,
                        medicamentoForm.Activo && styles.toggleTextActive,
                      ]}
                    >
                      Activo
                    </Text>
                  </Pressable>
                  <Pressable
                    style={[
                      styles.toggleButton,
                      !medicamentoForm.Activo && styles.toggleButtonActive,
                    ]}
                    onPress={() => handleMedicamentoChange('Activo', false)}
                  >
                    <MaterialIcons 
                      name="cancel" 
                      size={18} 
                      color={!medicamentoForm.Activo ? '#fff' : theme.colors.secondary}
                    />
                    <Text
                      style={[
                        styles.toggleText,
                        !medicamentoForm.Activo && styles.toggleTextActive,
                      ]}
                    >
                      Inactivo
                    </Text>
                  </Pressable>
                </View>
              </View>

              {/* Cambios vs Original */}
              <View style={styles.cambiosContainer}>
                <Text style={styles.cambiosTitulo}>Cambios realizados:</Text>
                <View style={styles.cambiosContent}>
                  {medicamentoForm.Nombre !== medicamentoEncontrado.Nombre && (
                    <View style={styles.cambioFila}>
                      <Text style={styles.cambioLabel}>Nombre:</Text>
                      <Text style={styles.cambioValorAnterior}>{medicamentoEncontrado.Nombre}</Text>
                      <MaterialIcons name="arrow-forward" size={16} color="#999" />
                      <Text style={styles.cambioValorNuevo}>{medicamentoForm.Nombre}</Text>
                    </View>
                  )}
                  {medicamentoForm.Precio !== medicamentoEncontrado.Precio.toString() && (
                    <View style={styles.cambioFila}>
                      <Text style={styles.cambioLabel}>Precio:</Text>
                      <Text style={styles.cambioValorAnterior}>€{medicamentoEncontrado.Precio.toFixed(2)}</Text>
                      <MaterialIcons name="arrow-forward" size={16} color="#999" />
                      <Text style={styles.cambioValorNuevo}>€{medicamentoForm.Precio}</Text>
                    </View>
                  )}
                  {medicamentoForm.Stock !== medicamentoEncontrado.Stock.toString() && (
                    <View style={styles.cambioFila}>
                      <Text style={styles.cambioLabel}>Stock:</Text>
                      <Text style={styles.cambioValorAnterior}>{medicamentoEncontrado.Stock}</Text>
                      <MaterialIcons name="arrow-forward" size={16} color="#999" />
                      <Text style={styles.cambioValorNuevo}>{medicamentoForm.Stock}</Text>
                    </View>
                  )}
                  {medicamentoForm.Activo !== medicamentoEncontrado.Activo && (
                    <View style={styles.cambioFila}>
                      <Text style={styles.cambioLabel}>Estado:</Text>
                      <Text style={styles.cambioValorAnterior}>
                        {medicamentoEncontrado.Activo ? 'Activo' : 'Inactivo'}
                      </Text>
                      <MaterialIcons name="arrow-forward" size={16} color="#999" />
                      <Text style={styles.cambioValorNuevo}>
                        {medicamentoForm.Activo ? 'Activo' : 'Inactivo'}
                      </Text>
                    </View>
                  )}
                </View>
              </View>

              {/* Botones */}
              <View style={styles.botonesContainer}>
                <Pressable
                  style={[styles.button, styles.buttonUpdate, loading && styles.buttonDisabled]}
                  onPress={actualizarMedicamento}
                  disabled={loading}
                >
                  <MaterialIcons name="save" size={20} color={theme.colors.textSecondary} />
                  <Text style={styles.buttonText}>
                    {loading ? 'Guardando...' : 'Guardar cambios'}
                  </Text>
                </Pressable>

                <Pressable
                  style={[styles.button, styles.buttonSecondary]}
                  onPress={deshacerCambios}
                >
                  <MaterialIcons name="restart-alt" size={20} color={theme.colors.textSecondary} />
                  <Text style={styles.buttonText}>Deshacer cambios</Text>
                </Pressable>

                <Pressable
                  style={[styles.button, styles.buttonCancel]}
                  onPress={() => {
                    limpiarBusqueda();
                    setPaso('busqueda');
                  }}
                >
                  <Text style={styles.buttonText}>Atrás</Text>
                </Pressable>
              </View>
            </>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

export default ActualizarMedicamento;