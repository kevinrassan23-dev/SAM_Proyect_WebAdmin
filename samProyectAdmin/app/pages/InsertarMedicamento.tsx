import React, { useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView, Alert } from "react-native";
import { router } from "expo-router";
import { styles } from "../../styles/InsertarMedicamentoStyle";
import { medicamentosAdminService } from "../../services/api/medicamentosAdmin";
import { Medicamento } from "@/types";

//Logica implemntada

function InsertarMedicamento() {
  const [form, setForm] = useState({
    Nombre: "",
    Marca: "",
    Precio: "",
    Familia: "",
    Tipo: "",
    Stock: "",
    Descripcion: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleGuardar = async () => {
    if (!form.Nombre || !form.Marca || !form.Precio || !form.Familia || !form.Tipo || !form.Stock) {
      Alert.alert("Error", "Por favor completa todos los campos obligatorios.");
      return;
    }

    if (form.Tipo !== "con_receta" && form.Tipo !== "sin_receta") {
      Alert.alert("Error", "El tipo debe ser 'con_receta' o 'sin_receta'.");
      return;
    }

    const nuevo: Omit<Medicamento, "ID_Medicamento"> = {
      Nombre: form.Nombre,
      Marca: form.Marca,
      Precio: parseFloat(form.Precio),
      Familia: form.Familia,
      Tipo: form.Tipo as "con_receta" | "sin_receta",
      Stock: parseInt(form.Stock),
      Descripcion: form.Descripcion,
      Activo: true,
    };

    try {
      setLoading(true);
      await medicamentosAdminService.crearMedicamento(nuevo);
      Alert.alert("Éxito", "Medicamento insertado correctamente.", [
        { text: "OK", onPress: () => router.back() }
      ]);
    } catch (error) {
      Alert.alert("Error", "No se pudo insertar el medicamento.");
    } finally {
      setLoading(false);
    }
  };

  const volver = () => {
      router.push("/pages/DashboardMedicamentos");
    };

  return (
    <ScrollView style={styles.outerScroll} contentContainerStyle={styles.outerScrollContent}>
      <View style={styles.container}>
        <Text style={styles.title}>Insertar Medicamento</Text>

        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nombre:</Text>
            <TextInput style={styles.input} placeholder="Paracetamol" value={form.Nombre} onChangeText={v => handleChange("Nombre", v)} />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Marca:</Text>
            <TextInput style={styles.input} placeholder="Tachipirina" value={form.Marca} onChangeText={v => handleChange("Marca", v)} />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Precio (€):</Text>
            <TextInput style={styles.input} placeholder="5.99" keyboardType="decimal-pad" value={form.Precio} onChangeText={v => handleChange("Precio", v)} />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Familia:</Text>
            <TextInput style={styles.input} placeholder="Analgésicos" value={form.Familia} onChangeText={v => handleChange("Familia", v)} />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tipo (con_receta / sin_receta):</Text>
            <TextInput style={styles.input} placeholder="sin_receta" value={form.Tipo} onChangeText={v => handleChange("Tipo", v)} />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Stock (unidades):</Text>
            <TextInput style={styles.input} placeholder="100" keyboardType="numeric" value={form.Stock} onChangeText={v => handleChange("Stock", v)} />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Descripción (opcional):</Text>
            <TextInput style={[styles.input, styles.textArea]} placeholder="Analgésico y antipirético..." multiline numberOfLines={3} value={form.Descripcion} onChangeText={v => handleChange("Descripcion", v)} />
          </View>

          <View style={styles.botonesContainer}>
            <Pressable style={[styles.button, styles.buttonInsert]} onPress={handleGuardar} disabled={loading}>
              <Text style={styles.buttonText}>{loading ? "Guardando..." : "Guardar"}</Text>
            </Pressable>

            <Pressable style={[styles.button,]} onPress={volver}>
              <Text style={styles.buttonText}>Volver</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

export default InsertarMedicamento;