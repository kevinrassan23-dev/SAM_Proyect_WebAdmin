import React, { useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView, Alert, ActivityIndicator, Platform } from "react-native";
import { router } from "expo-router";
import { styles } from "@/styles/pages/management/medicamentos/ActualizarMedicamentoStyle";
import { medicamentosService } from "@/services/supabase/medicamentos";
import { Medicamento } from "@/types/medicamento";
import { useAuthGuard } from "@/hooks/useAuthGuard";

/**
 * Muestra un diálogo de confirmación según la plataforma.
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
 * Muestra una alerta informativa según la plataforma.
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
 * Sanitiza la entrada de precio permitiendo solo números y un punto decimal.
 */
const formatearPrecio = (valor: string): string => {
  const limpio = valor.replace(/[^0-9.]/g, "");
  const partes = limpio.split(".");
  if (partes.length > 2) return partes[0] + "." + partes[1];
  return limpio;
};

function ActualizarMedicamento() {
  useAuthGuard();

  // --- ESTADOS DE FLUJO Y UI ---
  const [fase, setFase] = useState<'buscar' | 'lista' | 'editar'>('buscar');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [busquedaTermino, setBusquedaTermino] = useState("");
  const [resultados, setResultados] = useState<Medicamento[]>([]);
  const [medOriginal, setMedOriginal] = useState<Medicamento | null>(null);

  // --- ESTADOS DE FORMULARIO (CAMPOS EDITABLES) ---
  const [idMedicamento, setIdMedicamento] = useState("");
  const [nombre, setNombre] = useState("");
  const [marca, setMarca] = useState("");
  const [precio, setPrecio] = useState("");
  const [familia, setFamilia] = useState("");
  const [tipo, setTipo] = useState<'con_receta' | 'sin_receta' | null>(null);
  const [stock, setStock] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fechaEnvase, setFechaEnvase] = useState("");
  const [fechaCaducidad, setFechaCaducidad] = useState("");

  /**
   * Busca medicamentos por diversos criterios (ID, Nombre, Marca, Familia).
   */
  const handleBuscar = async () => {
    console.log(`[${new Date().toISOString()}] Iniciando búsqueda: "${busquedaTermino}"`);
    
    if (busquedaTermino.trim() === "") {
      setError("Ingresa un ID, nombre, marca o familia");
      return;
    }
    setLoading(true);
    setError("");
    setResultados([]);

    try {
      const todos = await medicamentosService.obtenerTodos();
      const termino = busquedaTermino.trim().toUpperCase();

      const encontrados = todos.filter(m => {
        if (!m) return false;
        return (
          (m.ID_Medicamento ?? "").toUpperCase().includes(termino) ||
          (m.Nombre ?? "").toUpperCase().includes(termino) ||
          (m.Marca ?? "").toUpperCase().includes(termino) ||
          (m.Familia ?? "").toUpperCase().includes(termino)
        );
      });

      if (encontrados.length === 0) {
        console.warn(`[${new Date().toISOString()}] No se hallaron resultados para: ${termino}`);
        setError("No se encontraron medicamentos");
      } else if (encontrados.length === 1) {
        console.log(`[${new Date().toISOString()}] Resultado único hallado. Cargando edición.`);
        seleccionarMedicamento(encontrados[0]);
      } else {
        console.log(`[${new Date().toISOString()}] Múltiples resultados (${encontrados.length}). Mostrando lista.`);
        setResultados(encontrados);
        setFase('lista');
      }
    } catch (err: any) {
      console.error(`[${new Date().toISOString()}] Error en handleBuscar:`, err);
      setError(err.message || "Error al buscar");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Establece el medicamento seleccionado para entrar en fase de edición.
   */
  const seleccionarMedicamento = (med: Medicamento) => {
    console.log(`[${new Date().toISOString()}] Medicamento seleccionado: ${med.ID_Medicamento}`);
    setMedOriginal(med);
    cargarDatosFormulario(med);
    setFase('editar');
  };

  /**
   * Mapea los datos del objeto Medicamento a los estados del formulario.
   */
  const cargarDatosFormulario = (med: Medicamento) => {
    setIdMedicamento(med.ID_Medicamento ?? "");
    setNombre(med.Nombre ?? "");
    setMarca(med.Marca ?? "");
    setPrecio(typeof med.Precio === 'number' ? med.Precio.toFixed(2) : "");
    setStock(med.Stock !== null && med.Stock !== undefined ? med.Stock.toString() : "");
    setFamilia(med.Familia ?? "");
    setDescripcion(med.Descripcion ?? "");

    const tipoValido = (med.Tipo === 'con_receta' || med.Tipo === 'sin_receta') ? med.Tipo : null;
    setTipo(tipoValido);

    const formatearFechaParaInput = (fecha: any): string => {
      if (!fecha) return "";
      if (fecha instanceof Date) return fecha.toISOString().split('T')[0];
      return String(fecha);
    };

    setFechaEnvase(formatearFechaParaInput(med.Fecha_Envase));
    setFechaCaducidad(formatearFechaParaInput(med.Fecha_Caducidad));
  };

  /**
   * Valida las reglas de negocio antes de enviar la actualización.
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
      if (!nombre.trim()) return "Nombre es requerido";
      if (!marca.trim()) return "Marca es requerida";
      if (!precio.trim() || isNaN(parseFloat(precio))) return "Precio válido es requerido";
      if (!familia.trim()) return "Familia es requerida";
      if (!tipo) return "Debes seleccionar el tipo";
      if (!stock.trim() || isNaN(parseInt(stock))) return "Stock válido es requerido";

      if (fechaEnvase && !validarFechaReal(fechaEnvase))
          return "Fecha de envase inválida. Verifica el mes (1-12) y el día según el mes.";
      if (fechaCaducidad && !validarFechaReal(fechaCaducidad))
          return "Fecha de caducidad inválida. Verifica el mes (1-12) y el día según el mes.";

      if (fechaEnvase && fechaCaducidad && new Date(fechaCaducidad) <= new Date(fechaEnvase))
          return "La fecha de caducidad debe ser posterior a la de envase";

      return null;
  };

  /**
   * Lógica final de persistencia de datos.
   */
  const [errorFamilia, setErrorFamilia] = useState("");

  const ejecutarActualizar = async () => {
    const validacionError = validarFormulario();
    if (validacionError) {
        console.warn(`[${new Date().toISOString()}] Validación fallida: ${validacionError}`);
        setError(validacionError);
        return;
    }

    console.log(`[${new Date().toISOString()}] Enviando actualización para ID: ${idMedicamento}`);
    setLoading(true);
    setError("");

    try {
        // ── Validar que la familia existe en el catálogo
        const familias = await medicamentosService.obtenerFamilias();
        const familiasValidas = familias.map((f: string) => f.toLowerCase().trim());

        if (!familiasValidas.includes(familia.toLowerCase().trim())) {
            setErrorFamilia(
                `La familia "${familia}" no existe en el catálogo. ` +
                `Por favor, consulte el catálogo de familias ${tipo === 'con_receta' ? 'con receta' : 'sin receta'}.`
            );
            setLoading(false);
            return;
        }
        setErrorFamilia("");

        const fechaEnvaseDate = fechaEnvase ? new Date(fechaEnvase) : undefined;
        const fechaCaducidadDate = fechaCaducidad ? new Date(fechaCaducidad) : undefined;

        await medicamentosService.actualizarMedicamento(idMedicamento, {
            Nombre: nombre,
            Marca: marca,
            Precio: parseFloat(parseFloat(precio).toFixed(2)),
            Familia: familia,
            Tipo: tipo!,
            Stock: parseInt(stock),
            Descripcion: descripcion,
            Fecha_Envase: fechaEnvaseDate,
            Fecha_Caducidad: fechaCaducidadDate,
        });

        console.log(`[${new Date().toISOString()}] Medicamento ${idMedicamento} actualizado con éxito.`);
        alertar("Éxito", "Medicamento actualizado correctamente.", resetear);
    } catch (err: any) {
        console.error(`[${new Date().toISOString()}] Error en actualizarMedicamento:`, err);
        setError(err.message || "Error al actualizar medicamento");
    } finally {
        setLoading(false);
    }
  };

  /**
   * Handler previo a la actualización que solicita confirmación del usuario.
   */
  const handleActualizar = () => {
    confirmar("¿Estás seguro de que deseas actualizar este medicamento?", ejecutarActualizar);
  };

  /**
   * Limpia todos los estados y regresa a la fase de búsqueda inicial.
   */
  const resetear = () => {
    console.log(`[${new Date().toISOString()}] Reseteando formulario y volviendo a búsqueda.`);
    setBusquedaTermino("");
    setIdMedicamento("");
    setNombre("");
    setMarca("");
    setPrecio("");
    setFamilia("");
    setTipo(null);
    setStock("");
    setDescripcion("");
    setFechaEnvase("");
    setFechaCaducidad("");
    setMedOriginal(null);
    setResultados([]);
    setError("");
    setFase('buscar');
  };

  /**
   * Navega de vuelta a la vista de gestión de pedidos.
   */
  const volver = () => {
    console.log(`[${new Date().toISOString()}] Volviendo a MostrarPedidos.`);
    router.push("/pages/management/pedidos/MostrarPedidos");
  };

  return (
    <ScrollView style={styles.outerScroll} contentContainerStyle={styles.outerScrollContent}>
      <View style={styles.container}>
        <Text style={styles.title}>Actualizar Medicamento</Text>

        <View style={styles.formContainer}>
          {error !== "" && (
            <View style={{ backgroundColor: "#FFE6E6", padding: 12, borderRadius: 6, marginBottom: 16 }}>
              <Text style={{ color: "#FF6B6B", fontWeight: "bold" }}>{error}</Text>
            </View>
          )}

          {/* FASE 1: BÚSQUEDA */}
          {fase === 'buscar' && (
            <View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>ID, Nombre, Marca o Familia:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ej: MED-001 o Paracetamol"
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

          {/* FASE 2: LISTA DE RESULTADOS */}
          {fase === 'lista' && (
            <View>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#2196F3', marginBottom: 12 }}>
                {`Se encontraron ${resultados.length} medicamentos — selecciona uno:`}
              </Text>

              {resultados.map((m, index) => (
                <Pressable
                  key={m.ID_Medicamento ?? `med-${index}`}
                  onPress={() => seleccionarMedicamento(m)}
                  style={{ backgroundColor: "#F0F8FF", borderWidth: 1, borderColor: "#2196F3", borderRadius: 8, padding: 12, marginBottom: 10 }}
                >
                  <Text style={{ fontWeight: 'bold', color: '#2196F3' }}>{m.ID_Medicamento}</Text>
                  <Text>Nombre: {m.Nombre}</Text>
                  <Text>Marca: {m.Marca}</Text>
                  <Text>Familia: {m.Familia}</Text>
                  <Text>Precio: €{m.Precio?.toFixed(2)}</Text>
                </Pressable>
              ))}

              <Pressable style={[styles.button, styles.buttonCancel]} onPress={resetear}>
                <Text style={styles.buttonText}>NUEVA BÚSQUEDA</Text>
              </Pressable>
            </View>
          )}

          {/* FASE 3: ACTUALIZACIÓN DEL MEDICAMENTO*/}
          {fase === 'editar' && (
            <View>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#2196F3', marginBottom: 16 }}>
                ✓ Editando medicamento {idMedicamento}
              </Text>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>ID Medicamento:</Text>
                <TextInput style={[styles.input, styles.inputReadonly]} value={idMedicamento} editable={false} />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Nombre:</Text>
                <TextInput style={styles.input} value={nombre} onChangeText={setNombre} editable={!loading} />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Marca:</Text>
                <TextInput style={styles.input} value={marca} onChangeText={setMarca} editable={!loading} />
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
                    value={precio}
                    onChangeText={v => setPrecio(formatearPrecio(v))}
                    onBlur={() => { if (precio) setPrecio(parseFloat(precio).toFixed(2)); }}
                    editable={!loading}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Familia:</Text>
                <TextInput
                    style={[
                        styles.input,
                        errorFamilia !== "" && { borderColor: '#ff2b1c' }
                    ]}
                    value={familia}
                    onChangeText={(v) => {
                        setFamilia(v);
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
                <TextInput style={styles.input} keyboardType="numeric" value={stock} onChangeText={v => setStock(v.replace(/[^0-9]/g, ""))} editable={!loading} />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Descripción (opcional):</Text>
                <TextInput style={[styles.input, styles.textArea]} multiline numberOfLines={3} value={descripcion} onChangeText={setDescripcion} editable={!loading} />
              </View>

              <View style={{ flexDirection: 'row', gap: 10 }}>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.label}>Fecha Envase:</Text>
                  <TextInput style={styles.input} placeholder="YYYY-MM-DD" value={fechaEnvase} onChangeText={setFechaEnvase} editable={!loading} />
                </View>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.label}>Fecha Caducidad:</Text>
                  <TextInput style={styles.input} placeholder="YYYY-MM-DD" value={fechaCaducidad} onChangeText={setFechaCaducidad} editable={!loading} />
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
                      ✓ {tipo === 'con_receta' ? 'Con Receta' : 'Sin Receta'}
                    </Text>
                  </View>
                )}
              </View>

              {loading && (
                <View style={{ alignItems: 'center', marginVertical: 20 }}>
                  <ActivityIndicator size="large" color="#2196F3" />
                  <Text style={{ marginTop: 10, color: '#666' }}>Guardando cambios...</Text>
                </View>
              )}

              <View style={styles.botonesContainer}>
                <Pressable
                  style={[styles.button, styles.buttonUpdate, loading && { opacity: 0.5 }]}
                  onPress={handleActualizar}
                  disabled={loading}
                >
                  <Text style={styles.buttonText}>{loading ? "GUARDANDO..." : "GUARDAR CAMBIOS"}</Text>
                </Pressable>

                <Pressable
                  style={[styles.button, styles.buttonCancel]}
                  onPress={() => { if (medOriginal) cargarDatosFormulario(medOriginal); setError(""); }}
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

export default ActualizarMedicamento;