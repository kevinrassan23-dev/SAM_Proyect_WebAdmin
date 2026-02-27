import React, { useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView } from "react-native";
import { router } from "expo-router";
import { styles } from "../../styles/ActualizarMedicamentoStyle";

function ActualizarMedicamento() {
  const [encontrado, setEncontrado] = useState(false);

  // ❌ AQUÍ VA LA LÓGICA DE BÚSQUEDA Y ACTUALIZACIÓN

  const volver = () => {
    router.back();
  };

  return (
    <ScrollView style={styles.outerScroll} contentContainerStyle={styles.outerScrollContent}>
      <View style={styles.container}>
        <Text style={styles.title}>Actualizar Medicamento</Text>

        <View style={styles.formContainer}>
          {!encontrado ? (
            <>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Buscar por ID, Nombre o Marca:</Text>
                <TextInput style={styles.input} placeholder="MED001 o Paracetamol" />
              </View>

              <Pressable style={[styles.button, styles.buttonSearch]}>
                <Text style={styles.buttonText}>Buscar</Text>
              </Pressable>
            </>
          ) : (
            <>
              {/* ❌ AQUÍ VA LA LÓGICA PARA CARGAR DATOS EN LOS CAMPOS */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>ID de Medicamento:</Text>
                <TextInput style={[styles.input, styles.inputReadonly]} value="MED001" editable={false} />
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

export default ActualizarMedicamento;