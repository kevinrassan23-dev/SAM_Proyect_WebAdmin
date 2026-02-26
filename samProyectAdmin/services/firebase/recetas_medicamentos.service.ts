import { db } from '@/config/firebaseConfig';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';

export const recetaMedicamentosService = {
    async validarMedicamentoEnReceta(
            dni: string,
            idMedicamento: string
        ): Promise<{ valido: boolean; idRecetaMedicamento?: string }> {
            try {
            const q = query(
                collection(db, 'receta_medicamentos'),
                where('ID_Medicamento', '==', idMedicamento)
            );
            const snapshot = await getDocs(q);
            
            if (snapshot.empty) {
                return { valido: false };
            }

            for (const docSnap of snapshot.docs) {
                const idReceta = docSnap.data().ID_Receta;
                const recetaRef = doc(db, 'recetas', idReceta);
                const recetaSnap = await getDoc(recetaRef);
                
                if (
                recetaSnap.exists() &&
                recetaSnap.data().DNI_Paciente === dni &&
                recetaSnap.data().Activa === true
                ) {
                return { 
                    valido: true, 
                    idRecetaMedicamento: docSnap.id 
                };
                }
            }

            return { valido: false };
            } catch (error) {
            console.error('Error al validar medicamento en receta:', error);
            throw error;
            }
    },

    async obtenerPorID(idRecetaMedicamento: string): Promise<any | null> {
        try {
        const docRef = doc(db, 'receta_medicamentos', idRecetaMedicamento);
        const docSnap = await getDoc(docRef);
        
        if (!docSnap.exists()) return null;
        
        return {
            ID_Receta_Medicamento: idRecetaMedicamento,
            ...docSnap.data()
        };
        } catch (error) {
        console.error('Error al obtener receta medicamento:', error);
        throw error;
        }
    },

    async obtenerTodas(): Promise<any[]> {
        try {
        const snapshot = await getDocs(collection(db, 'receta_medicamentos'));
        return snapshot.docs.map(doc => ({
            ID_Receta_Medicamento: doc.id,
            ...doc.data()
        }));
        } catch (error) {
        console.error('Error al obtener todas las recetas medicamentos:', error);
        throw error;
        }
    }
};