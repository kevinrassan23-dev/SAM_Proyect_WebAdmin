// ============================================
// services/firebase/pacientes.service.ts (CORREGIDO)
// ============================================

import { db } from '@/config/firebaseConfig';
import { collection, addDoc, getDocs, doc, getDoc, deleteDoc, query, where, updateDoc } from 'firebase/firestore';
import { Paciente } from '@/types';

const COLLECTION = 'PACIENTES';

export const pacientesService = {
    
    // ✅ CREAR PACIENTE (Con contrasena_dispensador - minúscula)
    async crearPaciente(dni: string, paciente: Omit<Paciente, 'DNI'>): Promise<string> {
        try {
            console.log("📝 Creando paciente con DNI:", dni);
            
            const nuevoRegistro = {
                DNI: dni,
                Nombre_Paciente: paciente.Nombre_Paciente,
                Num_Cartilla: paciente.Num_Cartilla,
                Num_Telefono: paciente.Num_Telefono,
                Edad_Paciente: paciente.Edad_Paciente,
                Tipo_Paciente: paciente.Tipo_Paciente,
                contrasena_dispensador: paciente.contrasena_dispensador || null,
                Activo: paciente.Activo,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            
            console.log("📤 Datos a enviar a Firebase:", nuevoRegistro);
            
            const docRef = await addDoc(collection(db, COLLECTION), nuevoRegistro);
            console.log("✅ Paciente guardado con ID:", docRef.id);
            
            return docRef.id;
            
        } catch (error: any) {
            console.error("❌ Error al guardar:", error.message);
            throw error;
        }
    },

    // ✅ OBTENER PACIENTE POR DNI
    async obtenerPorDNI(dni: string): Promise<Paciente | null> {
        try {
            console.log("📖 Buscando paciente con DNI:", dni);
            
            const q = query(collection(db, COLLECTION), where('DNI', '==', dni));
            const snapshot = await getDocs(q);
            
            if (snapshot.empty) {
                console.log("❌ Paciente no encontrado");
                return null;
            }
            
            const data = snapshot.docs[0].data();
            console.log("✅ Paciente encontrado");
            return data as Paciente;
            
        } catch (error: any) {
            console.error("❌ Error al obtener:", error.message);
            return null;
        }
    },

    // ✅ OBTENER PACIENTE POR CARTILLA
    async obtenerPorCartilla(cartilla: string): Promise<Paciente | null> {
        try {
            console.log("📖 Buscando paciente con Cartilla:", cartilla);
            
            const q = query(collection(db, COLLECTION), where('Num_Cartilla', '==', cartilla));
            const snapshot = await getDocs(q);
            
            if (snapshot.empty) {
                console.log("❌ Cartilla no encontrada");
                return null;
            }
            
            const data = snapshot.docs[0].data();
            console.log("✅ Paciente encontrado por cartilla");
            return data as Paciente;
            
        } catch (error: any) {
            console.error("❌ Error al obtener:", error.message);
            return null;
        }
    },

    // ✅ OBTENER TODOS LOS PACIENTES
    async obtenerTodos(): Promise<Paciente[]> {
        try {
            console.log("📖 Obteniendo todos los pacientes...");
            
            const snapshot = await getDocs(collection(db, COLLECTION));
            const pacientes = snapshot.docs.map(doc => doc.data() as Paciente);
            
            console.log("✅ Total de pacientes obtenidos:", pacientes.length);
            return pacientes;
            
        } catch (error: any) {
            console.error("❌ Error al obtener pacientes:", error.message);
            return [];
        }
    },

    // ✅ ACTUALIZAR PACIENTE (Con contrasena_dispensador - minúscula)
    async actualizarPaciente(dni: string, actualizaciones: Partial<Paciente>): Promise<void> {
        try {
            console.log("📝 Actualizando paciente:", dni);
            
            const q = query(collection(db, COLLECTION), where('DNI', '==', dni));
            const snapshot = await getDocs(q);
            
            if (snapshot.empty) {
                throw new Error("Paciente no encontrado");
            }
            
            const docRef = snapshot.docs[0].ref;
            await updateDoc(docRef, {
                ...actualizaciones,
                updatedAt: new Date(),
            });
            
            console.log("✅ Paciente actualizado correctamente");
            
        } catch (error: any) {
            console.error("❌ Error al actualizar:", error.message);
            throw error;
        }
    },

    // ✅ ACTUALIZAR CONTRASEÑA_DISPENSADOR
    async actualizarContraseña(dni: string, nuevaContraseña: string): Promise<void> {
        try {
            console.log("🔐 Actualizando contraseña de dispensador para DNI:", dni);
            
            const q = query(collection(db, COLLECTION), where('DNI', '==', dni));
            const snapshot = await getDocs(q);
            
            if (snapshot.empty) {
                throw new Error("Paciente no encontrado");
            }
            
            const docRef = snapshot.docs[0].ref;
            await updateDoc(docRef, {
                contrasena_dispensador: nuevaContraseña,
                updatedAt: new Date(),
            });
            
            console.log("✅ Contraseña actualizada correctamente");
            
        } catch (error: any) {
            console.error("❌ Error al actualizar contraseña:", error.message);
            throw error;
        }
    },

    // ✅ ELIMINAR PACIENTE
    async eliminarPaciente(dni: string): Promise<void> {
        try {
            console.log("🗑️ Eliminando paciente:", dni);
            
            const q = query(collection(db, COLLECTION), where('DNI', '==', dni));
            const snapshot = await getDocs(q);
            
            if (snapshot.empty) {
                throw new Error("Paciente no encontrado");
            }
            
            await deleteDoc(snapshot.docs[0].ref);
            console.log("✅ Paciente eliminado correctamente");
            
        } catch (error: any) {
            console.error("❌ Error al eliminar:", error.message);
            throw error;
        }
    }
};