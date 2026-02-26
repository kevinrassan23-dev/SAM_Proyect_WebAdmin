// IMPORTAR LIBRERÍAS
import { db } from '@/config/firebaseConfig';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { Receta } from '@/types';

export const recetasService = {
    async obtenerRecetasActivasPaciente(dni: string): Promise<Receta[]> {
        try {
        const q = query(
            collection(db, 'recetas'),
            where('DNI_Paciente', '==', dni),
            where('Activa', '==', true)
        );
        const snapshot = await getDocs(q);
        
        return snapshot.docs.map(doc => ({
            ID_Receta: doc.id,
            ...doc.data()
        })) as Receta[];
        } catch (error) {
        console.error('Error al obtener recetas activas:', error);
        throw error;
        }
    },

    async obtenerPorID(idReceta: string): Promise<Receta | null> {
        try {
        const docRef = doc(db, 'recetas', idReceta);
        const docSnap = await getDoc(docRef);
        
        if (!docSnap.exists()) return null;
        
        return { ID_Receta: idReceta, ...docSnap.data() } as Receta;
        } catch (error) {
        console.error('Error al obtener receta:', error);
        throw error;
        }
    },

    async obtenerTodas(): Promise<Receta[]> {
        try {
        const snapshot = await getDocs(collection(db, 'recetas'));
        return snapshot.docs.map(doc => ({
            ID_Receta: doc.id,
            ...doc.data()
        })) as Receta[];
        } catch (error) {
        console.error('Error al obtener todas las recetas:', error);
        throw error;
        }
    },

    async obtenerMedicamentosReceta(idReceta: string): Promise<any[]> {
        try {
        const q = query(
            collection(db, 'receta_medicamentos'),
            where('ID_Receta', '==', idReceta)
        );
        const snapshot = await getDocs(q);
        
        return snapshot.docs.map(doc => ({
            ID_Receta_Medicamento: doc.id,
            ...doc.data()
        }));
        } catch (error) {
        console.error('Error al obtener medicamentos de receta:', error);
        throw error;
        }
    }
};