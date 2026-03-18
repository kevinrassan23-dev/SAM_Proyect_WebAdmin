import React, { useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView, Alert } from "react-native";
import { router } from "expo-router";
import { styles } from "../../styles/BuscarMedicamentoStyle";
import { medicamentosAdminService } from "../../services/api/medicamentosAdmin";
import { Medicamento } from "@/types";

//Logica implemntada

function BuscarMedicamento() {
  const [query, setQuery] = useState("");
  const [familia, setFamilia] = useState("");
  const [resultados, setResultados] = useState<Medicamento[]>([]);
  const [buscado, setBuscado] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleBuscar = async () => {
    try {
      setLoading(true);
      const todos = await medicamentosAdminService.obtenerTodosMedicamentos() as Medicamento[];

      const filtrados = todos.filter(m => {
        const matchQuery = query.trim() === "" ||
          m.ID_Medicamento.toLowerCase().includes(query.toLowerCase()) ||
          m.Nombre.toLowerCase().includes(query.toLowerCase()) ||
          m.Marca.toLowerCase().includes(query.toLowerCase());

        const matchFamilia = familia.trim() === "" ||
          m.Familia.toLowerCase().includes(familia.toLowerCase());

        return matchQuery && matchFamilia;
      });

      setResultados(filtrados);
      setBuscado(true);
    } catch (error) {
      Alert.alert("Error", "No se pudieron obtener los medicamentos.");
    } finally {
      setLoading(false);
    }
  };

  const handleLimpiar = () => {
    setQuery("");
    setFamilia("");
    setResultados([]);
    setBuscado(false);
  };

  const volver = () => router.back();

  return (
    <ScrollView style={styles.outerScroll} contentContainerStyle={styles.outerScrollContent}>
      <View style={styles.container}>
        <Text style={styles.title}>Buscar Medicamento</Text>

        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Buscar por ID, Nombre o Marca (opcional):</Text>
            <TextInput style={styles.input} placeholder="Ej: MED001 o Paracetamol" value={query} onChangeText={setQuery} />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Filtro por Familia (opcional):</Text>
            <TextInput style={styles.input} placeholder="Ej: Analgésicos, Antibióticos" value={familia} onChangeText={setFamilia} />
          </View>

          <Pressable style={[styles.button, styles.buttonSearch]} onPress={handleBuscar} disabled={loading}>
            <Text style={styles.buttonText}>{loading ? "Buscando..." : "Buscar"}</Text>
          </Pressable>

          {buscado && (
            <View style={styles.resultadosContainer}>
              <Text style={styles.subtitle}>
                {resultados.length > 0 ? `${resultados.length} resultado(s)` : "Sin resultados"}
              </Text>

              {resultados.map(med => (
                <View key={med.ID_Medicamento} style={styles.tarjeta}>
                  <View style={styles.tarjetaHeader}>
                    <View>
                      <Text style={styles.tarjetaTitulo}>{med.Nombre}</Text>
                      <Text style={styles.tarjetaMarca}>{med.Marca}</Text>
                    </View>
                    <View style={styles.tipoBadge}>
                      <Text style={styles.tipoTexto}>{med.Tipo === "sin_receta" ? "Libre" : "Receta"}</Text>
                    </View>
                  </View>
                  <Text style={styles.tarjetaTexto}>ID: {med.ID_Medicamento}</Text>
                  <Text style={styles.tarjetaTexto}>Familia: {med.Familia}</Text>
                  <Text style={styles.tarjetaTexto}>Precio: €{med.Precio.toFixed(2)}</Text>
                  <Text style={styles.tarjetaTexto}>Stock: {med.Stock} unidades</Text>
                  <Text style={[styles.tarjetaTexto, { color: med.Activo ? "#4CAF50" : "#F44336" }]}>
                    {med.Activo ? "✓ Disponible" : "✗ No disponible"}
                  </Text>
                </View>
              ))}
            </View>
          )}

          <View style={styles.botonesContainer}>
            <Pressable style={[styles.button,]} onPress={handleLimpiar}>
              <Text style={styles.buttonText}>Limpiar</Text>
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

export default BuscarMedicamento;