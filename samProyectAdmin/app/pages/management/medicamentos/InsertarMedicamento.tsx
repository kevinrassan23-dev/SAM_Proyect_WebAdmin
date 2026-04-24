import React, { useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView, Alert, ActivityIndicator, Platform } from "react-native";
import { router } from "expo-router";
import { styles } from "@/styles/pages/management/medicamentos/InsertarMedicamentoStyle";
import { medicamentosService } from "@/services/supabase/medicamentos";
import { Medicamento } from "@/types/medicamento";
import { useAuthGuard } from "@/hooks/useAuthGuard";

/**
 * Muestra una alerta nativa o un alert de navegador dependiendo de la plataforma.
 */
const alertar = (titulo: string, mensaje: string, onOk?: () => void) => {
  if (Platform.OS === "web") {
    window.alert(`${titulo}\n\n${mensaje}`);
    onOk?.();
  } else {
    Alert.alert(titulo, mensaje, [{ text: "OK", onPress: onOk }]);
  }
};

/**
 * Convierte un string de fecha YYYY-MM-DD en un objeto Date local.
 */
const parsearFechaLocal = (fechaStr: string): Date => {
  const [year, month, day] = fechaStr.split('-').map(Number);
  return new Date(year, month - 1, day);
};

/**
 * Limpia y valida el formato de entrada para campos de precio.
 */
const formatearPrecio = (valor: string): string => {
  const limpio = valor.replace(/[^0-9.]/g, "");
  const partes = limpio.split(".");
  if (partes.length > 2) return partes[0] + "." + partes[1];
  return limpio;
};

function InsertarMedicamento() {
  useAuthGuard();

  // --- ESTADOS ---
  const [form, setForm] = useState({
    Nombre: "",
    Marca: "",
    Precio: "",
    Familia: "",
    Stock: "",
    Descripcion: "",
    Fecha_Envase: "",
    Fecha_Caducidad: "",
  });
  const [tipo, setTipo] = useState<'con_receta' | 'sin_receta' | null>(null);
  const [loading, setLoading] = useState(false);

  /**
   * Actualiza los valores del formulario de forma dinámica.
   */
  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  /**
   * Valida la integridad de los datos antes de proceder al guardado.
   * @returns string con el error o null si es válido.
   */

  const validarFechaReal = (fechaStr: string): boolean => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(fechaStr)) return false;
    
    const [year, month, day] = fechaStr.split('-').map(Number);
    if (month < 1 || month > 12) return false;
    if (day < 1) return false;
    
    const fecha = new Date(year, month - 1, day);
    return (
      fecha.getFullYear() === year &&
      fecha.getMonth() === month - 1 &&
      fecha.getDate() === day
    );
  };

  const validarFormulario = (): string | null => {
    // Validaciones de campos de texto y numéricos
    if (!form.Nombre.trim()) return "Nombre es requerido";
    if (!form.Marca.trim()) return "Marca es requerida";
    if (!form.Precio.trim() || isNaN(parseFloat(form.Precio))) return "Precio válido es requerido";
    if (!form.Familia.trim()) return "Familia es requerida";
    if (!form.Stock.trim() || isNaN(parseInt(form.Stock))) return "Stock válido es requerido";
    if (!tipo) return "Debes seleccionar el tipo: Con Receta o Sin Receta";

    // Validaciones de existencia de fechas y formato real
    if (!validarFechaReal(form.Fecha_Envase)) {
      return "Fecha de inicio inválida. Verifica el mes (1-12) y el día según el mes.";
    }
    if (!validarFechaReal(form.Fecha_Caducidad)) {
      return "Fecha de expiración inválida. Verifica el mes (1-12) y el día según el mes.";
    }

    // Validación de coherencia cronológica
    if (new Date(form.Fecha_Caducidad) <= new Date(form.Fecha_Envase)) {
      return "La fecha de caducidad debe ser posterior a la de envase";
    }

    return null;
  };

  /**
   * Procesa la inserción del nuevo medicamento en la base de datos.
   */
  const [errorFamilia, setErrorFamilia] = useState("");

  const handleGuardar = async () => {
    console.log(`[${new Date().toISOString()}] Iniciando proceso de guardado de medicamento.`);
    
    const validacionError = validarFormulario();
    if (validacionError) {
      console.warn(`[${new Date().toISOString()}] Error de validación: ${validacionError}`);
      alertar("Error", validacionError);
      return;
    }

    setLoading(true);
    try {
      // ── Validar que la familia existe en el catálogo
      const familias = await medicamentosService.obtenerFamilias();
      const familiasValidas = familias.map((f: string) => f.toLowerCase().trim());

      if (!familiasValidas.includes(form.Familia.toLowerCase().trim())) {
        setErrorFamilia(
          `La familia "${form.Familia}" no existe en el catálogo. ` +
          `Por favor, consulta el catálogo de familias ${tipo === 'con_receta' ? 'con receta' : 'sin receta'}.`
        );
        setLoading(false);
        return;
      }
      setErrorFamilia("");

      const precioFormateado = parseFloat(parseFloat(form.Precio).toFixed(2));

      const nuevo: Omit<Medicamento, 'ID_Medicamento'> = {
        Nombre: form.Nombre,
        Marca: form.Marca,
        Precio: precioFormateado,
        Familia: form.Familia,
        Tipo: tipo!,
        Stock: parseInt(form.Stock),
        Descripcion: form.Descripcion,
        Fecha_Envase: parsearFechaLocal(form.Fecha_Envase),
        Fecha_Caducidad: parsearFechaLocal(form.Fecha_Caducidad),
        Activo: true,
      };

      const resultado = await medicamentosService.crearMedicamento(nuevo);
      console.log(`[${new Date().toISOString()}] Medicamento insertado con éxito. ID: ${resultado.ID_Medicamento}`);
      
      alertar("Éxito", `Medicamento ${resultado.ID_Medicamento} insertado correctamente.`, limpiarFormulario);
    } catch (error: any) {
      console.error(`[${new Date().toISOString()}] Error en handleGuardar:`, error);
      alertar("Error", error.message || "No se pudo insertar el medicamento.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Resetea todos los campos del formulario y el tipo seleccionado.
   */
  const limpiarFormulario = () => {
    console.log(`[${new Date().toISOString()}] Limpiando formulario.`);
    setForm({ Nombre: "", Marca: "", Precio: "", Familia: "", Stock: "", Descripcion: "", Fecha_Envase: "", Fecha_Caducidad: "" });
    setTipo(null);
  };

  /**
   * Redirige a la pantalla de visualización de pedidos.
   */
  const volver = () => {
    console.log(`[${new Date().toISOString()}] Navegando hacia atrás.`);
    router.push("/pages/management/pedidos/MostrarPedidos");
  };

  return (
    <ScrollView style={styles.outerScroll} contentContainerStyle={styles.outerScrollContent}>
      <View style={styles.container}>
        <Text style={styles.title}>Insertar Medicamento</Text>

        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nombre:</Text>
            <TextInput style={styles.input} placeholder="Paracetamol" value={form.Nombre} onChangeText={v => handleChange("Nombre", v)} editable={!loading} />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Marca:</Text>
            <TextInput style={styles.input} placeholder="Normon" value={form.Marca} onChangeText={v => handleChange("Marca", v)} editable={!loading} />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Precio (€):</Text>
            <View style={[styles.input, { flexDirection: 'row', alignItems: 'center', padding: 0 }]}>
              <View style={{ paddingHorizontal: 10, borderRightWidth: 1, borderRightColor: '#ccc', justifyContent: 'center', height: '100%' }}>
                <Text style={{ color: '#555', fontWeight: '600' }}>€</Text>
              </View>
              <TextInput
                style={{ flex: 1, paddingHorizontal: 10, color: '#333' }}
                placeholder="0.00"
                keyboardType="decimal-pad"
                value={form.Precio}
                onChangeText={v => handleChange("Precio", formatearPrecio(v))}
                onBlur={() => {
                  if (form.Precio) handleChange("Precio", parseFloat(form.Precio).toFixed(2));
                }}
                editable={!loading}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Familia:</Text>
            <TextInput
                style={styles.input}
                placeholder="Ej: Analgésicos"
                value={form.Familia}
                onChangeText={(v) => {
                    handleChange("Familia", v);
                    setErrorFamilia(""); 
                }}
                editable={!loading}
            />
            {errorFamilia !== "" && (
                <Text style={{ color: '#ff2b1c', fontSize: 12, marginTop: 4, fontStyle: 'italic' }}>
                    {errorFamilia}
                </Text>
            )}
        </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Stock (unidades):</Text>
            <TextInput style={styles.input} placeholder="100" keyboardType="numeric" value={form.Stock} onChangeText={v => handleChange("Stock", v.replace(/[^0-9]/g, ""))} editable={!loading} />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Descripción (opcional):</Text>
            <TextInput style={[styles.input, styles.textArea]} placeholder="Analgésico y antipirético..." multiline numberOfLines={3} value={form.Descripcion} onChangeText={v => handleChange("Descripcion", v)} editable={!loading} />
          </View>

          <View style={{ flexDirection: 'row', gap: 10 }}>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Fecha Envase:</Text>
              <TextInput style={styles.input} placeholder="YYYY-MM-DD" value={form.Fecha_Envase} onChangeText={v => handleChange("Fecha_Envase", v)} editable={!loading} />
            </View>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Fecha Caducidad:</Text>
              <TextInput style={styles.input} placeholder="YYYY-MM-DD" value={form.Fecha_Caducidad} onChangeText={v => handleChange("Fecha_Caducidad", v)} editable={!loading} />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tipo de Medicamento:</Text>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <Pressable
                style={[styles.button, { flex: 1, backgroundColor: tipo === 'con_receta' ? '#2196F3' : '#e0e0e0' }]}
                onPress={() => setTipo('con_receta')}
                disabled={loading}
              >
                <Text style={[styles.buttonText, { color: tipo === 'con_receta' ? '#fff' : '#666' }]}>CON RECETA</Text>
              </Pressable>
              <Pressable
                style={[styles.button, { flex: 1, backgroundColor: tipo === 'sin_receta' ? '#4CAF50' : '#e0e0e0' }]}
                onPress={() => setTipo('sin_receta')}
                disabled={loading}
              >
                <Text style={[styles.buttonText, { color: tipo === 'sin_receta' ? '#fff' : '#666' }]}>SIN RECETA</Text>
              </Pressable>
            </View>
            {tipo && (
              <View style={{ backgroundColor: tipo === 'con_receta' ? '#E3F2FD' : '#E8F5E9', padding: 8, borderRadius: 6, marginTop: 6 }}>
                <Text style={{ color: tipo === 'con_receta' ? '#1565C0' : '#2E7D32', fontWeight: 'bold' }}>
                  ✓ Seleccionado: {tipo === 'con_receta' ? 'Con Receta' : 'Sin Receta'}
                </Text>
              </View>
            )}
          </View>

          {loading && (
            <View style={{ alignItems: 'center', marginVertical: 20 }}>
              <ActivityIndicator size="large" color="#2196F3" />
              <Text style={{ marginTop: 10, color: '#666' }}>Guardando medicamento...</Text>
            </View>
          )}

          <View style={styles.botonesContainer}>
            <Pressable style={[styles.button, styles.buttonInsert, loading && { opacity: 0.5 }]} onPress={handleGuardar} disabled={loading}>
              <Text style={styles.buttonText}>{loading ? "GUARDANDO..." : "GUARDAR MEDICAMENTO"}</Text>
            </Pressable>
            <Pressable style={[styles.button, { backgroundColor: "#FFA500" }]} onPress={limpiarFormulario} disabled={loading}>
              <Text style={styles.buttonText}>LIMPIAR CAMPOS</Text>
            </Pressable>
            <Pressable style={[styles.button]} onPress={volver} disabled={loading}>
              <Text style={styles.buttonText}>VOLVER</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

export default InsertarMedicamento;