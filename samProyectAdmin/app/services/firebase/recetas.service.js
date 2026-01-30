/**
 * Aquí van los métodos para obtener los datos
 * de la coleccion recetas en firestore:
 * 
 * EJEMPLO: Obtenemos el ID de una receta de la coleccion de 'RECETAS' ->
 * 
 * export const getRecetasById = async (id) => {
 *      const doc = await db.collection('recetas').doc(id).get();
 *      return doc.data();
 * 
 * };
 * 
 * OPERACIONES: GET, POST, PUT, DELETE, etc...
 * 
 * ¡DATOS MÍNIMOS!


import { db } from '../../config/firebaseConfig';
import { collection, doc, getDoc, getDocs, setDoc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';

 */