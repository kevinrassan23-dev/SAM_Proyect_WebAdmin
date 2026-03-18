import React, { useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView, Alert } from "react-native";
import { router } from "expo-router";
import { styles } from "../../styles/EliminarMedicamentoStyle";
import { medicamentosAdminService } from "../../services/api/medicamentosAdmin";
import { Medicamento } from "@/types";

//Logica implemntada

function EliminarMedicamento() {
  const [busqueda, setBusqueda] = useState("");
  const [medicamento, setMedicamento] = useState<Medicamento | null>(null);
  const [confirmacion, setConfirmacion] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleBuscar = async () => {
    if (!busqueda.trim()) {
      Alert.alert("Error", "Introduce un ID, nombre o marca para buscar.");
      return;
    }
    try {
      setLoading(true);
      const todos = await medicamentosAdminService.obtenerTodosMedicamentos() as Medicamento[];
      const encontrado = todos.find(m =>
        m.ID_Medicamento.toLowerCase() === busqueda.toLowerCase() ||
        m.Nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        m.Marca.toLowerCase().includes(busqueda.toLowerCase())
      );

      if (!encontrado) {
        Alert.alert("Sin resultados", "No se encontró ningún medicamento con ese criterio.");
        return;
      }
      setMedicamento(encontrado);
    } catch (error) {
      Alert.alert("Error", "No se pudo realizar la búsqueda.");
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async () => {
    if (!medicamento) return;
    try {
      setLoading(true);
      await medicamentosAdminService.eliminarMedicamento(medicamento.ID_Medicamento);
      Alert.alert("Éxito", "Medicamento eliminado correctamente.", [
        { text: "OK", onPress: () => router.back() }
      ]);
    } catch (error) {
      Alert.alert("Error", "No se pudo eliminar el medicamento.");
    } finally {
      setLoading(false);
    }
  };

  const volver = () => router.back();

  return (
    <ScrollView style={styles.outerScroll} contentContainerStyle={styles.outerScrollContent}>
      <View style={styles.container}>
        <Text style={styles.title}>Eliminar Medicamento</Text>

        <View style={styles.formContainer}>
          {!confirmacion ? (
            <>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Buscar por ID, Nombre o Marca:</Text>
                <TextInput style={styles.input} placeholder="MED001 o Paracetamol" value={busqueda} onChangeText={setBusqueda} />
              </View>

              <Pressable style={[styles.button, styles.buttonSearch]} onPress={handleBuscar} disabled={loading}>
                <Text style={styles.buttonText}>{loading ? "Buscando..." : "Buscar"}</Text>
              </Pressable>

              {medicamento && (
                <>
                  <View style={styles.tarjeta}>
                    <View style={styles.tarjetaHeader}>
                      <View>
                        <Text style={styles.tarjetaTitulo}>{medicamento.Nombre}</Text>
                        <Text style={styles.tarjetaMarca}>{medicamento.Marca}</Text>
                      </View>
                      <View style={styles.tipoBadge}>
                        <Text style={styles.tipoTexto}>{medicamento.Tipo === "sin_receta" ? "Libre" : "Receta"}</Text>
                      </View>
                    </View>
                    <Text style={styles.tarjetaTexto}>ID: {medicamento.ID_Medicamento}</Text>
                    <Text style={styles.tarjetaTexto}>Familia: {medicamento.Familia}</Text>
                    <Text style={styles.tarjetaTexto}>Precio: €{medicamento.Precio.toFixed(2)}</Text>
                    <Text style={styles.tarjetaTexto}>Stock: {medicamento.Stock} unidades</Text>
                  </View>

                  <Pressable style={[styles.button, styles.buttonDelete]} onPress={() => setConfirmacion(true)}>
                    <Text style={styles.buttonText}>Confirmar Eliminación</Text>
                  </Pressable>
                </>
              )}
            </>
          ) : (
            <>
              <View style={styles.advertenciaContainer}>
                <Text style={styles.advertencia}>
                  ¿Estás seguro de que quieres eliminar "{medicamento?.Nombre}"? Esta acción no se puede deshacer.
                </Text>
              </View>

              <Pressable style={[styles.button, styles.buttonDelete]} onPress={handleEliminar} disabled={loading}>
                <Text style={styles.buttonText}>{loading ? "Eliminando..." : "Eliminar Definitivamente"}</Text>
              </Pressable>

              <Pressable style={[styles.button, styles.buttonCancel]} onPress={() => setConfirmacion(false)}>
                <Text style={styles.buttonText}>Cancelar</Text>
              </Pressable>
            </>
          )}

          <View style={styles.botonesContainer}>
            <Pressable style={[styles.button,]} onPress={volver}>
              <Text style={styles.buttonText}>Volver</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

export default EliminarMedicamento;