import React, { useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView, Alert } from "react-native";
import { router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { styles } from "@/styles/InsertarMedicamentosStyle";
import theme from "@/theme/Theme";
import { medicamentosService } from "@/services/supabase";
import { Medicamento } from "@/types";

function InsertarMedicamento() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Estados para formulario
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

  // ============ FUNCIONES MEDICAMENTO ============

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

  const insertarMedicamento = async () => {
    setLoading(true);
    setError('');

    try {
      const validacionError = validarFormularioMedicamento();
      if (validacionError) {
        setError(validacionError);
        setLoading(false);
        return;
      }

      const medicamento: Omit<Medicamento, 'ID_Medicamento'> & { ID_Medicamento: string } = {
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

      // Aquí iría la lógica de inserción en Supabase
      // await medicamentosService.crearMedicamento(medicamento);

      Alert.alert('Éxito', 'Medicamento insertado correctamente');
      limpiarFormulario();
    } catch (err: any) {
      setError(err.message || 'Error al insertar medicamento');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const limpiarFormulario = () => {
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
        <Text style={styles.title}>Insertar Medicamento</Text>

        <View style={styles.formContainer}>
          {error && <Text style={styles.errorText}>{error}</Text>}

          {/* ID Medicamento */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>ID de Medicamento:</Text>
            <TextInput
              style={styles.input}
              placeholder="MED001"
              value={medicamentoForm.ID_Medicamento}
              onChangeText={(v) => handleMedicamentoChange('ID_Medicamento', v)}
              placeholderTextColor="#999"
              editable={!loading}
            />
          </View>

          {/* Nombre */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nombre del Medicamento:</Text>
            <TextInput
              style={styles.input}
              placeholder="Paracetamol"
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
              placeholder="Tachipirina"
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
              placeholder="5.99"
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
              placeholder="100"
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
              placeholder="Analgésico y antipirético..."
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

          {/* Resumen antes de guardar */}
          {medicamentoForm.Nombre && (
            <View style={styles.resumenContainer}>
              <Text style={styles.resumenTitulo}>Resumen del Medicamento:</Text>
              <View style={styles.resumenContent}>
                <View style={styles.resumenFila}>
                  <Text style={styles.resumenLabel}>Nombre:</Text>
                  <Text style={styles.resumenValor}>{medicamentoForm.Nombre}</Text>
                </View>
                <View style={styles.resumenFila}>
                  <Text style={styles.resumenLabel}>Marca:</Text>
                  <Text style={styles.resumenValor}>{medicamentoForm.Marca}</Text>
                </View>
                <View style={styles.resumenFila}>
                  <Text style={styles.resumenLabel}>Precio:</Text>
                  <Text style={styles.resumenValor}>€{medicamentoForm.Precio}</Text>
                </View>
                <View style={styles.resumenFila}>
                  <Text style={styles.resumenLabel}>Familia:</Text>
                  <Text style={styles.resumenValor}>{medicamentoForm.Familia}</Text>
                </View>
                <View style={styles.resumenFila}>
                  <Text style={styles.resumenLabel}>Stock:</Text>
                  <Text style={styles.resumenValor}>{medicamentoForm.Stock} u.</Text>
                </View>
              </View>
            </View>
          )}

          {/* Botones */}
          <View style={styles.botonesContainer}>
            <Pressable
              style={[styles.button, styles.buttonInsert, loading && styles.buttonDisabled]}
              onPress={insertarMedicamento}
              disabled={loading}
            >
              <MaterialIcons name="save" size={20} color={theme.colors.textSecondary} />
              <Text style={styles.buttonText}>
                {loading ? 'Guardando...' : 'Guardar Medicamento'}
              </Text>
            </Pressable>

            <Pressable
              style={[styles.button, styles.buttonSecondary]}
              onPress={limpiarFormulario}
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
      </View>
    </ScrollView>
  );
}

export default InsertarMedicamento;