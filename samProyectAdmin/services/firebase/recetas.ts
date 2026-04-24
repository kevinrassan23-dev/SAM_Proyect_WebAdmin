import { db } from '@/config/firebaseConfig';
import { collection, getDocs, doc, setDoc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { Receta } from '@/types';

const COLLECTION = 'RECETAS';

/**
 * Servicio para la gestión de recetas médicas en Firestore.
 * Maneja la lógica de duplicados por fecha y generación de IDs secuenciales.
 */
export const recetasService = {

  /**
   * Registra una nueva receta.
   * Valida duplicidad (mismo paciente, especialista y fecha) y asigna un ID formato REC-00X.
   */
  async crearReceta(receta: Omit<Receta, 'ID_Receta'>): Promise<string> {
    try {
      console.log(`[${new Date().toLocaleTimeString()}] Iniciando creación de receta para DNI: ${receta.DNI_Paciente}`);
      
      const snapshot = await getDocs(collection(db, COLLECTION));

      // Validación de duplicados: evita recetas idénticas el mismo día para el mismo especialista
      for (const document of snapshot.docs) {
        const data = document.data();
        const fechaInicioExistente = data.Fecha_Inicio?.toDate?.()?.toISOString().split('T')[0];
        const fechaInicioNueva = receta.Fecha_Inicio instanceof Date
          ? receta.Fecha_Inicio.toISOString().split('T')[0]
          : new Date(receta.Fecha_Inicio).toISOString().split('T')[0];

        if (
          data.DNI_Paciente === receta.DNI_Paciente &&
          data.Nombre_Especialista === receta.Nombre_Especialista &&
          fechaInicioExistente === fechaInicioNueva
        ) {
          throw new Error("Ya existe una receta para este paciente con el mismo especialista y fecha de inicio.");
        }
      }

      // Generación de ID secuencial con padding (001, 002...)
      const nextNum = snapshot.size + 1;
      const docId = `REC-${String(nextNum).padStart(3, '0')}`;

      const nuevoRegistro = {
        ID_Receta: docId,
        ...receta,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await setDoc(doc(db, COLLECTION, docId), nuevoRegistro);
      console.log(`[${new Date().toLocaleTimeString()}] Receta ${docId} creada exitosamente.`);
      
      return docId;
    } catch (error: any) {
      console.error(`[${new Date().toLocaleTimeString()}] ❌ Error al guardar receta: ${error.message}`);
      throw error;
    }
  },

  /**
   * Recupera el listado completo de recetas existentes.
   */
  async obtenerTodas(): Promise<Receta[]> {
    try {
      console.log(`[${new Date().toLocaleTimeString()}] Obteniendo listado global de recetas`);
      const snapshot = await getDocs(collection(db, COLLECTION));
      return snapshot.docs.map(doc => doc.data() as Receta);
    } catch (error: any) {
      console.error(`[${new Date().toLocaleTimeString()}] ❌ Error al obtener recetas: ${error.message}`);
      return [];
    }
  },

  /**
   * Filtra y devuelve las recetas asociadas a un DNI de paciente concreto.
   */
  async obtenerPorDNIPaciente(dni: string): Promise<Receta[]> {
    try {
      console.log(`[${new Date().toLocaleTimeString()}] Filtrando recetas por DNI Paciente: ${dni}`);
      const q = query(collection(db, COLLECTION), where('DNI_Paciente', '==', dni));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => doc.data() as Receta);
    } catch (error: any) {
      console.error(`[${new Date().toLocaleTimeString()}] ❌ Error al filtrar por DNI: ${error.message}`);
      return [];
    }
  },

  /**
   * Actualiza campos específicos de una receta mediante su ID_Receta.
   */
  async actualizarReceta(idReceta: string, actualizaciones: Partial<Receta>): Promise<void> {
    try {
      console.log(`[${new Date().toLocaleTimeString()}] Actualizando receta ID: ${idReceta}`);
      const q = query(collection(db, COLLECTION), where('ID_Receta', '==', idReceta));
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) throw new Error("Receta no encontrada");
      
      await updateDoc(snapshot.docs[0].ref, { ...actualizaciones, updatedAt: new Date() });
      console.log(`[${new Date().toLocaleTimeString()}] Receta ${idReceta} actualizada correctamente.`);
    } catch (error: any) {
      console.error(`[${new Date().toLocaleTimeString()}] ❌ Error al actualizar receta: ${error.message}`);
      throw error;
    }
  },

  /**
   * Elimina permanentemente una receta del sistema por su ID.
   */
  async eliminarReceta(idReceta: string): Promise<void> {
    try {
      console.log(`[${new Date().toLocaleTimeString()}] Solicitando eliminación de receta: ${idReceta}`);
      const q = query(collection(db, COLLECTION), where('ID_Receta', '==', idReceta));
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) throw new Error("Receta no encontrada");
      
      await deleteDoc(snapshot.docs[0].ref);
      console.log(`[${new Date().toLocaleTimeString()}] Receta ${idReceta} eliminada con éxito.`);
    } catch (error: any) {
      console.error(`[${new Date().toLocaleTimeString()}] ❌ Error al eliminar receta: ${error.message}`);
      throw error;
    }
  }
};