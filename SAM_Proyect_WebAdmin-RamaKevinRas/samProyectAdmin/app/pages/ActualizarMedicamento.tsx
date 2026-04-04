import React, { useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView, Alert } from "react-native";
import { router } from "expo-router";
import { styles } from "../../styles/ActualizarMedicamentoStyle";
import { medicamentosAdminService } from "../../services/api/medicamentosAdmin";
import { Medicamento } from "@/types";
import { useAuth } from "../hooks/useAuth";//añadir este import

//Logica implemntada

function ActualizarMedicamento() {
  useAuth();//Esto es lo nuevo
  const [busqueda, setBusqueda] = useState("");
  const [encontrado, setEncontrado] = useState(false);
  const [loading, setLoading] = useState(false);
  const [medicamento, setMedicamento] = useState<Medicamento | null>(null);
  const [form, setForm] = useState({
    Nombre: "", Marca: "", Precio: "", Familia: "",
    Tipo: "", Stock: "", Descripcion: "",
  });

  const handleBuscar = async () => {
    if (!busqueda.trim()) {
      Alert.alert("Error", "Introduce un ID, nombre o marca para buscar.");
      return;
    }
    try {
      setLoading(true);
      const todos = await medicamentosAdminService.obtenerTodosMedicamentos() as Medicamento[];
      const encontradoMed = todos.find(m =>
        m.ID_Medicamento.toLowerCase() === busqueda.toLowerCase() ||
        m.Nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        m.Marca.toLowerCase().includes(busqueda.toLowerCase())
      );

      if (!encontradoMed) {
        Alert.alert("Sin resultados", "No se encontró ningún medicamento con ese criterio.");
        return;
      }

      setMedicamento(encontradoMed);
      setForm({
        Nombre: encontradoMed.Nombre,
        Marca: encontradoMed.Marca,
        Precio: encontradoMed.Precio.toString(),
        Familia: encontradoMed.Familia,
        Tipo: encontradoMed.Tipo,
        Stock: encontradoMed.Stock.toString(),
        Descripcion: encontradoMed.Descripcion ?? "",
      });
      setEncontrado(true);
    } catch (error) {
      Alert.alert("Error", "No se pudo realizar la búsqueda.");
    } finally {
      setLoading(false);
    }
  };

  const handleActualizar = async () => {
    if (!medicamento) return;
    if (form.Tipo !== "con_receta" && form.Tipo !== "sin_receta") {
      Alert.alert("Error", "El tipo debe ser 'con_receta' o 'sin_receta'.");
      return;
    }
    try {
      setLoading(true);
      await medicamentosAdminService.actualizarMedicamento(medicamento.ID_Medicamento, {
        Nombre: form.Nombre,
        Marca: form.Marca,
        Precio: parseFloat(form.Precio),
        Familia: form.Familia,
        Tipo: form.Tipo as "con_receta" | "sin_receta",
        Stock: parseInt(form.Stock),
        Descripcion: form.Descripcion,
      });
      Alert.alert("Éxito", "Medicamento actualizado correctamente.", [
        { text: "OK", onPress: () => router.back() }
      ]);
    } catch (error) {
      Alert.alert("Error", "No se pudo actualizar el medicamento.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const volver = () => router.back();

  return (
    <ScrollView style={styles.outerScroll} contentContainerStyle={styles.outerScrollContent}>
      <View style={styles.container}>
        <Text style={styles.title}>Actualizar Medicamento</Text>

        <View style={styles.formContainer}>
          {!encontrado ? (
            <>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Buscar por ID, Nombre o Marca:</Text>
                <TextInput style={styles.input} placeholder="MED001 o Paracetamol" value={busqueda} onChangeText={setBusqueda} />
              </View>

              <Pressable style={[styles.button, styles.buttonSearch]} onPress={handleBuscar} disabled={loading}>
                <Text style={styles.buttonText}>{loading ? "Buscando..." : "Buscar"}</Text>
              </Pressable>
            </>
          ) : (
            <>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>ID de Medicamento:</Text>
                <TextInput style={[styles.input, styles.inputReadonly]} value={medicamento?.ID_Medicamento} editable={false} />
              </View>

              {(["Nombre", "Marca", "Familia", "Tipo"] as const).map(field => (
                <View key={field} style={styles.inputGroup}>
                  <Text style={styles.label}>{field}:</Text>
                  <TextInput style={styles.input} value={form[field]} onChangeText={v => handleChange(field, v)} />
                </View>
              ))}

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Precio (€):</Text>
                <TextInput style={styles.input} keyboardType="decimal-pad" value={form.Precio} onChangeText={v => handleChange("Precio", v)} />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Stock (unidades):</Text>
                <TextInput style={styles.input} keyboardType="numeric" value={form.Stock} onChangeText={v => handleChange("Stock", v)} />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Descripción (opcional):</Text>
                <TextInput style={[styles.input, styles.textArea]} multiline numberOfLines={3} value={form.Descripcion} onChangeText={v => handleChange("Descripcion", v)} />
              </View>

              <Pressable style={[styles.button, styles.buttonUpdate]} onPress={handleActualizar} disabled={loading}>
                <Text style={styles.buttonText}>{loading ? "Guardando..." : "Guardar cambios"}</Text>
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