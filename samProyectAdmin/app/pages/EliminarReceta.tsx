import React, { useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView } from "react-native";
import { router } from "expo-router";
import { styles } from "../../styles/EliminarRecetaStyle";

function EliminarReceta() {
  const [confirmacion, setConfirmacion] = useState(false);

  // ❌ AQUÍ VA LA LÓGICA DE BÚSQUEDA Y ELIMINACIÓN

  const volver = () => {
    router.back();
  };

  return (
    <ScrollView style={styles.outerScroll} contentContainerStyle={styles.outerScrollContent}>
      <View style={styles.container}>
        <Text style={styles.title}>Eliminar Receta</Text>

        <View style={styles.formContainer}>
          {!confirmacion ? (
            <>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Buscar por ID de Receta:</Text>
                <TextInput style={styles.input} placeholder="REC001" />
              </View>

              <Pressable style={[styles.button, styles.buttonSearch]}>
                <Text style={styles.buttonText}>Buscar</Text>
              </Pressable>

              {/* ❌ AQUÍ VA LA LÓGICA PARA MOSTRAR LA RECETA A ELIMINAR */}
              <View style={styles.tarjeta}>
                <Text style={styles.tarjetaTitulo}>Receta: REC001</Text>
                <Text style={styles.tarjetaTexto}>DNI Paciente: 12345678A</Text>
                <Text style={styles.tarjetaTexto}>Especialista: Dr. García</Text>
                <Text style={styles.tarjetaTexto}>Fecha: 15/01/2024</Text>
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

export default EliminarReceta;