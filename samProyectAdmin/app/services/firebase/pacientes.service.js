/**
 * Aquí van los métodos para obtener los datos
 * de la colección pacientes en firestore:
 * 
 * EJEMPLO: Obtenemos el ID de un paciente de la coleccion de 'PACIENTES' ->
 * 
 * export const getPacientesById = async (id) => {
 *      const doc = await db.collection('pacientes').doc(id).get();
 *      return doc.data();
 * };
 * 
 * OPERACIONES: GET, POST, PUT, DELETE, etc...
 * 
 * ¡DATOS MÍNIMOS!


import { db } from '../../config/firebaseConfig';
import { collection, doc, getDoc, getDocs, setDoc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';

 */