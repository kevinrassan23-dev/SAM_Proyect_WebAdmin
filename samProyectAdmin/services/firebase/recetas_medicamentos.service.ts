import { db } from '@/config/firebaseConfig';
import { doc, setDoc, getDoc, collection, getDocs, deleteDoc, query, where, addDoc } from 'firebase/firestore';

const COLLECTION = 'RECETAS_MEDICAMENTOS';

export const recetaMedicamentosService = {

    // ✅ AGREGAR MEDICAMENTO A UNA RECETA
    async agregarMedicamentoAReceta(
        idReceta: string,
        idMedicamento: string,
        dosis: string,
        duracion: string,
        fechaCaducidad: string
    ): Promise<string> {
        try {
            console.log("📝 Agregando medicamento a receta:", idReceta);
            
            const docRef = await addDoc(collection(db, COLLECTION), {
                ID_Receta: idReceta,
                ID_Medicamento: idMedicamento,
                Dosis: dosis,
                Duracion: duracion,
                Fecha_Caducidad: fechaCaducidad,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            
            console.log("✅ Medicamento agregado a receta");
            return docRef.id;
            
        } catch (error: any) {
            console.error("❌ Error al agregar medicamento:", error.message);
            throw error;
        }
    },

    // ✅ OBTENER MEDICAMENTOS DE UNA RECETA
    async obtenerMedicamentosPorReceta(idReceta: string): Promise<any[]> {
        try {
            console.log("📖 Obteniendo medicamentos de receta:", idReceta);
            
            const q = query(collection(db, COLLECTION), where('ID_Receta', '==', idReceta));
            const snapshot = await getDocs(q);
            
            const medicamentos = snapshot.docs.map(doc => ({
                ID_Receta_Medicamento: doc.id,
                ...doc.data()
            }));
            
            console.log("✅ Medicamentos obtenidos:", medicamentos.length);
            return medicamentos;
            
        } catch (error: any) {
            console.error("❌ Error al obtener medicamentos:", error.message);
            return [];
        }
    },

    // ✅ OBTENER TODOS LOS REGISTROS
    async obtenerTodos(): Promise<any[]> {
        try {
            console.log("📖 Obteniendo todas las relaciones...");
            
            const snapshot = await getDocs(collection(db, COLLECTION));
            const registros = snapshot.docs.map(doc => ({
                ID_Receta_Medicamento: doc.id,
                ...doc.data()
            }));
            
            console.log("✅ Total de registros:", registros.length);
            return registros;
            
        } catch (error: any) {
            console.error("❌ Error al obtener registros:", error.message);
            return [];
        }
    },

    // ✅ ELIMINAR MEDICAMENTO DE RECETA
    async eliminarMedicamentoDeReceta(idRecetaMedicamento: string): Promise<void> {
        try {
            console.log("🗑️ Eliminando relación:", idRecetaMedicamento);
            
            const docRef = doc(db, COLLECTION, idRecetaMedicamento);
            await deleteDoc(docRef);
            
            console.log("✅ Relación eliminada correctamente");
            
        } catch (error: any) {
            console.error("❌ Error al eliminar:", error.message);
            throw error;
        }
    },

    // ✅ ACTUALIZAR MEDICAMENTO EN RECETA
    async actualizarMedicamentoEnReceta(
        idRecetaMedicamento: string,
        actualizaciones: any
    ): Promise<void> {
        try {
            console.log("📝 Actualizando medicamento en receta:", idRecetaMedicamento);
            
            const docRef = doc(db, COLLECTION, idRecetaMedicamento);
            
            await setDoc(docRef, {
                ...actualizaciones,
                updatedAt: new Date(),
            }, { merge: true });
            
            console.log("✅ Medicamento actualizado correctamente");
            
        } catch (error: any) {
            console.error("❌ Error al actualizar:", error.message);
            throw error;
        }
    }
};