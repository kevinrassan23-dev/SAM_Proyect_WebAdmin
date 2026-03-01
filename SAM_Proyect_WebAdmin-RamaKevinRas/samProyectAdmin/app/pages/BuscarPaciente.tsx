import React, { useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView } from "react-native";
import { router } from "expo-router";
import { styles } from "../../styles/BuscarPacienteStyle";

function BuscarPaciente() {
  const [resultados, setResultados] = useState(false);

  // ❌ AQUÍ VA LA LÓGICA DE BÚSQUEDA

  const volver = () => {
    router.push("/pages/DashboardPacientes");
  };

  return (
    <ScrollView style={styles.outerScroll} contentContainerStyle={styles.outerScrollContent}>
      <View style={styles.container}>
        <Text style={styles.title}>Buscar Paciente</Text>

        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>DNI o Cartilla:</Text>
            <TextInput style={styles.input} placeholder="12345678A o 123456" />
          </View>

          {/* ❌ AQUÍ VA LA LÓGICA PARA MOSTRAR RESULTADOS */}
          {resultados && (
            <View style={styles.resultadosContainer}>
              <Text style={styles.subtitle}>Resultados</Text>
              <View style={styles.tarjeta}>
                <Text style={styles.tarjetaTitulo}>Juan García</Text>
                <Text style={styles.tarjetaTexto}>DNI: 12345678A</Text>
                <Text style={styles.tarjetaTexto}>Cartilla: 123456</Text>
                <Text style={styles.tarjetaTexto}>Teléfono: 600123456</Text>
                <Text style={styles.tarjetaTexto}>Edad: 45</Text>
              </View>
            </View>
          )}

          <View style={styles.botonesContainer}>

            <Pressable style={[styles.button]}>
              <Text style={styles.buttonText}>BUSCAR</Text>
            </Pressable>

            {/*POR AHORA LE AÑADO LA FUNCION VOLVER - (CAMBIAR PARA LIMPIAR CAMPOS)*/}
            <Pressable style={[styles.button]} onPress={volver}>
              <Text style={styles.buttonText}>LIMPIAR CAMPOS</Text>
            </Pressable>

            <Pressable style={[styles.buttonCancel]} onPress={volver}>
              <Text style={styles.buttonText}>VOLVER</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

export default BuscarPaciente;