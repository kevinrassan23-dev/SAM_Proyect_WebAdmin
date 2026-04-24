import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

/**
 * UTILERÍA: Genera un timestamp actual para los logs
 */
const getTimestamp = () => new Date().toLocaleString();

// 1. CONFIGURACIÓN DEL PROYECTO
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

// 2. VALIDACIÓN DE VARIABLES CRÍTICAS
if (!firebaseConfig.projectId || !firebaseConfig.apiKey) {
  throw new Error(`[${getTimestamp()}] FALTAN VARIABLES DE ENTORNO EN .env.local`);
}

// 3. INICIALIZACIÓN DE SERVICIOS
const app = initializeApp(firebaseConfig);

/**
 * Exportación de la base de datos Firestore
 */
export const db = getFirestore(app);

// 4. LOGS DE ÉXITO
console.log(`[${getTimestamp()}] Firebase inicializado correctamente`);
console.log(`[${getTimestamp()}] Proyecto Firebase ID:`, firebaseConfig.projectId);