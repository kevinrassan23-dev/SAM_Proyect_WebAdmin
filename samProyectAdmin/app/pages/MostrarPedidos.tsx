import React, { useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView, FlatList } from "react-native";
import { router } from "expo-router";
import { styles } from "../../styles/MostrarPedidosStyle";

function MostrarPedidos() {
  const [pedidos, setPedidos] = useState(false);

  // ❌ AQUÍ VA LA LÓGICA DE BÚSQUEDA Y FILTRO DE PEDIDOS

  const volver = () => {
    router.push("/pages/DisplaySHOP");
  };

  return (
    <ScrollView style={styles.outerScroll} contentContainerStyle={styles.outerScrollContent}>
      <View style={styles.container}>
        <Text style={styles.title}>Mostrar Pedidos</Text>

        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Buscar por ID de Pedido o DNI (opcional):</Text>
            <TextInput style={styles.input} placeholder="Ej: PED001 o 12345678A" />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Filtro por Estado (opcional):</Text>
            <TextInput style={styles.input} placeholder="Ej: generado, procesado, entregado" />
          </View>

          <View style={styles.botonesBusqueda}>
            <Pressable style={[styles.button, styles.buttonSearch]}>
              <Text style={styles.buttonText}>BUSCAR</Text>
            </Pressable>

            <Pressable style={[styles.button, styles.buttonInfo]}>
              <Text style={styles.buttonText}>MOSTRAR TODOS</Text>
            </Pressable>
          </View>

          {/* ❌ AQUÍ VA LA LÓGICA PARA MOSTRAR RESULTADOS */}
          {pedidos && (
            <View style={styles.resultadosContainer}>
              <Text style={styles.subtitleResultados}>Resultados: 1 pedido(s)</Text>
              
              <View style={styles.tarjeta}>
                <View style={styles.tarjetaHeader}>
                  <Text style={styles.tarjetaTitulo}>PED001</Text>
                  <View style={styles.estadoBadge}>
                    <Text style={styles.estadoTexto}>Generado</Text>
                  </View>
                </View>
                <Text style={styles.tarjetaTexto}>DNI: 12345678A</Text>
                <Text style={styles.tarjetaTexto}>Tipo: activo</Text>
                <Text style={styles.tarjetaTexto}>Descuento: 15%</Text>
                <Text style={styles.tarjetaTexto}>Precio Total: €45.99</Text>
                <Text style={styles.tarjetaTexto}>Fecha: 27/02/2026 14:30</Text>
                
                <View style={styles.estadosContainer}>
                  <Text style={styles.estadosLabel}>Estados:</Text>
                  <View style={styles.estadosList}>
                    <View style={styles.estadoTag}>
                      <Text style={styles.estadoTagText}>generando</Text>
                    </View>
                    <View style={styles.estadoTag}>
                      <Text style={styles.estadoTagText}>generado</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          )}

          <View style={styles.botonesAccion}>
            <Pressable style={[styles.button, styles.buttonSecondary]}>
              <Text style={styles.buttonText}>LIMPIAR CAMPOS</Text>
            </Pressable>

            <Pressable style={[styles.button,]} onPress={volver}>
              <Text style={styles.buttonText}>VOLVER</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

export default MostrarPedidos;