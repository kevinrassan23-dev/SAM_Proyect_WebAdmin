
// IMPORTAR LIBRERÍAS
import { db } from '@/config/firebaseConfig';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { Paciente } from '@/types';

export const pacientesService = {
    async obtenerPorCartilla(numCartilla: string): Promise<Paciente | null> {
        try {
        const q = query(
            collection(db, 'pacientes'),
            where('Num_Cartilla', '==', numCartilla)
        );
        const snapshot = await getDocs(q);
        
        if (snapshot.empty) return null;
        
        const docSnap = snapshot.docs[0];
        return { DNI: docSnap.id, ...docSnap.data() } as Paciente;
        } catch (error) {
        console.error('Error al obtener paciente por cartilla:', error);
        throw error;
        }
    },

    async obtenerPorDNI(dni: string): Promise<Paciente | null> {
        try {
        const docRef = doc(db, 'pacientes', dni);
        const docSnap = await getDoc(docRef);
        
        if (!docSnap.exists()) return null;
        
        return { DNI: dni, ...docSnap.data() } as Paciente;
        } catch (error) {
        console.error('Error al obtener paciente por DNI:', error);
        throw error;
        }
    },

    async obtenerTodos(): Promise<Paciente[]> {
        try {
        const snapshot = await getDocs(collection(db, 'pacientes'));
        return snapshot.docs.map(doc => ({
            DNI: doc.id,
            ...doc.data()
        })) as Paciente[];
        } catch (error) {
        console.error('Error al obtener todos los pacientes:', error);
        throw error;
        }
    },

    async obtenerTipoPaciente(dni: string): Promise<string | null> {
        try {
        const paciente = await this.obtenerPorDNI(dni);
        return paciente?.Tipo_Paciente || null;
        } catch (error) {
        console.error('Error al obtener tipo de paciente:', error);
        throw error;
        }
    }
};