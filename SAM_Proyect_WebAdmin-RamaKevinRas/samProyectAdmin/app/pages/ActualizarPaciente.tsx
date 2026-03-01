import React, { useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView } from "react-native";
import { router } from "expo-router";
import { styles } from "../../styles/ActualizarPacienteStyle";

function ActualizarPaciente() {
  const [encontrado, setEncontrado] = useState(false);

  // ❌ AQUÍ VA LA LÓGICA DE BÚSQUEDA Y ACTUALIZACIÓN

  const volver = () => {
    router.push("/pages/DashboardPacientes");
  };

  return (
    <ScrollView style={styles.outerScroll} contentContainerStyle={styles.outerScrollContent}>
      <View style={styles.container}>
        <Text style={styles.title}>Actualizar Paciente</Text>

        <View style={styles.formContainer}>
          {!encontrado ? (
            <>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Buscar por DNI o Cartilla:</Text>
                <TextInput style={styles.input} placeholder="12345678A" />
              </View>

              <Pressable style={[styles.button]}>
                <Text style={styles.buttonText}>BUSCAR REGISTRO</Text>
              </Pressable>
            </>
          ) : (
            <>
              {/* ❌ AQUÍ VA LA LÓGICA PARA CARGAR DATOS EN LOS CAMPOS */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Nombre:</Text>
                <TextInput style={styles.input} placeholder="Juan García" />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Teléfono:</Text>
                <TextInput style={styles.input} placeholder="600123456" />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Edad:</Text>
                <TextInput style={styles.input} placeholder="45" keyboardType="numeric" />
              </View>

              <Pressable style={[styles.button]}>
                <Text style={styles.buttonText}>ACTUALIZAR REGISTRO</Text>
              </Pressable>

              <Pressable style={[styles.button]} onPress={volver}>
                <Text style={styles.buttonText}>LIMPIAR CAMPOS</Text>
              </Pressable>
            </>
          )}

          <View style={styles.botonesContainer}>
            <Pressable style={[styles.buttonCancel]} onPress={volver}>
              <Text style={styles.buttonText}>VOLVER</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

export default ActualizarPaciente;