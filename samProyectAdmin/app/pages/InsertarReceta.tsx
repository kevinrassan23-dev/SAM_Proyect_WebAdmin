import React, { useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView } from "react-native";
import { router } from "expo-router";
import { styles } from "../../styles/InsertarRecetaStyle";

function InsertarReceta() {
  // ❌ AQUÍ VA LA LÓGICA DE INSERCIÓN

  const volver = () => {
    router.back();
  };

  return (
    <ScrollView style={styles.outerScroll} contentContainerStyle={styles.outerScrollContent}>
      <View style={styles.container}>
        <Text style={styles.title}>Insertar Receta</Text>

        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>ID de Receta:</Text>
            <TextInput style={styles.input} placeholder="REC001" />
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
            <TextInput style={styles.input} placeholder="Calle Principal 123, Madrid" />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Fecha (YYYY-MM-DD):</Text>
            <TextInput style={styles.input} placeholder="2024-01-15" />
          </View>

          <View style={styles.botonesContainer}>
            <Pressable style={[styles.button, styles.buttonInsert]}>
              <Text style={styles.buttonText}>Guardar</Text>
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

export default InsertarReceta;