import React, { useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView } from "react-native";
import { router } from "expo-router";
import { styles } from "../../styles/InsertarMedicamentoStyle";

function InsertarMedicamento() {
  // ❌ AQUÍ VA LA LÓGICA DE INSERCIÓN

  const volver = () => {
    router.back();
  };

  return (
    <ScrollView style={styles.outerScroll} contentContainerStyle={styles.outerScrollContent}>
      <View style={styles.container}>
        <Text style={styles.title}>Insertar Medicamento</Text>

        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>ID de Medicamento:</Text>
            <TextInput style={styles.input} placeholder="MED001" />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nombre:</Text>
            <TextInput style={styles.input} placeholder="Paracetamol" />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Marca:</Text>
            <TextInput style={styles.input} placeholder="Tachipirina" />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Precio (€):</Text>
            <TextInput style={styles.input} placeholder="5.99" keyboardType="decimal-pad" />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Familia:</Text>
            <TextInput style={styles.input} placeholder="Analgésicos" />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tipo:</Text>
            <TextInput style={styles.input} placeholder="sin_receta" />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Stock (unidades):</Text>
            <TextInput style={styles.input} placeholder="100" keyboardType="numeric" />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Descripción (opcional):</Text>
            <TextInput 
              style={[styles.input, styles.textArea]} 
              placeholder="Analgésico y antipirético..." 
              multiline
              numberOfLines={3}
            />
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

export default InsertarMedicamento;