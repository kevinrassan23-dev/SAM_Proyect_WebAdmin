import { db } from '@/config/firebaseConfig';
import { collection, getDocs, doc, query, where, updateDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { Paciente } from '@/types';

const COLLECTION = 'PACIENTES';

/**
 * Servicio para la gestión integral de pacientes en Firestore.
 * Incluye operaciones CRUD y validaciones de duplicados.
 */
export const pacientesService = {

  /**
   * Registra un nuevo paciente generando un ID incremental (PAC-X).
   * Valida que no existan duplicados de DNI, Teléfono o Cartilla.
   */
  async crearPaciente(dni: string, paciente: Omit<Paciente, 'DNI'>): Promise<string> {
    try {
      console.log(`[${new Date().toLocaleTimeString()}] Iniciando creación de paciente: ${dni}`);
      const snapshot = await getDocs(collection(db, COLLECTION));

      // Validación de duplicados en la colección
      for (const document of snapshot.docs) {
        const data = document.data();
        if (data.DNI === dni) throw new Error("Ya existe un paciente registrado con ese DNI.");
        if (data.Num_Telefono === paciente.Num_Telefono) throw new Error("Ya existe un paciente registrado con ese teléfono.");
        if (data.Num_Cartilla === paciente.Num_Cartilla) throw new Error("Ya existe un paciente registrado con esa cartilla sanitaria.");
      }

      // Generación de ID personalizado basado en el conteo actual
      const nextNum = snapshot.size + 1;
      const docId = `PAC-${nextNum}`;

      const nuevoRegistro = {
        DNI: dni,
        Nombre_Paciente: paciente.Nombre_Paciente,
        Num_Cartilla: paciente.Num_Cartilla,
        Num_Telefono: paciente.Num_Telefono,
        Edad_Paciente: paciente.Edad_Paciente,
        Tipo_Paciente: paciente.Tipo_Paciente,
        Activo: paciente.Activo,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await setDoc(doc(db, COLLECTION, docId), nuevoRegistro);
      console.log(`[${new Date().toLocaleTimeString()}] Paciente creado con éxito. ID: ${docId}`);
      
      return docId;
    } catch (error: any) {
      console.error(`[${new Date().toLocaleTimeString()}] Error al guardar: ${error.message}`);
      throw error;
    }
  },

  /**
   * Busca un paciente específico utilizando su número de DNI.
   */
  async obtenerPorDNI(dni: string): Promise<Paciente | null> {
    try {
      console.log(`[${new Date().toLocaleTimeString()}] Buscando paciente por DNI: ${dni}`);
      const q = query(collection(db, COLLECTION), where('DNI', '==', dni));
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        console.log(`[${new Date().toLocaleTimeString()}] No se encontró paciente con DNI: ${dni}`);
        return null;
      }
      
      return snapshot.docs[0].data() as Paciente;
    } catch (error: any) {
      console.error(`[${new Date().toLocaleTimeString()}] Error al obtener por DNI: ${error.message}`);
      return null;
    }
  },

  /**
   * Busca un paciente específico utilizando su número de cartilla sanitaria.
   */
  async obtenerPorCartilla(cartilla: string): Promise<Paciente | null> {
    try {
      console.log(`[${new Date().toLocaleTimeString()}] Buscando paciente por Cartilla: ${cartilla}`);
      const q = query(collection(db, COLLECTION), where('Num_Cartilla', '==', cartilla));
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) return null;
      return snapshot.docs[0].data() as Paciente;
    } catch (error: any) {
      console.error(`[${new Date().toLocaleTimeString()}] ❌ Error al obtener por cartilla: ${error.message}`);
      return null;
    }
  },

  /**
   * Recupera la lista completa de pacientes y la ordena alfabéticamente por nombre.
   */
  async obtenerTodos(): Promise<Paciente[]> {
    try {
      console.log(`[${new Date().toLocaleTimeString()}] Obteniendo lista completa de pacientes`);
      const snapshot = await getDocs(collection(db, COLLECTION));
      const lista = snapshot.docs.map(doc => doc.data() as Paciente);
      
      return lista.sort((a, b) => a.Nombre_Paciente.localeCompare(b.Nombre_Paciente));
    } catch (error: any) {
      console.error(`[${new Date().toLocaleTimeString()}] Error al obtener todos: ${error.message}`);
      return [];
    }
  },

  /**
   * Actualiza los campos proporcionados de un paciente identificado por su DNI.
   */
  async actualizarPaciente(dni: string, actualizaciones: Partial<Paciente>): Promise<void> {
    try {
      console.log(`[${new Date().toLocaleTimeString()}] Actualizando datos del paciente: ${dni}`);
      const q = query(collection(db, COLLECTION), where('DNI', '==', dni));
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) throw new Error("Paciente no encontrado");

      const docRef = snapshot.docs[0].ref;
      await updateDoc(docRef, { ...actualizaciones, updatedAt: new Date() });
      
      console.log(`[${new Date().toLocaleTimeString()}] Actualización completada para DNI: ${dni}`);
    } catch (error: any) {
      console.error(`[${new Date().toLocaleTimeString()}] ❌ Error al actualizar: ${error.message}`);
      throw error;
    }
  },

  /**
   * Elimina el registro de un paciente de la base de datos según su DNI.
   */
  async eliminarPaciente(dni: string): Promise<void> {
    try {
      console.log(`[${new Date().toLocaleTimeString()}] Solicitud de eliminación para DNI: ${dni}`);
      const q = query(collection(db, COLLECTION), where('DNI', '==', dni));
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) throw new Error("Paciente no encontrado");
      
      await deleteDoc(snapshot.docs[0].ref);
      console.log(`[${new Date().toLocaleTimeString()}] Registro eliminado correctamente: ${dni}`);
    } catch (error: any) {
      console.error(`[${new Date().toLocaleTimeString()}] ❌ Error al eliminar: ${error.message}`);
      throw error;
    }
  }
};