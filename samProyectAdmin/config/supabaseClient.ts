import { createClient } from '@supabase/supabase-js';

/**
 * UTILERÍA: Genera un timestamp actual para los logs
 */
const getTimestamp = () => new Date().toLocaleString();

// 1. CARGA DE VARIABLES DE ENTORNO
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// 2. LOGS DE DIAGNÓSTICO INICIAL
console.log(`[${getTimestamp()}] Verificando Supabase...`);
console.log(`[${getTimestamp()}] SUPABASE_URL:`, supabaseUrl); 
console.log(`[${getTimestamp()}] SUPABASE_KEY:`, supabaseKey ? ' Existe' : ' NO EXISTE'); 

// 3. VALIDACIÓN DE CONFIGURACIÓN
if (!supabaseUrl || !supabaseKey) {
  throw new Error(`[${getTimestamp()}] Faltan variables de entorno: EXPO_PUBLIC_SUPABASE_URL o EXPO_PUBLIC_SUPABASE_ANON_KEY`);
}

// 4. INICIALIZACIÓN DEL CLIENTE
export const supabase = createClient(supabaseUrl, supabaseKey);

console.log(`[${getTimestamp()}]  Supabase inicializado correctamente`);