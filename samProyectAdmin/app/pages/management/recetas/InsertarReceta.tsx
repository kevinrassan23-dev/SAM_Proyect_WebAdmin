import React, { useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView, Alert, ActivityIndicator, Platform } from "react-native";
import { router } from "expo-router";
import { styles } from "@/styles/pages/management/recetas/InsertarRecetaStyle";
import { recetasService, pacientesService } from "@/services/firebase";
import { Receta } from "@/types";
import { useAuthGuard } from "@/hooks/useAuthGuard";

/**
 * Muestra alertas informativas dependiendo de la plataforma (Web o Nativo).
 */
const alertar = (titulo: string, mensaje: string) => {
  if (Platform.OS === "web") {
    window.alert(`${titulo}\n\n${mensaje}`);
  } else {
    Alert.alert(titulo, mensaje, [{ text: "OK" }]);
  }
};

/**
 * Convierte un string de fecha (YYYY-MM-DD) a un objeto Date evitando problemas de zona horaria.
 */
const parsearFechaLocal = (fechaStr: string): Date => {
  const [year, month, day] = fechaStr.split('-').map(Number);
  return new Date(year, month - 1, day);
};

function InsertarReceta() {
  useAuthGuard();

  // --- ESTADOS ---
  const [form, setForm] = useState({
    DNI_Paciente: "",
    Num_Cartilla_Paciente: "",
    Nombre_Paciente: "",
    Nombre_Especialista: "",
    Afecciones: "",
    Medicamentos_Recetados: "",
    Direccion_Centro: "",
    Fecha_Inicio: "",
    Fecha_Expiracion: "",
  });
  const [loading, setLoading] = useState(false);
  const [pacienteValido, setPacienteValido] = useState(false);
  const [nombrePaciente, setNombrePaciente] = useState("");

  /**
   * Actualiza dinámicamente los campos del formulario.
   */
  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  /**
   * Verifica si el DNI o Nº de Cartilla existe en la base de datos de pacientes.
   */
  const handleValidarPaciente = async () => {
    console.log(`[${new Date().toISOString()}] Intentando validar paciente con: ${form.DNI_Paciente}`);
    
    if (!form.DNI_Paciente.trim()) {
      alertar("Error", "Ingresa un DNI o cartilla");
      return;
    }

    setLoading(true);
    try {
      const todosPacientes = await pacientesService.obtenerTodos();
      const paciente = todosPacientes.find(p =>
        (p.DNI || "").toUpperCase() === form.DNI_Paciente.toUpperCase() ||
        (p.Num_Cartilla || "") === form.DNI_Paciente.trim()
      );

      if (paciente) {
        console.log(`[${new Date().toISOString()}] Paciente validado con éxito: ${paciente.Nombre_Paciente}`);
        setNombrePaciente(paciente.Nombre_Paciente);
        setPacienteValido(true);
        
        // Sincronizamos el formulario con los datos oficiales del paciente encontrado
        handleChange("DNI_Paciente", paciente.DNI);
        handleChange("Num_Cartilla_Paciente", paciente.Num_Cartilla ?? "");
        handleChange("Nombre_Paciente", paciente.Nombre_Paciente);
      } else {
        console.warn(`[${new Date().toISOString()}] Paciente no encontrado.`);
        alertar("Error", "El paciente no está registrado en el sistema");
        setPacienteValido(false);
        setNombrePaciente("");
      }
    } catch (error: any) {
      console.error(`[${new Date().toISOString()}] Error al validar paciente:`, error);
      alertar("Error", error.message || "Error al validar paciente");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Realiza las validaciones de formato de fecha.
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

  /**
   * Realiza las validaciones del formulario.
   */
  const validarFormulario = (): string | null => {
    if (!pacienteValido) return "Debes validar un paciente primero";
    if (!form.Nombre_Especialista.trim()) return "Nombre del especialista es requerido";
    if (!form.Afecciones.trim()) return "Afecciones es requerido";
    if (!form.Medicamentos_Recetados.trim()) return "Medicamentos recetados es requerido";
    if (!form.Direccion_Centro.trim()) return "Dirección del centro es requerida";

    if (!validarFechaReal(form.Fecha_Inicio))
        return "Fecha de inicio inválida. Verifica el mes (1-12) y el día según el mes.";
    if (!validarFechaReal(form.Fecha_Expiracion))
        return "Fecha de expiración inválida. Verifica el mes (1-12) y el día según el mes.";

    if (new Date(form.Fecha_Expiracion) <= new Date(form.Fecha_Inicio))
        return "La fecha de expiración debe ser posterior a la fecha de inicio";

    return null;
  };

  /**
   * Procesa el guardado de la nueva receta en el servicio de Firebase.
   */
    const [errorMedicamentos, setErrorMedicamentos] = useState<string[]>([]);
    
    const handleGuardar = async () => {
      const validacionError = validarFormulario();
      if (validacionError) {
        console.warn(`[${new Date().toISOString()}] Validación de formulario fallida: ${validacionError}`);
        alertar("Error", validacionError);
        return;
      }

      console.log(`[${new Date().toISOString()}] Iniciando creación de receta para paciente: ${form.Nombre_Paciente}`);
      setLoading(true);

      try {
        // ── Validar que los medicamentos escritos existen en el catálogo
        const medicamentosEscritos = form.Medicamentos_Recetados
          .split(',')
          .map(n => n.trim().toLowerCase())
          .filter(Boolean);

        const { medicamentosService } = await import('@/services/supabase/medicamentos');
        const todosMeds = await medicamentosService.obtenerConReceta();
        const nombresValidos = todosMeds.map((m: any) => (m.Nombre ?? m.nombre ?? "").toLowerCase().trim());

        const noExisten = medicamentosEscritos.filter(n => !nombresValidos.includes(n));

        if (noExisten.length > 0) {
          setErrorMedicamentos(noExisten);
          setLoading(false);
          return;
        }

        setErrorMedicamentos([]);

        // ── Crear la receta si todos los medicamentos son válidos
        const nuevaReceta: Omit<Receta, 'ID_Receta'> = {
          DNI_Paciente: form.DNI_Paciente.toUpperCase(),
          Num_Cartilla_Paciente: form.Num_Cartilla_Paciente,
          Nombre_Paciente: form.Nombre_Paciente,
          Nombre_Especialista: form.Nombre_Especialista,
          Afecciones: form.Afecciones,
          Medicamentos_Recetados: form.Medicamentos_Recetados,
          Direccion_Centro: form.Direccion_Centro,
          Fecha_Inicio: parsearFechaLocal(form.Fecha_Inicio),
          Fecha_Expiracion: parsearFechaLocal(form.Fecha_Expiracion),
          Activa: true,
        };

        const idReceta = await recetasService.crearReceta(nuevaReceta);
        console.log(`[${new Date().toISOString()}] Receta creada exitosamente con ID: ${idReceta}`);
        alertar("Éxito", `Receta ${idReceta} creada correctamente.`);
        limpiarFormulario();
      } catch (error: any) {
        console.error(`[${new Date().toISOString()}] Error al guardar receta:`, error);
        alertar("Error", error.message || "No se pudo guardar la receta");
      } finally {
        setLoading(false);
      }
  };

  /**
   * Limpia todos los campos y resetea la validación del paciente.
   */
  const limpiarFormulario = () => {
    console.log(`[${new Date().toISOString()}] Limpiando formulario.`);
    setForm({
      DNI_Paciente: "",
      Num_Cartilla_Paciente: "",
      Nombre_Paciente: "",
      Nombre_Especialista: "",
      Afecciones: "",
      Medicamentos_Recetados: "",
      Direccion_Centro: "",
      Fecha_Inicio: "",
      Fecha_Expiracion: "",
    });
    setPacienteValido(false);
    setNombrePaciente("");
  };

  /**
   * Regresa a la pantalla principal de pedidos.
   */
  const volver = () => {
    console.log(`[${new Date().toISOString()}] Navegando de vuelta a MostrarPedidos.`);
    router.push("/pages/management/pedidos/MostrarPedidos");
  };

  return (
    <ScrollView style={styles.outerScroll} contentContainerStyle={styles.outerScrollContent}>
      <View style={styles.container}>
        <Text style={styles.title}>Crear Receta</Text>

        <View style={styles.formContainer}>
          {/* SECCIÓN DE IDENTIFICACIÓN DEL PACIENTE */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>DNI o Nº Cartilla del Paciente:</Text>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="DNI o Cartilla"
                placeholderTextColor="#999"
                value={form.DNI_Paciente}
                onChangeText={(v) => {
                  handleChange("DNI_Paciente", v);
                  setPacienteValido(false);
                  setNombrePaciente("");
                }}
                editable={!loading}
                autoCapitalize="characters"
              />
              <Pressable
                style={[styles.button, { width: 120, paddingVertical: 12 }, loading && { opacity: 0.5 }]}
                onPress={handleValidarPaciente}
                disabled={loading}
              >
                <Text style={styles.buttonText}>{loading ? "..." : "Validar"}</Text>
              </Pressable>
            </View>
          </View>

          {/* INDICADOR DE PACIENTE VALIDADO */}
          {pacienteValido && (
            <View style={{ backgroundColor: "#E8F5E9", borderLeftColor: "#4CAF50", borderLeftWidth: 4, padding: 12, borderRadius: 6, marginBottom: 16 }}>
              <Text style={{ color: "#2E7D32", fontWeight: 'bold' }}>✓ Paciente: {nombrePaciente}</Text>
              <Text style={{ color: "#2E7D32", marginTop: 4 }}>DNI: {form.DNI_Paciente}</Text>
              <Text style={{ color: "#2E7D32", marginTop: 2 }}>Cartilla: {form.Num_Cartilla_Paciente}</Text>
            </View>
          )}

          {/* BLOQUE DE DATOS DE LA RECETA (Solo visible si el paciente es válido) */}
          {pacienteValido && (
            <>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Nombre del Especialista:</Text>
                <TextInput style={styles.input} placeholder="Ej: Dr. García" value={form.Nombre_Especialista} onChangeText={(v) => handleChange("Nombre_Especialista", v)} editable={!loading} />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Afecciones:</Text>
                <TextInput style={[styles.input, styles.textArea]} placeholder="Ej: Hipertensión, diabetes..." value={form.Afecciones} onChangeText={(v) => handleChange("Afecciones", v)} multiline numberOfLines={3} editable={!loading} />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Medicamentos Recetados:</Text>
                <TextInput
                  style={[
                    styles.input,
                    styles.textArea,
                    errorMedicamentos.length > 0 && { borderColor: '#ff2b1c' }
                  ]}
                  placeholder="Ej: Amoxicilina 500mg, Tramadol 50mg..."
                  value={form.Medicamentos_Recetados}
                  onChangeText={(v) => {
                    handleChange("Medicamentos_Recetados", v);
                    setErrorMedicamentos([]);
                  }}
                  multiline
                  numberOfLines={3}
                  editable={!loading}
                />
                {errorMedicamentos.length > 0 && (
                  <View style={{ marginTop: 6 }}>
                    <Text style={{ color: '#ff2b1c', fontWeight: 'bold', marginBottom: 4 }}>
                      Medicamento(s) no encontrado(s):
                    </Text>
                    {errorMedicamentos.map((nombre, i) => (
                      <Text key={i} style={{ color: '#ff2b1c', fontSize: 13 }}>• {nombre}</Text>
                    ))}
                    <Text style={{ color: '#ff2b1c', fontSize: 12, marginTop: 4, fontStyle: 'italic' }}>
                      No existe ese medicamento. Por favor, consulta el catálogo.
                    </Text>
                  </View>
                )}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Dirección del Centro:</Text>
                <TextInput style={styles.input} placeholder="Dirección" value={form.Direccion_Centro} onChangeText={(v) => handleChange("Direccion_Centro", v)} editable={!loading} />
              </View>

              <View style={{ flexDirection: 'row', gap: 10 }}>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.label}>Fecha Inicio:</Text>
                  <TextInput style={styles.input} placeholder="YYYY-MM-DD" value={form.Fecha_Inicio} onChangeText={(v) => handleChange("Fecha_Inicio", v)} editable={!loading} />
                </View>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.label}>Fecha Expiración:</Text>
                  <TextInput style={styles.input} placeholder="YYYY-MM-DD" value={form.Fecha_Expiracion} onChangeText={(v) => handleChange("Fecha_Expiracion", v)} editable={!loading} />
                </View>
              </View>

              {loading && (
                <View style={{ alignItems: 'center', marginVertical: 20 }}>
                  <ActivityIndicator size="large" color="#2196F3" />
                  <Text style={{ marginTop: 10, color: '#666' }}>Guardando receta...</Text>
                </View>
              )}

              <View style={styles.botonesContainer}>
                <Pressable style={[styles.button, styles.buttonInsert, loading && { opacity: 0.5 }]} onPress={handleGuardar} disabled={loading}>
                  <Text style={styles.buttonText}>{loading ? "GUARDANDO..." : "GUARDAR RECETA"}</Text>
                </Pressable>
                <Pressable style={[styles.button, { backgroundColor: "#FFA500" }]} onPress={limpiarFormulario} disabled={loading}>
                  <Text style={styles.buttonText}>LIMPIAR CAMPOS</Text>
                </Pressable>
                <Pressable style={[styles.button]} onPress={volver} disabled={loading}>
                  <Text style={styles.buttonText}>VOLVER</Text>
                </Pressable>
              </View>
            </>
          )}

          {/* ESTADO INICIAL: ESPERANDO VALIDACIÓN */}
          {!pacienteValido && (
            <>
              <View style={{ backgroundColor: "#F3E5F5", borderLeftColor: "#9C27B0", borderLeftWidth: 4, padding: 16, borderRadius: 6, marginVertical: 20, alignItems: 'center' }}>
                <Text style={{ color: "#6A1B9A", textAlign: 'center', fontWeight: 'bold' }}>Ingresa el DNI o cartilla y valida el paciente para continuar</Text>
              </View>
              <Pressable style={[styles.button]} onPress={volver}>
                <Text style={styles.buttonText}>VOLVER</Text>
              </Pressable>
            </>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

export default InsertarReceta;