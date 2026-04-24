import React, { useState, useRef, useCallback } from "react";
import { View, Text, ScrollView, Animated, ActivityIndicator } from "react-native";
import { useFocusEffect } from "expo-router";
import { pedidosService } from "@/services/supabase/pedidos";
import { Transaccion } from "@/types";
import theme from "@/theme/Theme";
import { useAuthGuard } from "@/hooks/useAuthGuard";

/**
 * Configuración de las columnas para la tabla de transacciones.
 * Define la clave del objeto y la etiqueta visible.
 */
const COLUMNAS = [
  { key: "id", label: "ID" },
  { key: "ID_Pedido", label: "ID Pedido" },
  { key: "dni_paciente", label: "DNI Paciente" },
  { key: "monto", label: "Monto" },
  { key: "metodo_pago", label: "Método Pago" },
  { key: "estado", label: "Estado" },
  { key: "codigo_transaccion", label: "Código Transacción" },
  { key: "fecha_inicio", label: "Fecha Inicio" },
  { key: "fecha_completacion", label: "Fecha Completación" },
  { key: "created_at", label: "Creado" },
  { key: "updated_at", label: "Actualizado" },
];

function MostrarPedidos() {
  useAuthGuard();

  // --- ESTADOS ---
  const [transacciones, setTransacciones] = useState<Transaccion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // --- ANIMACIONES ---
  const alturaAnim = useRef(new Animated.Value(0)).current;
  const opacidadAnim = useRef(new Animated.Value(0)).current;

  /**
   * Se dispara cada vez que la pantalla entra en foco.
   * Limpia estados anteriores e inicia la carga de datos.
   */
  useFocusEffect(
    useCallback(() => {
      console.log(`[${new Date().toISOString()}] Pantalla de Pedidos enfocada. Cargando...`);
      setLoading(true);
      setError("");
      setTransacciones([]);
      cargarTransacciones();
    }, [])
  );

  /**
   * Obtiene las transacciones desde el servicio de Supabase y ejecuta las animaciones de entrada.
   */
  const cargarTransacciones = async () => {
    try {
      alturaAnim.setValue(0);
      opacidadAnim.setValue(0);

      const data = await pedidosService.obtenerTransacciones();
      setTransacciones(data);
      console.log(`[${new Date().toISOString()}] Se recuperaron ${data.length} transacciones.`);

      // Secuencia de animación: Primero opacidad, luego expansión de altura
      Animated.sequence([
        Animated.timing(opacidadAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(alturaAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: false,
        }),
      ]).start();
    } catch (err: any) {
      console.error("Error al cargar pedidos:", err);
      setError(err.message || "Error al cargar transacciones");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Formatea strings de fecha ISO a un formato local legible.
   */
  const formatearFecha = (fecha: string): string => {
    if (!fecha) return "—";
    try {
      return new Date(fecha).toLocaleString("es-ES");
    } catch {
      return fecha;
    }
  };

  /**
   * Procesa el valor de cada celda según su tipo (moneda, fecha o texto).
   */
  const formatearValor = (key: string, valor: any): string => {
    if (valor === null || valor === undefined) return "—";
    if (key === "monto") return `€${Number(valor).toFixed(2)}`;
    if (["fecha_inicio", "fecha_completacion", "created_at", "updated_at"].includes(key))
      return formatearFecha(valor);
    if (typeof valor === "object") return JSON.stringify(valor);
    return String(valor);
  };

  // Interpolación para el efecto de "persiana" en la tabla
  const alturaInterpolada = alturaAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 5000], // Valor alto para permitir crecimiento dinámico
  });

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 24, alignItems: "center" }}>
        
        <Text style={{
          fontSize: 28,
          fontWeight: "bold",
          color: theme.colors.secondary,
          textAlign: "center",
          marginBottom: 24,
          marginTop: 8,
          width: "100%",
        }}>
          Pedidos y Transacciones
        </Text>

        {loading && (
          <View style={{ marginTop: 50, alignItems: "center" }}>
            <ActivityIndicator size="large" color={theme.colors.secondary} />
            <Text style={{ marginTop: 12, color: "#666" }}>Cargando historial...</Text>
          </View>
        )}

        {error !== "" && (
          <View style={{ backgroundColor: "#FFE6E6", padding: 16, borderRadius: 8, width: "100%" }}>
            <Text style={{ color: "#D32F2F", textAlign: "center", fontWeight: "bold" }}>{error}</Text>
          </View>
        )}

        {!loading && transacciones.length === 0 && !error && (
          <Text style={{ color: "#666", marginTop: 20 }}>No hay transacciones registradas.</Text>
        )}

        {/* TABLA ANIMADA */}
        {!loading && transacciones.length > 0 && (
          <Animated.View style={{ opacity: opacidadAnim, width: "100%", alignItems: "center" }}>
            <ScrollView horizontal showsHorizontalScrollIndicator={true} style={{ width: "100%" }}>
              <Animated.View style={{ overflow: "hidden", height: alturaInterpolada }}>

                {/* ✅ CABECERA — Fondo Morado, Texto Blanco */}
                <View style={{
                  flexDirection: "row",
                  backgroundColor: theme.colors.secondary,
                  borderWidth: 1,
                  borderColor: theme.colors.secondary,
                  borderRadius: 4,
                }}>
                  {COLUMNAS.map((col) => (
                    <View key={col.key} style={{ width: 160, padding: 10 }}>
                      <Text style={{
                        color: "#ffffff",
                        fontWeight: "bold",
                        fontSize: 12,
                        textAlign: "center",
                      }}>
                        {col.label}
                      </Text>
                    </View>
                  ))}
                </View>

                {/* ✅ FILAS — Fondo Cebra, Texto Negro */}
                {transacciones.map((transaccion, rowIndex) => (
                  <View
                    key={transaccion.id ?? `row-${rowIndex}`}
                    style={{
                      flexDirection: "row",
                      backgroundColor: rowIndex % 2 === 0 ? "#ffffff" : "#f5f5f5",
                      borderBottomWidth: 1,
                      borderBottomColor: "#e0e0e0",
                    }}
                  >
                    {COLUMNAS.map((col) => (
                      <View key={col.key} style={{ width: 160, padding: 10, justifyContent: "center" }}>
                        <Text style={{
                          color: "#000000",
                          fontSize: 11,
                          textAlign: "center",
                          fontWeight: "500",
                        }}>
                          {formatearValor(col.key, (transaccion as any)[col.key])}
                        </Text>
                      </View>
                    ))}
                  </View>
                ))}

              </Animated.View>
            </ScrollView>
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );
}

export default MostrarPedidos;