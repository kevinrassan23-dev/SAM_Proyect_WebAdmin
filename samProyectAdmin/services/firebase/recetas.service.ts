import { db } from '@/config/firebaseConfig';
import { collection, addDoc, getDocs, deleteDoc, query, where, updateDoc, doc, getDoc } from 'firebase/firestore';
import { Receta } from '@/types';

const COLLECTION = 'RECETAS';

export const recetasService = {

  async crearReceta(receta: Omit<Receta, 'ID_Receta'>): Promise<string> {
    try {
      const nuevoRegistro = {
        DNI_Paciente: receta.DNI_Paciente,
        Nombre_Especialista: receta.Nombre_Especialista,
        Fecha: receta.Fecha,
        Direccion_Centro: receta.Direccion_Centro,
        Afecciones: receta.Afecciones,
        Activa: receta.Activa ?? true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const docRef = await addDoc(collection(db, COLLECTION), nuevoRegistro);
      return docRef.id;
    } catch (error: any) {
      console.error("❌ Error al guardar:", error.message);
      throw error;
    }
  },

  async obtenerRecetasPorPaciente(dni: string): Promise<Receta[]> {
    try {
      const q = query(collection(db, COLLECTION), where('DNI_Paciente', '==', dni));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(docSnap => ({
        ...docSnap.data(),
        ID_Receta: docSnap.id,
      } as Receta));
    } catch (error: any) {
      console.error("❌ Error:", error.message);
      return [];
    }
  },

  // ✅ BUSCAR POR DNI O ESPECIALISTA
  async buscarRecetas(termino: string): Promise<Receta[]> {
    try {
      const snapshot = await getDocs(collection(db, COLLECTION));
      const terminoLower = termino.toLowerCase();

      return snapshot.docs
        .map(docSnap => ({
          ...docSnap.data(),
          ID_Receta: docSnap.id,
        } as Receta))
        .filter(r =>
          r.DNI_Paciente?.toLowerCase().includes(terminoLower) ||
          r.Nombre_Especialista?.toLowerCase().includes(terminoLower)
        );
    } catch (error: any) {
      console.error("❌ Error:", error.message);
      return [];
    }
  },

  async obtenerTodas(): Promise<Receta[]> {
    try {
      const snapshot = await getDocs(collection(db, COLLECTION));
      return snapshot.docs.map(docSnap => ({
        ...docSnap.data(),
        ID_Receta: docSnap.id,
      } as Receta));
    } catch (error: any) {
      console.error("❌ Error:", error.message);
      return [];
    }
  },

  // ✅ ACTUALIZAR SOLO LOS CAMPOS EXISTENTES, SIN DUPLICAR
  async actualizarReceta(idReceta: string, actualizaciones: Partial<Receta>): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION, idReceta);
      // Solo actualizamos los campos que ya existen, sin añadir nuevos
      await updateDoc(docRef, {
        Nombre_Especialista: actualizaciones.Nombre_Especialista,
        Afecciones: actualizaciones.Afecciones,
        Direccion_Centro: actualizaciones.Direccion_Centro,
        Fecha: actualizaciones.Fecha,
        updatedAt: new Date(),
      });
    } catch (error: any) {
      console.error("❌ Error al actualizar:", error.message);
      throw error;
    }
  },

  async eliminarReceta(idReceta: string): Promise<void> {
    try {
      await deleteDoc(doc(db, COLLECTION, idReceta));
    } catch (error: any) {
      console.error("❌ Error al eliminar:", error.message);
      throw error;
    }
  }
};