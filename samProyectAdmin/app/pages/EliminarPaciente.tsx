import React, { useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView } from "react-native";
import { router } from "expo-router";
import { styles } from "../../styles/EliminarPacienteStyle";

function EliminarPaciente() {
  const [confirmacion, setConfirmacion] = useState(false);

  // ❌ AQUÍ VA LA LÓGICA DE BÚSQUEDA Y ELIMINACIÓN

  const volver = () => {
    router.back();
  };

  return (
    <ScrollView style={styles.outerScroll} contentContainerStyle={styles.outerScrollContent}>
      <View style={styles.container}>
        <Text style={styles.title}>Eliminar Paciente</Text>

        <View style={styles.formContainer}>
          {!confirmacion ? (
            <>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Buscar por DNI o Cartilla:</Text>
                <TextInput style={styles.input} placeholder="12345678A" />
              </View>

              <Pressable style={[styles.button, styles.buttonSearch]}>
                <Text style={styles.buttonText}>Buscar</Text>
              </Pressable>

              {/* ❌ AQUÍ VA LA LÓGICA PARA MOSTRAR EL PACIENTE A ELIMINAR */}
              <View style={styles.tarjeta}>
                <Text style={styles.tarjetaTitulo}>Juan García</Text>
                <Text style={styles.tarjetaTexto}>DNI: 12345678A</Text>
                <Text style={styles.tarjetaTexto}>Cartilla: 123456</Text>
              </View>

              <Pressable style={[styles.button, styles.buttonDelete]}>
                <Text style={styles.buttonText}>Confirmar Eliminación</Text>
              </Pressable>
            </>
          ) : (
            <>
              <View style={styles.advertenciaContainer}>
                <Text style={styles.advertencia}>¿Estás seguro? Esta acción no se puede deshacer.</Text>
              </View>

              <Pressable style={[styles.button, styles.buttonDelete]}>
                <Text style={styles.buttonText}>Eliminar Definitivamente</Text>
              </Pressable>
            </>
          )}

          <View style={styles.botonesContainer}>
            <Pressable style={[styles.button, styles.buttonCancel]} onPress={volver}>
              <Text style={styles.buttonText}>Volver</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

export default EliminarPaciente;