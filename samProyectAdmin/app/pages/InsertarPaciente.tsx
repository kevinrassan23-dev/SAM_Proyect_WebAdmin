import React, { useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView } from "react-native";
import { router } from "expo-router";
import { styles } from "../../styles/InsertarPacienteStyle";

function InsertarPaciente() {
  // ❌ AQUÍ VA LA LÓGICA DE INSERCIÓN

  const volver = () => {
    router.back();
  };

  return (
    <ScrollView style={styles.outerScroll} contentContainerStyle={styles.outerScrollContent}>
      <View style={styles.container}>
        <Text style={styles.title}>Insertar Paciente</Text>

        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>DNI:</Text>
            <TextInput style={styles.input} placeholder="12345678A" />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nombre:</Text>
            <TextInput style={styles.input} placeholder="Juan García" />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Cartilla:</Text>
            <TextInput style={styles.input} placeholder="123456" />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Teléfono:</Text>
            <TextInput style={styles.input} placeholder="600123456" />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Edad:</Text>
            <TextInput style={styles.input} placeholder="45" keyboardType="numeric" />
          </View>

          <View style={styles.botonesContainer}>
            <Pressable style={[styles.button]}>
              <Text style={styles.buttonText}>GUARDAR</Text>
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

export default InsertarPaciente;