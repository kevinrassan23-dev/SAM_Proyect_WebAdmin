import React, { useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView } from "react-native";
import { router } from "expo-router";
import { styles } from "../../styles/EliminarMedicamentoStyle";

function EliminarMedicamento() {
  const [confirmacion, setConfirmacion] = useState(false);

  // ❌ AQUÍ VA LA LÓGICA DE BÚSQUEDA Y ELIMINACIÓN

  const volver = () => {
    router.back();
  };

  return (
    <ScrollView style={styles.outerScroll} contentContainerStyle={styles.outerScrollContent}>
      <View style={styles.container}>
        <Text style={styles.title}>Eliminar Medicamento</Text>

        <View style={styles.formContainer}>
          {!confirmacion ? (
            <>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Buscar por ID, Nombre o Marca:</Text>
                <TextInput style={styles.input} placeholder="MED001 o Paracetamol" />
              </View>

              <Pressable style={[styles.button, styles.buttonSearch]}>
                <Text style={styles.buttonText}>Buscar</Text>
              </Pressable>

              {/* ❌ AQUÍ VA LA LÓGICA PARA MOSTRAR EL MEDICAMENTO A ELIMINAR */}
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

export default EliminarMedicamento;