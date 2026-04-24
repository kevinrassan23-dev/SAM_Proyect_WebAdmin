import React, { useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView, ActivityIndicator, Platform } from "react-native";
import { router } from "expo-router";
import { styles } from "@/styles/pages/management/pacientes/InsertarPacienteStyle";
import { pacientesService } from "@/services/firebase";
import { Paciente } from "@/types/paciente";
import { useAuthGuard } from "@/hooks/useAuthGuard";

/**
 * UTILERÍA: Genera un timestamp actual para el registro de operaciones en consola
 */
const getTimestamp = () => new Date().toLocaleString();

const PREFIJO_CARTILLA = "BBBBBBBBB"; 

/**
 * Algoritmo de validación de DNI español (8 números + 1 letra de control)
 */
const validarDNI = (dni: string): boolean => {
  const letras = "TRWAGMYFPDXBNJZSQVHLCKE";
  const dniLimpio = dni.trim().toUpperCase();
  if (!/^\d{8}[A-Z]$/.test(dniLimpio)) return false;
  const numero = parseInt(dniLimpio.slice(0, 8), 10);
  return dniLimpio[8] === letras[numero % 23];
};

/**
 * Sistema de confirmación adaptativo según plataforma
 */
const confirmar = (mensaje: string, onConfirm: () => void) => {
  if (Platform.OS === "web") {
    if (window.confirm(mensaje)) onConfirm();
  } else {
    const { Alert } = require("react-native");
    Alert.alert("Confirmar", mensaje, [
      { text: "Cancelar", style: "cancel" },
      { text: "Sí", onPress: onConfirm },
    ]);
  }
};

/**
 * Sistema de alertas adaptativo según plataforma
 */
const alertar = (titulo: string, mensaje: string) => {
  if (Platform.OS === "web") {
    window.alert(`${titulo}\n\n${mensaje}`);
  } else {
    const { Alert } = require("react-native");
    Alert.alert(titulo, mensaje, [{ text: "OK" }]);
  }
};

function InsertarPaciente() {
  useAuthGuard();

  // --- Estado Único del Formulario ---
  const [form, setForm] = useState({
    DNI: "",
    Nombre_Paciente: "",
    Num_Cartilla: "",
    Num_Telefono: "",
    Edad_Paciente: "",
    Tipo_Paciente: "activo" as 'activo' | 'pensionista' | 'mutualista',
  });
  
  const [loading, setLoading] = useState(false);
  const [errorEdad, setErrorEdad] = useState("");

  /**
   * Manejador centralizado de cambios en los inputs con limpieza de datos (Sanitization)
   */
  const handleChange = (field: string, value: string) => {
    if (field === "Edad_Paciente") {
      const soloNumeros = value.replace(/[^0-9]/g, "");
      const numero = parseInt(soloNumeros, 10);
      if (soloNumeros !== "" && numero > 120) {
        setErrorEdad("La edad no puede ser mayor a 120");
      } else {
        setErrorEdad("");
      }
      setForm(prev => ({ ...prev, [field]: soloNumeros }));
    } else if (field === "Num_Telefono") {
      setForm(prev => ({ ...prev, [field]: value.replace(/[^0-9]/g, "") }));
    } else if (field === "Num_Cartilla") {
      setForm(prev => ({ ...prev, [field]: value.replace(/[^0-9]/g, "").slice(0, 7) }));
    } else {
      setForm(prev => ({ ...prev, [field]: value }));
    }
  };

  /**
   * Restablece el formulario a su estado inicial
   */
  const limpiarFormulario = () => {
    console.log(`[${getTimestamp()}] Limpiando campos del formulario`);
    setForm({ DNI: "", Nombre_Paciente: "", Num_Cartilla: "", Num_Telefono: "", Edad_Paciente: "", Tipo_Paciente: "activo" });
    setErrorEdad("");
  };

  /**
   * Ejecuta el proceso de persistencia en Firebase tras validaciones
   */
  const ejecutarGuardar = async () => {
    // Validación de campos requeridos
    if (
      !form.DNI.trim() ||
      !form.Nombre_Paciente.trim() ||
      !form.Num_Cartilla.trim() ||
      !form.Num_Telefono.trim() ||
      !form.Edad_Paciente.trim()
    ) {
      alertar("Campos incompletos", "Debes rellenar todos los datos para registrar el paciente.");
      return;
    }

    // Validación lógica de DNI
    if (!validarDNI(form.DNI)) {
      alertar("Campos incompletos", "El DNI no es válido. Comprueba el formato (8 dígitos + letra correcta).");
      return;
    }

    // Validación de rango de edad
    const edadNumero = parseInt(form.Edad_Paciente, 10);
    if (isNaN(edadNumero) || edadNumero < 1 || edadNumero > 120) {
      alertar("Campos incompletos", "La edad debe ser un número entre 1 y 120.");
      return;
    }

    if (errorEdad) return;

    setLoading(true);
    console.log(`[${getTimestamp()}] Intentando registrar paciente: ${form.DNI.toUpperCase()}`);

    try {
      const cartillaCompleta = `${PREFIJO_CARTILLA}${form.Num_Cartilla}`;

      const nuevoPaciente: Omit<Paciente, 'DNI'> = {
        Num_Cartilla: cartillaCompleta,
        Num_Telefono: `+34${form.Num_Telefono}`,
        Nombre_Paciente: form.Nombre_Paciente,
        Edad_Paciente: edadNumero,
        Tipo_Paciente: form.Tipo_Paciente,
        Activo: true,
      };

      await pacientesService.crearPaciente(form.DNI.trim().toUpperCase(), nuevoPaciente);

      console.log(`[${getTimestamp()}] Exito: Paciente registrado correctamente`);
      alertar("Paciente registrado", "Paciente registrado correctamente.");
      limpiarFormulario();
    } catch (error: any) {
      console.log(`[${getTimestamp()}] Error al registrar paciente: ${error.message}`);
      alertar("Paciente duplicado", error.message || "No se pudo guardar el paciente.");
    } finally {
      setLoading(false);
    }
  };

  const handleGuardar = () => {
    confirmar("¿Estás seguro de que deseas registrar este paciente?", ejecutarGuardar);
  };

  const handleLimpiar = () => {
    confirmar("¿Estás seguro de que deseas limpiar todos los campos?", limpiarFormulario);
  };

  /**
   * Navegación de retorno al panel principal
   */
  const volver = () => {
    console.log(`[${getTimestamp()}] Navegando de vuelta a MostrarPedidos`);
    router.push("/pages/management/pedidos/MostrarPedidos");
  };

  return (
    <ScrollView style={styles.outerScroll} contentContainerStyle={styles.outerScrollContent} keyboardShouldPersistTaps="handled">
      <View style={styles.container}>
        <Text style={styles.title}>Insertar paciente</Text>

        <View style={styles.formContainer}>

          {/* INPUT: DNI */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>DNI / Identificación:</Text>
            <TextInput
              style={[styles.input, loading && { backgroundColor: '#f0f0f0' }]}
              placeholder="Ej: 12345678Z"
              autoCapitalize="characters"
              value={form.DNI}
              onChangeText={v => handleChange("DNI", v)}
              editable={!loading}
              maxLength={9}
            />
          </View>

          {/* INPUT: NOMBRE */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nombre y apellidos:</Text>
            <TextInput
              style={styles.input}
              placeholder="Nombre y apellidos"
              value={form.Nombre_Paciente}
              onChangeText={v => handleChange("Nombre_Paciente", v)}
              editable={!loading}
            />
          </View>

          {/* SECCIÓN DOBLE: CARTILLA Y TELÉFONO */}
          <div style={{ flexDirection: 'row', gap: 10 }}>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Nº Cartilla:</Text>
              <View style={[styles.input, { flexDirection: 'row', alignItems: 'center', padding: 0 }]}>
                <View style={{ paddingHorizontal: 10, borderRightWidth: 1, borderRightColor: '#ccc', justifyContent: 'center', height: '100%' }}>
                  <Text style={{ color: '#555', fontWeight: '600' }}>B</Text>
                </View>
                <TextInput
                  style={{ flex: 1, paddingHorizontal: 10, color: '#333' }}
                  placeholder="1234567"
                  keyboardType="numeric"
                  value={form.Num_Cartilla}
                  onChangeText={v => handleChange("Num_Cartilla", v)}
                  editable={!loading}
                  maxLength={7}
                />
              </View>
            </View>

            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Teléfono:</Text>
              <View style={[styles.input, { flexDirection: 'row', alignItems: 'center', padding: 0 }]}>
                <View style={{ paddingHorizontal: 10, borderRightWidth: 1, borderRightColor: '#ccc', justifyContent: 'center', height: '100%' }}>
                  <Text style={{ color: '#555', fontWeight: '600' }}>+34</Text>
                </View>
                <TextInput
                  style={{ flex: 1, paddingHorizontal: 10, color: '#333' }}
                  placeholder="666666667"
                  keyboardType="phone-pad"
                  value={form.Num_Telefono}
                  onChangeText={v => handleChange("Num_Telefono", v)}
                  editable={!loading}
                  maxLength={9}
                />
              </View>
            </View>
          </div>

          {/* INPUT: EDAD */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Edad:</Text>
            <TextInput
              style={[styles.input, errorEdad ? { borderColor: '#E63946' } : {}]}
              placeholder="1-120"
              keyboardType="numeric"
              maxLength={3}
              value={form.Edad_Paciente}
              onChangeText={v => handleChange("Edad_Paciente", v)}
              editable={!loading}
            />
            {errorEdad !== "" && (
              <Text style={{ fontSize: 12, color: '#E63946', marginTop: 4 }}>⚠️ {errorEdad}</Text>
            )}
          </View>

          {/* SELECTOR DE RÉGIMEN */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Régimen del Paciente:</Text>
            <View style={{ flexDirection: "row", gap: 8 }}>
              {(['activo', 'pensionista', 'mutualista'] as const).map((tipo) => (
                <Pressable
                  key={tipo}
                  style={[styles.button, { backgroundColor: form.Tipo_Paciente === tipo ? "#2196F3" : "#e0e0e0", flex: 1 }]}
                  onPress={() => handleChange("Tipo_Paciente", tipo)}
                  disabled={loading}
                >
                  <Text style={[styles.buttonText, { color: form.Tipo_Paciente === tipo ? "white" : "#666" }]}>
                    {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* CONTENEDOR DE BOTONES DE ACCIÓN */}
          <View style={[styles.botonesContainer, { marginTop: 20 }]}>
            <Pressable
              role="button"
              style={[styles.button, styles.buttonInsert, loading && { opacity: 0.7 }]}
              onPress={handleGuardar}
              disabled={loading}
            >
              {loading ? <ActivityIndicator color="white" /> : <Text style={styles.buttonText}>REGISTRAR PACIENTE</Text>}
            </Pressable>

            <Pressable
              role="button"
              style={[styles.button, styles.buttonCancel]}
              onPress={handleLimpiar}
              disabled={loading}
            >
              <Text style={styles.buttonText}>LIMPIAR CAMPOS</Text>
            </Pressable>

            <Pressable style={[styles.button]} onPress={volver} disabled={loading} role="button">
              <Text style={styles.buttonText}>VOLVER</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

export default InsertarPaciente;