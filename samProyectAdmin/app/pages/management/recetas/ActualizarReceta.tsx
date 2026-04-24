import React, { useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView, Alert, ActivityIndicator, Platform } from "react-native";
import { router } from "expo-router";
import { styles } from "@/styles/pages/management/recetas/ActualizarRecetaStyle";
import { recetasService } from "@/services/firebase";
import { Receta } from "@/types/receta";
import { useAuthGuard } from "@/hooks/useAuthGuard";

/**
 * Función auxiliar para gestionar diálogos de confirmación 
 * adaptados a Web (window.confirm).
 */
const confirmar = (mensaje: string, onConfirm: () => void) => {
  if (Platform.OS === "web") {
    if (window.confirm(mensaje)) onConfirm();
  } else {
    Alert.alert("Confirmar", mensaje, [
      { text: "Cancelar", style: "cancel" },
      { text: "Sí", onPress: onConfirm },
    ]);
  }
};

/**
 * Función auxiliar para mostrar alertas de información al usuario.
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
 * Convierte un string de fecha (YYYY-MM-DD) a un objeto Date de JS
 * evitando desfases de zona horaria al usar el constructor local.
 */
const parsearFechaLocal = (fechaStr: string): Date => {
  const [year, month, day] = fechaStr.split('-').map(Number);
  return new Date(year, month - 1, day);
};

function ActualizarReceta() {
  useAuthGuard();

  // --- ESTADOS DE CONTROL DE FLUJO ---
  const [fase, setFase] = useState<'buscar' | 'lista' | 'editar'>('buscar');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [busquedaTermino, setBusquedaTermino] = useState("");
  const [resultados, setResultados] = useState<Receta[]>([]);
  const [recetaOriginal, setRecetaOriginal] = useState<Receta | null>(null);

  // --- ESTADOS DE CAMPOS DEL FORMULARIO ---
  const [idReceta, setIdReceta] = useState("");
  const [dniPaciente, setDniPaciente] = useState("");
  const [cartillaPaciente, setCartillaPaciente] = useState("");
  const [nombrePaciente, setNombrePaciente] = useState("");
  const [nombreEspecialista, setNombreEspecialista] = useState("");
  const [afecciones, setAfecciones] = useState("");
  const [medicamentos, setMedicamentos] = useState("");
  const [direccionCentro, setDireccionCentro] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaExpiracion, setFechaExpiracion] = useState("");

  /**
   * Convierte objetos de fecha de Firebase (Timestamp) o Date a string YYYY-MM-DD para los Inputs.
   */
  const toDateString = (campo: any): string => {
    if (!campo) return "";
    let d: Date;
    if (campo instanceof Date) d = campo;
    else if (campo.seconds) d = new Date(campo.seconds * 1000);
    else d = new Date(campo);
    if (isNaN(d.getTime())) return "";
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  /**
   * Busca recetas basadas en el término ingresado (ID, DNI, Cartilla o Nombres).
   */
  const handleBuscar = async () => {
    console.log(`[${new Date().toISOString()}] Buscando receta para actualizar: "${busquedaTermino}"`);
    if (busquedaTermino.trim() === "") {
      setError("Ingresa un ID, DNI, cartilla o nombre de especialista");
      return;
    }
    setLoading(true);
    setError("");
    setResultados([]);

    try {
      const todas = await recetasService.obtenerTodas();
      const termino = busquedaTermino.trim().toUpperCase();

      const encontradas = todas.filter(r => {
        if (!r) return false;
        return (
          (r.ID_Receta ?? "").toUpperCase().includes(termino) ||
          (r.DNI_Paciente ?? "").toUpperCase().includes(termino) ||
          (r.Num_Cartilla_Paciente ?? "").toUpperCase().includes(termino) ||
          (r.Nombre_Especialista ?? "").toUpperCase().includes(termino) ||
          (r.Nombre_Paciente ?? "").toUpperCase().includes(termino)
        );
      });

      console.log(`[${new Date().toISOString()}] Coincidencias encontradas: ${encontradas.length}`);

      if (encontradas.length === 0) {
        setError("No se encontraron recetas");
      } else if (encontradas.length === 1) {
        // Acceso directo a edición si solo hay un resultado
        seleccionarReceta(encontradas[0]);
      } else {
        // Mostrar lista si hay múltiples coincidencias
        setResultados(encontradas);
        setFase('lista');
      }
    } catch (err: any) {
      console.error(`[${new Date().toISOString()}] Error en búsqueda:`, err);
      setError(err.message || "Error al buscar");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Prepara el formulario con los datos de la receta seleccionada.
   */
  const seleccionarReceta = (receta: Receta) => {
    console.log(`[${new Date().toISOString()}] Receta seleccionada para edición: ${receta.ID_Receta}`);
    setRecetaOriginal(receta);
    cargarDatosFormulario(receta);
    setFase('editar');
  };

  /**
   * Mapea los datos del objeto Receta a los estados locales del formulario.
   */
  const cargarDatosFormulario = (receta: Receta) => {
    setIdReceta(receta.ID_Receta ?? "");
    setDniPaciente(receta.DNI_Paciente ?? "");
    setCartillaPaciente(receta.Num_Cartilla_Paciente ?? "");
    setNombrePaciente(receta.Nombre_Paciente ?? "");
    setNombreEspecialista(receta.Nombre_Especialista ?? "");
    setAfecciones(receta.Afecciones ?? "");
    setMedicamentos(receta.Medicamentos_Recetados ?? "");
    setDireccionCentro(receta.Direccion_Centro ?? "");
    setFechaInicio(toDateString(receta.Fecha_Inicio));
    setFechaExpiracion(toDateString(receta.Fecha_Expiracion));
  };

  /**
   * Realiza validaciones de fecha y formulario antes de enviar.
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
    if (!nombreEspecialista.trim()) return "Nombre del especialista es requerido";
    if (!afecciones.trim()) return "Afecciones es requerido";
    if (!medicamentos.trim()) return "Medicamentos es requerido";
    if (!direccionCentro.trim()) return "Dirección del centro es requerida";

    if (!validarFechaReal(fechaInicio))
        return "Fecha de inicio inválida. Verifica el mes (1-12) y el día según el mes.";
    if (!validarFechaReal(fechaExpiracion))
        return "Fecha de expiración inválida. Verifica el mes (1-12) y el día según el mes.";

    if (new Date(fechaExpiracion) <= new Date(fechaInicio))
        return "La fecha de expiración debe ser posterior a la de inicio";

    return null;
  };

  /**
   * Persiste los cambios en Firebase.
   */
  const [errorMedicamentos, setErrorMedicamentos] = useState<string[]>([]);

  const ejecutarActualizar = async () => {
    const validacionError = validarFormulario();
    if (validacionError) {
        setError(validacionError);
        return;
    }

    // ── Validar que los medicamentos existen en el catálogo
    setLoading(true);
    setError("");

    try {
        const medicamentosEscritos = medicamentos
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

        await recetasService.actualizarReceta(idReceta, {
            Nombre_Especialista: nombreEspecialista,
            Afecciones: afecciones,
            Medicamentos_Recetados: medicamentos,
            Direccion_Centro: direccionCentro,
            Fecha_Inicio: parsearFechaLocal(fechaInicio),
            Fecha_Expiracion: parsearFechaLocal(fechaExpiracion),
        });

        alertar("Éxito", "Receta actualizada correctamente.", resetear);
    } catch (err: any) {
        setError(err.message || "Error al actualizar receta");
    } finally {
        setLoading(false);
    }
  };

  /**
   * Lanza el diálogo de confirmación antes de la persistencia.
   */
  const handleActualizar = () => {
    confirmar("¿Estás seguro de que deseas actualizar esta receta?", ejecutarActualizar);
  };

  /**
   * Limpia todos los estados y vuelve a la pantalla de búsqueda inicial.
   */
  const resetear = () => {
    console.log(`[${new Date().toISOString()}] Reseteando formulario de actualización.`);
    setBusquedaTermino("");
    setIdReceta("");
    setDniPaciente("");
    setCartillaPaciente("");
    setNombrePaciente("");
    setNombreEspecialista("");
    setAfecciones("");
    setMedicamentos("");
    setDireccionCentro("");
    setFechaInicio("");
    setFechaExpiracion("");
    setRecetaOriginal(null);
    setResultados([]);
    setError("");
    setFase('buscar');
  };

  /**
   * Navegación de retorno.
   */
  const volver = () => {
    console.log(`[${new Date().toISOString()}] Volviendo a la lista de pedidos.`);
    router.push("/pages/management/pedidos/MostrarPedidos");
  };

  return (
    <ScrollView style={styles.outerScroll} contentContainerStyle={styles.outerScrollContent}>
      <View style={styles.container}>
        <Text style={styles.title}>Actualizar Receta</Text>

        <View style={styles.formContainer}>
          {/* SECCIÓN DE ALERTAS DE ERROR */}
          {error !== "" && (
            <View style={{ backgroundColor: "#FFE6E6", padding: 12, borderRadius: 6, marginBottom: 16 }}>
              <Text style={{ color: "#FF6B6B", fontWeight: "bold" }}>⚠️ {error}</Text>
            </View>
          )}

          {/* FASE 1: BÚSQUEDA INICIAL */}
          {fase === 'buscar' && (
            <View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>ID Receta, DNI, Cartilla, Paciente o Especialista:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ej: REC-001 o 12345678A o Dr. García"
                  placeholderTextColor="#999"
                  value={busquedaTermino}
                  onChangeText={setBusquedaTermino}
                  editable={!loading}
                  autoCapitalize="characters"
                />
              </View>

              {loading && (
                <View style={{ alignItems: 'center', marginVertical: 20 }}>
                  <ActivityIndicator size="large" color="#2196F3" />
                  <Text style={{ marginTop: 10, color: '#666' }}>Buscando...</Text>
                </View>
              )}

              <Pressable
                style={[styles.button, styles.buttonSearch, loading && { opacity: 0.5 }]}
                onPress={handleBuscar}
                disabled={loading}
              >
                <Text style={styles.buttonText}>{loading ? "BUSCANDO..." : "BUSCAR"}</Text>
              </Pressable>
            </View>
          )}

          {/* FASE 2: SELECCIÓN DESDE LISTA DE COINCIDENCIAS */}
          {fase === 'lista' && (
            <View>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#2196F3', marginBottom: 12 }}>
                {`Se encontraron ${resultados.length} recetas — selecciona una:`}
              </Text>

              {resultados.map((r, index) => {
                const fi = toDateString(r.Fecha_Inicio);
                const fe = toDateString(r.Fecha_Expiracion);
                return (
                  <Pressable
                    key={r.ID_Receta ?? `receta-${index}`}
                    onPress={() => seleccionarReceta(r)}
                    style={{ backgroundColor: "#F0F8FF", borderWidth: 1, borderColor: "#2196F3", borderRadius: 8, padding: 12, marginBottom: 10 }}
                  >
                    <Text style={{ fontWeight: 'bold', color: '#2196F3' }}>{r.ID_Receta}</Text>
                    <Text>Paciente: {r.Nombre_Paciente ?? r.DNI_Paciente}</Text>
                    <Text>Especialista: {r.Nombre_Especialista}</Text>
                    <Text>Inicio: {fi} — Expira: {fe}</Text>
                  </Pressable>
                );
              })}

              <Pressable style={[styles.button, styles.buttonCancel]} onPress={resetear}>
                <Text style={styles.buttonText}>NUEVA BÚSQUEDA</Text>
              </Pressable>
            </View>
          )}

          {/* FASE 3: FORMULARIO DE EDICIÓN */}
          {fase === 'editar' && (
            <View>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#2196F3', marginBottom: 16 }}>
                ✓ Editando receta {idReceta}
              </Text>

              {/* DATOS DE SOLO LECTURA (Claves primarias o identidad) */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>ID Receta:</Text>
                <TextInput style={[styles.input, styles.inputReadonly]} value={idReceta} editable={false} />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Paciente:</Text>
                <TextInput style={[styles.input, styles.inputReadonly]} value={`${nombrePaciente} — ${dniPaciente}`} editable={false} />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Nº Cartilla:</Text>
                <TextInput style={[styles.input, styles.inputReadonly]} value={cartillaPaciente} editable={false} />
              </View>

              {/* CAMPOS EDITABLES POR EL GESTOR */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Nombre del Especialista:</Text>
                <TextInput style={styles.input} value={nombreEspecialista} onChangeText={setNombreEspecialista} editable={!loading} />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Afecciones:</Text>
                <TextInput style={[styles.input, styles.textArea]} value={afecciones} onChangeText={setAfecciones} multiline numberOfLines={3} editable={!loading} />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Medicamentos Recetados:</Text>
                <TextInput
                    style={[
                        styles.input,
                        styles.textArea,
                        errorMedicamentos.length > 0 && { borderColor: '#ff2b1c' }
                    ]}
                    value={medicamentos}
                    onChangeText={(v) => {
                        setMedicamentos(v);
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
                            No existe ese medicamento. Por favor, consulte el catálogo.
                        </Text>
                    </View>
                )}
            </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Dirección del Centro:</Text>
                <TextInput style={styles.input} value={direccionCentro} onChangeText={setDireccionCentro} editable={!loading} />
              </View>

              {/* GESTIÓN DE FECHAS (FORMATO TEXTO YYYY-MM-DD) */}
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.label}>Fecha Inicio:</Text>
                  <TextInput style={styles.input} placeholder="YYYY-MM-DD" value={fechaInicio} onChangeText={setFechaInicio} editable={!loading} />
                </View>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.label}>Fecha Expiración:</Text>
                  <TextInput style={styles.input} placeholder="YYYY-MM-DD" value={fechaExpiracion} onChangeText={setFechaExpiracion} editable={!loading} />
                </View>
              </View>

              {loading && (
                <View style={{ alignItems: 'center', marginVertical: 20 }}>
                  <ActivityIndicator size="large" color="#2196F3" />
                  <Text style={{ marginTop: 10, color: '#666' }}>Guardando cambios...</Text>
                </View>
              )}

              <View style={styles.botonesContainer}>
                <Pressable
                  style={[styles.button, styles.buttonSearch, loading && { opacity: 0.5 }]}
                  onPress={handleActualizar}
                  disabled={loading}
                >
                  <Text style={styles.buttonText}>{loading ? "GUARDANDO..." : "GUARDAR CAMBIOS"}</Text>
                </Pressable>

                <Pressable
                  style={[styles.button, styles.buttonCancel]}
                  onPress={() => { if (recetaOriginal) cargarDatosFormulario(recetaOriginal); setError(""); }}
                  disabled={loading}
                >
                  <Text style={styles.buttonText}>DESHACER CAMBIOS</Text>
                </Pressable>

                <Pressable
                  style={[styles.button, { backgroundColor: "#FFA500" }]}
                  onPress={resetear}
                  disabled={loading}
                >
                  <Text style={styles.buttonText}>NUEVA BÚSQUEDA</Text>
                </Pressable>
              </View>
            </View>
          )}

          {/* BOTÓN GLOBAL DE RETORNO */}
          <View style={[styles.botonesContainer, { marginTop: 10 }]}>
            <Pressable
              style={[styles.button]}
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

export default ActualizarReceta;