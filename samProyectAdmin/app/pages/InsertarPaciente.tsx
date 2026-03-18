// ============================================
// app/pages/InsertarPaciente.tsx (SOLUCIÓN 2)
// ============================================

import React, { useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView, Alert, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { styles } from "@/styles/InsertarPacienteStyle"; 
import { pacientesService } from "@/services/firebase";
import { Paciente } from "@/types";

function InsertarPaciente() {
  const [form, setForm] = useState({
    DNI: "",
    Nombre_Paciente: "",
    Num_Cartilla: "",
    Num_Telefono: "",
    Edad_Paciente: "",
    Tipo_Paciente: "activo" as 'activo' | 'pensionista' | 'mutualista',
    contrasena_dispensador: "",
    metodo_autenticacion: "telefono" as 'telefono' | 'contraseña',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (field: string, value: string) => {
    if (field === "Edad_Paciente") {
      const soloNumeros = String(value).replace(/[^0-9]/g, "");
      setForm(prev => ({ ...prev, [field]: soloNumeros }));
    } else if (field === "contrasena_dispensador") {
      const soloNumeros = String(value).replace(/[^0-9]/g, "");
      const limitado = soloNumeros.slice(0, 4);
      setForm(prev => ({ ...prev, [field]: limitado }));
    } else if (field === "metodo_autenticacion") {
      setForm(prev => ({ ...prev, [field]: value as 'telefono' | 'contraseña' }));
    } else {
      setForm(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleGuardar = async () => {
    try {
      console.log("🔍 Validando formulario...");
      console.log("DNI:", form.DNI);
      console.log("Cartilla:", form.Num_Cartilla);
      console.log("Teléfono:", form.Num_Telefono);
      console.log("Método:", form.metodo_autenticacion);
      console.log("Contraseña:", form.contrasena_dispensador);

      // Validaciones básicas
      if (!form.DNI.trim()) {
        Alert.alert("Error", "Por favor ingresa un DNI.");
        return;
      }

      if (!form.Nombre_Paciente.trim()) {
        Alert.alert("Error", "Por favor ingresa el nombre del paciente.");
        return;
      }

      if (!form.Num_Cartilla.trim()) {
        Alert.alert("Error", "Por favor ingresa la cartilla.");
        return;
      }

      if (!form.Num_Telefono.trim()) {
        Alert.alert("Error", "Por favor ingresa un teléfono.");
        return;
      }

      if (!form.Edad_Paciente.trim()) {
        Alert.alert("Error", "Por favor ingresa la edad.");
        return;
      }

      console.log("✅ Validaciones básicas pasadas");

      // Validar edad
      const edadNumero = parseInt(form.Edad_Paciente, 10);
      if (isNaN(edadNumero) || edadNumero < 0 || edadNumero > 150) {
        Alert.alert("Error", "La edad debe ser un número entre 0 y 150.");
        return;
      }

      console.log("✅ Edad validada:", edadNumero);

      // Validar método de autenticación
      if (form.metodo_autenticacion === "contraseña") {
        if (form.contrasena_dispensador.length !== 4) {
          Alert.alert("Error", "La contraseña debe tener exactamente 4 dígitos.");
          return;
        }
      }

      console.log("✅ Método de autenticación validado");

      console.log("📝 Creando objeto nuevoPaciente...");

      const nuevoPaciente: Omit<Paciente, 'DNI'> = {
        Num_Cartilla: form.Num_Cartilla,
        Num_Telefono: form.Num_Telefono,
        Nombre_Paciente: form.Nombre_Paciente,
        Edad_Paciente: edadNumero,
        Tipo_Paciente: form.Tipo_Paciente,
        contrasena_dispensador: form.metodo_autenticacion === "contraseña" ? form.contrasena_dispensador : null,
        Activo: true,
      };

      console.log("✅ Objeto creado:", nuevoPaciente);

      setLoading(true);
      console.log("📝 Llamando a pacientesService.crearPaciente...");
      
      const resultado = await pacientesService.crearPaciente(form.DNI, nuevoPaciente);
      
      console.log("✅ Paciente guardado con ID:", resultado);
      
      Alert.alert("Éxito", "Paciente insertado correctamente.", [
        { text: "OK", onPress: () => {
          limpiarFormulario();
          router.back();
        }}
      ]);
    } catch (error: any) {
      console.error("❌ Error completo:", error);
      console.error("❌ Mensaje:", error.message);
      console.error("❌ Stack:", error.stack);
      Alert.alert("Error", error.message || "No se pudo guardar el paciente");
    } finally {
      setLoading(false);
    }
  };

  const limpiarFormulario = () => {
    setForm({
      DNI: "",
      Nombre_Paciente: "",
      Num_Cartilla: "",
      Num_Telefono: "",
      Edad_Paciente: "",
      Tipo_Paciente: "activo",
      contrasena_dispensador: "",
      metodo_autenticacion: "telefono",
    });
  };

  const volver = () => {
    router.push("/pages/DashboardPacientes");
  };

  return (
    <ScrollView style={styles.outerScroll} contentContainerStyle={styles.outerScrollContent}>
      <View style={styles.container}>
        <Text style={styles.title}>Insertar paciente</Text>

        <View style={styles.formContainer}>
          {/* Campo DNI */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>DNI / Identificación:</Text>
            <TextInput 
              style={[styles.input, loading && { backgroundColor: '#f0f0f0' }]} 
              placeholder="Ej: 12345678Z" 
              autoCapitalize="characters"
              value={form.DNI} 
              onChangeText={v => handleChange("DNI", v)}
              editable={!loading}
            />
          </View>

          {/* Campo Nombre */}
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

          {/* Fila: Cartilla y Teléfono */}
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Nº Cartilla:</Text>
              <TextInput 
                style={styles.input} 
                placeholder="Cartilla" 
                keyboardType="numeric"
                value={form.Num_Cartilla} 
                onChangeText={v => handleChange("Num_Cartilla", v)}
                editable={!loading}
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Teléfono:</Text>
              <TextInput 
                style={styles.input} 
                placeholder="Ej: 666666667" 
                keyboardType="phone-pad"
                value={form.Num_Telefono}
                onChangeText={v => handleChange("Num_Telefono", v)}
                editable={!loading}
              />
            </View>
          </View>

          {/* Campo Edad */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Edad:</Text>
            <TextInput 
              style={styles.input} 
              placeholder="0-120" 
              keyboardType="numeric" 
              maxLength={3}
              value={form.Edad_Paciente} 
              onChangeText={v => handleChange("Edad_Paciente", v)}
              editable={!loading}
            />
          </View>

          {/* Selector de Tipo */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Régimen del Paciente:</Text>
            <View style={{ flexDirection: "row", gap: 8 }}>
              {(['activo', 'pensionista', 'mutualista'] as const).map((tipo) => (
                <Pressable
                  key={tipo}
                  style={[
                    styles.button,
                    {
                      backgroundColor: form.Tipo_Paciente === tipo ? "#2196F3" : "#e0e0e0",
                      flex: 1,
                    }
                  ]}
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

          {/* ✅ SELECTOR DE MÉTODO DE AUTENTICACIÓN EN DISPENSADOR */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Método de autenticación en dispensador:</Text>
            <View style={{ flexDirection: "row", gap: 8 }}>
              <Pressable
                style={[
                  styles.button,
                  {
                    backgroundColor: form.metodo_autenticacion === "telefono" ? "#2196F3" : "#e0e0e0",
                    flex: 1,
                  }
                ]}
                onPress={() => handleChange("metodo_autenticacion", "telefono")}
                disabled={loading}
              >
                <Text style={[styles.buttonText, { color: form.metodo_autenticacion === "telefono" ? "white" : "#666" }]}>
                  📱 Teléfono
                </Text>
              </Pressable>
              <Pressable
                style={[
                  styles.button,
                  {
                    backgroundColor: form.metodo_autenticacion === "contraseña" ? "#2196F3" : "#e0e0e0",
                    flex: 1,
                  }
                ]}
                onPress={() => handleChange("metodo_autenticacion", "contraseña")}
                disabled={loading}
              >
                <Text style={[styles.buttonText, { color: form.metodo_autenticacion === "contraseña" ? "white" : "#666" }]}>
                  🔐 Contraseña
                </Text>
              </Pressable>
            </View>
          </View>

          {/* ✅ SI SELECCIONA CONTRASEÑA - APARECE CAMPO ADICIONAL */}
          {form.metodo_autenticacion === "contraseña" && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Contraseña Dispensador (4 dígitos):</Text>
              <TextInput 
                style={styles.input} 
                placeholder="1234" 
                keyboardType="numeric" 
                maxLength={4}
                value={form.contrasena_dispensador}
                onChangeText={v => handleChange("contrasena_dispensador", v)}
                editable={!loading}
              />
              <Text style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
                {form.contrasena_dispensador.length}/4 dígitos
              </Text>
            </View>
          )}

          {/* Acciones Finales */}
          <View style={[styles.botonesContainer, { marginTop: 20 }]}>
            <Pressable 
              style={[styles.button, styles.buttonInsert, loading && { opacity: 0.7 }]} 
              onPress={handleGuardar} 
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.buttonText}>REGISTRAR PACIENTE</Text>
              )}
            </Pressable>

            <Pressable 
              style={[styles.button,]}
              onPress={volver}
              disabled={loading}
            >
              <Text style={styles.buttonText}>VOLVER</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

export default InsertarPaciente;