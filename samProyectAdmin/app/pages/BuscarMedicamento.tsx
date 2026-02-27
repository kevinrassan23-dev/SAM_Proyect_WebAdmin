import React, { useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView } from "react-native";
import { router } from "expo-router";
import { styles } from "../../styles/BuscarMedicamentoStyle";

function BuscarMedicamento() {
  const [resultados, setResultados] = useState(false);

  // ❌ AQUÍ VA LA LÓGICA DE BÚSQUEDA

  const volver = () => {
    router.back();
  };

  return (
    <ScrollView style={styles.outerScroll} contentContainerStyle={styles.outerScrollContent}>
      <View style={styles.container}>
        <Text style={styles.title}>Buscar Medicamento</Text>

        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Buscar por ID, Nombre o Marca (opcional):</Text>
            <TextInput style={styles.input} placeholder="Ej: MED001 o Paracetamol" />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Filtro por Familia (opcional):</Text>
            <TextInput style={styles.input} placeholder="Ej: Analgésicos, Antibióticos" />
          </View>

          <Pressable style={[styles.button, styles.buttonSearch]}>
            <Text style={styles.buttonText}>Buscar</Text>
          </Pressable>

          {/* ❌ AQUÍ VA LA LÓGICA PARA MOSTRAR RESULTADOS */}
          {resultados && (
            <View style={styles.resultadosContainer}>
              <Text style={styles.subtitle}>Resultados</Text>
              <View style={styles.tarjeta}>
                <View style={styles.tarjetaHeader}>
                  <View>
                    <Text style={styles.tarjetaTitulo}>Paracetamol</Text>
                    <Text style={styles.tarjetaMarca}>Tachipirina</Text>
                  </View>
                  <View style={styles.tipoBadge}>
                    <Text style={styles.tipoTexto}>Libre</Text>
                  </View>
                </View>
                <Text style={styles.tarjetaTexto}>ID: MED001</Text>
                <Text style={styles.tarjetaTexto}>Familia: Analgésicos</Text>
                <Text style={styles.tarjetaTexto}>Precio: €5.99</Text>
                <Text style={styles.tarjetaTexto}>Stock: 100 unidades</Text>
                <Text style={[styles.tarjetaTexto, { color: '#4CAF50' }]}>✓ Disponible</Text>
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

export default BuscarMedicamento;