import React, { useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView } from "react-native";
import { router } from "expo-router";
import { styles } from "../../styles/BuscarRecetaStyle";

function BuscarReceta() {
  const [resultados, setResultados] = useState(false);

  // ❌ AQUÍ VA LA LÓGICA DE BÚSQUEDA

  const volver = () => {
    router.back();
  };

  return (
    <ScrollView style={styles.outerScroll} contentContainerStyle={styles.outerScrollContent}>
      <View style={styles.container}>
        <Text style={styles.title}>Buscar Receta</Text>

        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Buscar por ID, DNI o Especialista (opcional):</Text>
            <TextInput style={styles.input} placeholder="Ej: REC001 o 12345678A" />
          </View>

          <View style={styles.filtroFechas}>
            <Text style={styles.label}>Filtro de Fechas:</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.labelSecundario}>Fecha Inicio (YYYY-MM-DD):</Text>
              <TextInput style={styles.input} placeholder="2024-01-01" />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.labelSecundario}>Fecha Fin (YYYY-MM-DD):</Text>
              <TextInput style={styles.input} placeholder="2024-12-31" />
            </View>
          </View>

          <Pressable style={[styles.button, styles.buttonSearch]}>
            <Text style={styles.buttonText}>Buscar</Text>
          </Pressable>

          {/* ❌ AQUÍ VA LA LÓGICA PARA MOSTRAR RESULTADOS */}
          {resultados && (
            <View style={styles.resultadosContainer}>
              <Text style={styles.subtitle}>Resultados</Text>
              <View style={styles.tarjeta}>
                <Text style={styles.tarjetaTitulo}>Receta: REC001</Text>
                <Text style={styles.tarjetaTexto}>DNI Paciente: 12345678A</Text>
                <Text style={styles.tarjetaTexto}>Especialista: Dr. García</Text>
                <Text style={styles.tarjetaTexto}>Afecciones: Dolor de cabeza</Text>
                <Text style={styles.tarjetaTexto}>Centro: Calle Principal 123</Text>
                <Text style={styles.tarjetaTexto}>Fecha: 15/01/2024</Text>
              </View>
            </View>
          )}

          <View style={styles.botonesContainer}>
            <Pressable style={[styles.button, styles.buttonSecondary]}>
              <Text style={styles.buttonText}>Limpiar</Text>
            </Pressable>

            <Pressable style={[styles.button, styles.buttonCancel]} onPress={volver}>
              <Text style={styles.buttonText}>Volver</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

export default BuscarReceta;