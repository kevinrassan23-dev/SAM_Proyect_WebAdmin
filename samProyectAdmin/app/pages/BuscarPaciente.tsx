import React, { useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView, Alert, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { styles } from "../../styles/BuscarPacienteStyle";
import { pacientesService } from "@/services/firebase";
import { Paciente } from "@/types";

function BuscarPaciente() {
  const [termino, setTermino] = useState("");
  const [pacientesEncontrados, setPacientesEncontrados] = useState<Paciente[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [buscoRealizado, setBuscoRealizado] = useState(false);

  // ✅ LÓGICA DE BÚSQUEDA
  const handleBuscar = async () => {
    setLoading(true);
    setError("");
    setPacientesEncontrados([]);
    setBuscoRealizado(true);

    try {
      if (termino.trim() === "") {
        setError("Ingresa un DNI o número de cartilla");
        setLoading(false);
        return;
      }

      console.log("🔍 Buscando:", termino);

      // Obtener todos los pacientes
      const todosPacientes = await pacientesService.obtenerTodos();
      
      if (todosPacientes.length === 0) {
        setError("No hay pacientes registrados");
        setLoading(false);
        return;
      }

      const terminoSeguro = (termino ?? "").trim();
      const terminoUpper = terminoSeguro.toUpperCase();

      const resultados = todosPacientes.filter(paciente => {
        const dni = (paciente?.DNI ?? "").toString().toUpperCase();
        const cartilla = (paciente?.Num_Cartilla ?? "").toString();

        return (
          dni.includes(terminoUpper) ||
          cartilla.includes(terminoSeguro)
        );
      });

      if (resultados.length > 0) {
        console.log("✅ Pacientes encontrados:", resultados.length);
        setPacientesEncontrados(resultados);
        setError("");
      } else {
        console.log("❌ No se encontraron pacientes");
        setError("No se encontraron pacientes que coincidan con la búsqueda");
        setPacientesEncontrados([]);
      }
    } catch (err: any) {
      console.error("❌ Error:", err);
      setError(err.message || "Error al buscar pacientes");
      setPacientesEncontrados([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ LIMPIAR CAMPOS
  const limpiarCampos = () => {
    setTermino("");
    setPacientesEncontrados([]);
    setError("");
    setBuscoRealizado(false);
  };

  const volver = () => {
    router.push("/pages/DashboardPacientes");
  };

  return (
    <ScrollView style={styles.outerScroll} contentContainerStyle={styles.outerScrollContent}>
      <View style={styles.container}>
        <Text style={styles.title}>Buscar Paciente</Text>

        <View style={styles.formContainer}>
          {/* Campo de búsqueda */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>DNI o Nº Cartilla:</Text>
            <TextInput 
              style={styles.input} 
              placeholder="Ej: 12345678A o 123456"
              placeholderTextColor="#999"
              value={termino}
              onChangeText={setTermino}
              editable={!loading}
              autoCapitalize="characters"
            />
          </View>

          {/* Mostrar error si existe */}
          {error && (
            <View style={{ backgroundColor: "#FFE6E6", padding: 12, borderRadius: 6, marginBottom: 16 }}>
              <Text style={{ color: "#FF6B6B", fontWeight: "bold" }}>⚠️ {error}</Text>
            </View>
          )}

          {/* Mostrar loading */}
          {loading && (
            <View style={{ alignItems: 'center', marginVertical: 20 }}>
              <ActivityIndicator size="large" color="#2196F3" />
              <Text style={{ marginTop: 10, color: '#666' }}>Buscando pacientes...</Text>
            </View>
          )}

          {/* ✅ MOSTRAR RESULTADOS */}
          {!loading && buscoRealizado && pacientesEncontrados.length > 0 && (
            <View style={styles.resultadosContainer}>
              <Text style={styles.subtitle}>
                Resultados ({pacientesEncontrados.length})
              </Text>
              
              {pacientesEncontrados.map((paciente, index) => (
                <View key={index} style={styles.tarjeta}>
                  <Text style={styles.tarjetaTitulo}>{paciente.Nombre_Paciente}</Text>
                  <Text style={styles.tarjetaTexto}>
                    <Text style={{ fontWeight: 'bold' }}>DNI:</Text> {paciente.DNI}
                  </Text>
                  <Text style={styles.tarjetaTexto}>
                    <Text style={{ fontWeight: 'bold' }}>Cartilla:</Text> {paciente.Num_Cartilla}
                  </Text>
                  <Text style={styles.tarjetaTexto}>
                    <Text style={{ fontWeight: 'bold' }}>Teléfono:</Text> {paciente.Num_Telefono}
                  </Text>
                  <Text style={styles.tarjetaTexto}>
                    <Text style={{ fontWeight: 'bold' }}>Edad:</Text> {paciente.Edad_Paciente} años
                  </Text>
                  <Text style={styles.tarjetaTexto}>
                  <Text style={{ fontWeight: 'bold' }}>Régimen:</Text>{" "}
                  {(() => {
                    const tipo = paciente?.Tipo_Paciente ?? "";
                    return tipo
                      ? tipo.charAt(0).toUpperCase() + tipo.slice(1)
                      : "No definido";
                  })()}
                </Text>
                  <Text style={[
                    styles.tarjetaTexto,
                    { 
                      color: paciente.Activo ? '#4CAF50' : '#F44336',
                      fontWeight: 'bold'
                    }
                  ]}>
                    Estado: {paciente.Activo ? '✓ Activo' : '✗ Inactivo'}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Mensaje si no hay resultados pero se realizó búsqueda */}
          {!loading && buscoRealizado && pacientesEncontrados.length === 0 && !error && (
            <View style={{ 
              backgroundColor: "#E3F2FD", 
              padding: 16, 
              borderRadius: 8, 
              marginVertical: 16,
              alignItems: 'center'
            }}>
              <Text style={{ color: "#1976D2", textAlign: 'center' }}>
                No se encontraron pacientes que coincidan con "{termino}"
              </Text>
            </View>
          )}

          {/* Botones de acción */}
          <View style={styles.botonesContainer}>
            <Pressable 
              style={[styles.button, styles.buttonInsert, loading && { opacity: 0.5 }]}
              onPress={handleBuscar}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? "BUSCANDO..." : "BUSCAR"}
              </Text>
            </Pressable>

            <Pressable 
              style={[styles.button, { backgroundColor: '#FF9800' }]} 
              onPress={limpiarCampos}
              disabled={loading}
            >
              <Text style={styles.buttonText}>LIMPIAR CAMPOS</Text>
            </Pressable>

            <Pressable 
              style={[styles.button]} 
              onPress={volver}
              disabled={loading}
            >
              <Text style={styles.buttonText}>VOLVER</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

export default BuscarPaciente;