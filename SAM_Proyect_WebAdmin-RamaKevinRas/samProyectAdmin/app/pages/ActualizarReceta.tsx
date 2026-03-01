import React, { useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView } from "react-native";
import { router } from "expo-router";
import { styles } from "../../styles/ActualizarRecetaStyle";

function ActualizarReceta() {
  const [encontrado, setEncontrado] = useState(false);

  // ❌ AQUÍ VA LA LÓGICA DE BÚSQUEDA Y ACTUALIZACIÓN

  const volver = () => {
    router.back();
  };

  return (
    <ScrollView style={styles.outerScroll} contentContainerStyle={styles.outerScrollContent}>
      <View style={styles.container}>
        <Text style={styles.title}>Actualizar Receta</Text>

        <View style={styles.formContainer}>
          {!encontrado ? (
            <>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Buscar por ID de Receta:</Text>
                <TextInput style={styles.input} placeholder="REC001" />
              </View>

              <Pressable style={[styles.button, styles.buttonSearch]}>
                <Text style={styles.buttonText}>Buscar</Text>
              </Pressable>
            </>
          ) : (
            <>
              {/* ❌ AQUÍ VA LA LÓGICA PARA CARGAR DATOS EN LOS CAMPOS */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>ID de Receta:</Text>
                <TextInput style={[styles.input, styles.inputReadonly]} value="REC001" editable={false} />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>DNI del Paciente:</Text>
                <TextInput style={styles.input} placeholder="12345678A" />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Nombre del Especialista:</Text>
                <TextInput style={styles.input} placeholder="Dr. García" />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Afecciones:</Text>
                <TextInput 
                  style={[styles.input, styles.textArea]} 
                  placeholder="Dolor de cabeza, alergias..." 
                  multiline
                  numberOfLines={3}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Dirección del Centro:</Text>
                <TextInput style={styles.input} placeholder="Calle Principal 123" />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Fecha (YYYY-MM-DD):</Text>
                <TextInput style={styles.input} placeholder="2024-01-15" />
              </View>

              <Pressable style={[styles.button, styles.buttonUpdate]}>
                <Text style={styles.buttonText}>Guardar cambios</Text>
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

export default ActualizarReceta;