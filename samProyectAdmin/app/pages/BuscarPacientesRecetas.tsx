import React, { useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView } from "react-native";
import { router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { styles } from "@/styles/BuscarPacientesRecetasStyle";
import theme from "@/theme/Theme";
import { pacientesService, recetasService } from "@/services/firebase";
import { Paciente, Receta } from "@/types";

function PacienteRecetaBusqueda() {
  // Estados de búsqueda
  const [busquedaActiva, setBusquedaActiva] = useState<'pacientes' | 'recetas' | null>(null);
  const [termino, setTermino] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');

  // Estados de datos
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [recetas, setRecetas] = useState<Receta[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Buscar pacientes
  const buscarPacientes = async () => {
    setLoading(true);
    setError('');
    try {
      if (termino.trim() === '') {
        setError('Ingresa un DNI o número de cartilla');
        setLoading(false);
        return;
      }

      let resultado: Paciente | null = null;

      // Buscar por DNI o Num_Cartilla
      if (termino.includes('-')) {
        resultado = await pacientesService.obtenerPorDNI(termino);
      } else {
        resultado = await pacientesService.obtenerPorCartilla(termino);
      }

      if (resultado) {
        setPacientes([resultado]);
      } else {
        setError('Paciente no encontrado');
        setPacientes([]);
      }
    } catch (err: any) {
      setError(err.message || 'Error al buscar paciente');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Buscar recetas
  const buscarRecetas = async () => {
    setLoading(true);
    setError('');
    try {
      let todasLasRecetas = await recetasService.obtenerTodas();

      // Filtrar por término si existe
      if (termino.trim()) {
        todasLasRecetas = todasLasRecetas.filter(r =>
          r.DNI_Paciente.includes(termino) ||
          r.Nombre_Especialista.toLowerCase().includes(termino.toLowerCase())
        );
      }

      // Filtrar por fechas si existen
      if (fechaInicio || fechaFin) {
        todasLasRecetas = todasLasRecetas.filter(r => {
          const fechaReceta = new Date(r.Fecha);
          
          if (fechaInicio) {
            const inicio = new Date(fechaInicio);
            if (fechaReceta < inicio) return false;
          }
          
          if (fechaFin) {
            const fin = new Date(fechaFin);
            if (fechaReceta > fin) return false;
          }
          
          return true;
        });
      }

      if (todasLasRecetas.length > 0) {
        setRecetas(todasLasRecetas);
      } else {
        setError('No se encontraron recetas');
        setRecetas([]);
      }
    } catch (err: any) {
      setError(err.message || 'Error al buscar recetas');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Limpiar búsqueda
  const limpiarBusqueda = () => {
    setTermino('');
    setFechaInicio('');
    setFechaFin('');
    setPacientes([]);
    setRecetas([]);
    setError('');
  };

  // Volver
  const volver = () => {
    router.back();
  };

  return (
    <ScrollView style={styles.outerScroll} contentContainerStyle={styles.outerScrollContent}>
      <View style={styles.container}>
        <Text style={styles.title}>Búsqueda de datos oficiales</Text>

        {/* BOTONES DE SELECCIÓN */}
        {busquedaActiva === null && (
          <View style={styles.vista}>
            <Pressable
              style={[styles.button, styles.buttonPrimary]}
              onPress={() => {
                setBusquedaActiva('pacientes');
                limpiarBusqueda();
              }}
            >
              <MaterialIcons name="person" size={20} color={theme.colors.textSecondary} />
              <Text style={styles.buttonText}>Buscar Pacientes</Text>
            </Pressable>

            <Pressable
              style={[styles.button, styles.buttonSecondary]}
              onPress={() => {
                setBusquedaActiva('recetas');
                limpiarBusqueda();
              }}
            >
              <MaterialIcons name="description" size={20} color={theme.colors.textSecondary} />
              <Text style={styles.buttonText}>Buscar Recetas</Text>
            </Pressable>

            <Pressable
              style={[styles.button, styles.buttonCancel]}
              onPress={volver}
            >
              <Text style={styles.buttonText}>Volver</Text>
            </Pressable>
          </View>
        )}

        {/* BÚSQUEDA DE PACIENTES */}
        {busquedaActiva === 'pacientes' && (
          <View style={styles.formContainer}>
            <Text style={styles.subtitle}>Buscar Paciente</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>DNI o Número de Cartilla:</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej: 12345678A o 123456"
                value={termino}
                onChangeText={setTermino}
                placeholderTextColor="#999"
                editable={!loading}
              />
            </View>

            {error && <Text style={styles.errorText}>{error}</Text>}

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

            {/* RESULTADOS */}
            {pacientes.length > 0 && (
              <View style={styles.resultadosContainer}>
                <Text style={styles.subtitle}>Resultados</Text>
                {pacientes.map((paciente) => (
                  <View key={paciente.DNI} style={styles.tarjeta}>
                    <Text style={styles.tarjetaTitulo}>{paciente.Nombre_Paciente}</Text>
                    <Text style={styles.tarjetaTexto}>DNI: {paciente.DNI}</Text>
                    <Text style={styles.tarjetaTexto}>Cartilla: {paciente.Num_Cartilla}</Text>
                    <Text style={styles.tarjetaTexto}>Teléfono: {paciente.Num_Telefono}</Text>
                    <Text style={styles.tarjetaTexto}>Edad: {paciente.Edad_Paciente}</Text>
                    <Text style={styles.tarjetaTexto}>Tipo: {paciente.Tipo_Paciente}</Text>
                    <Text style={[styles.tarjetaTexto, paciente.Activo && { color: '#4CAF50' }]}>
                      Estado: {paciente.Activo ? 'Activo' : 'Inactivo'}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            <View style={styles.botonesAccion}>
              <Pressable
                style={[styles.button, styles.buttonSecondary]}
                onPress={limpiarBusqueda}
              >
                <Text style={styles.buttonText}>Nueva Búsqueda</Text>
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

        {/* BÚSQUEDA DE RECETAS */}
        {busquedaActiva === 'recetas' && (
          <View style={styles.formContainer}>
            <Text style={styles.subtitle}>Buscar Recetas</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Buscar por DNI o Especialista (opcional):</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej: 12345678A o Dr. García"
                value={termino}
                onChangeText={setTermino}
                placeholderTextColor="#999"
                editable={!loading}
              />
            </View>

            <View style={styles.filtroFechas}>
              <Text style={styles.label}>Filtro de Fechas:</Text>
              
              <View style={styles.inputGroup}>
                <Text style={styles.labelSecundario}>Fecha Inicio (YYYY-MM-DD):</Text>
                <TextInput
                  style={styles.input}
                  placeholder="2024-01-01"
                  value={fechaInicio}
                  onChangeText={setFechaInicio}
                  placeholderTextColor="#999"
                  editable={!loading}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.labelSecundario}>Fecha Fin (YYYY-MM-DD):</Text>
                <TextInput
                  style={styles.input}
                  placeholder="2024-12-31"
                  value={fechaFin}
                  onChangeText={setFechaFin}
                  placeholderTextColor="#999"
                  editable={!loading}
                />
              </View>
            </View>

            {error && <Text style={styles.errorText}>{error}</Text>}

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

            {/* RESULTADOS */}
            {recetas.length > 0 && (
              <View style={styles.resultadosContainer}>
                <Text style={styles.subtitle}>Resultados ({recetas.length})</Text>
                {recetas.map((receta) => (
                  <View key={receta.ID_Receta} style={styles.tarjeta}>
                    <Text style={styles.tarjetaTitulo}>Receta: {receta.ID_Receta}</Text>
                    <Text style={styles.tarjetaTexto}>DNI Paciente: {receta.DNI_Paciente}</Text>
                    <Text style={styles.tarjetaTexto}>Especialista: {receta.Nombre_Especialista}</Text>
                    <Text style={styles.tarjetaTexto}>Afecciones: {receta.Afecciones}</Text>
                    <Text style={styles.tarjetaTexto}>Centro: {receta.Direccion_Centro}</Text>
                    <Text style={styles.tarjetaTexto}>
                      Fecha: {new Date(receta.Fecha).toLocaleDateString()}
                    </Text>
                    <Text style={[styles.tarjetaTexto, receta.Activa && { color: '#4CAF50' }]}>
                      Estado: {receta.Activa ? 'Activa' : 'Inactiva'}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            <View style={styles.botonesAccion}>
              <Pressable
                style={[styles.button, styles.buttonSecondary]}
                onPress={limpiarBusqueda}
              >
                <Text style={styles.buttonText}>Nueva Búsqueda</Text>
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

export default PacienteRecetaBusqueda;