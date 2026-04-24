import { supabase } from '@/config/supabaseClient';
import { Transaccion } from '@/types';

/**
 * Servicio para la gestión y consulta de transacciones de pedidos.
 */
export const pedidosService = {

  /**
   * Recupera las últimas 200 transacciones ordenadas de forma descendente por fecha.
   */
  async obtenerTransacciones(): Promise<Transaccion[]> {
    try {
      console.log(`[${new Date().toLocaleTimeString()}] Consultando últimas transacciones`);
      const { data, error } = await supabase
        .from('transacciones')
        .select('*')
        .order('fecha_inicio', { ascending: false })
        .limit(200);

      if (error) throw error;
      
      console.log(`[${new Date().toLocaleTimeString()}] Se han recuperado ${data?.length || 0} transacciones.`);
      return (data ?? []) as Transaccion[];
    } catch (error: any) {
      console.error(`[${new Date().toLocaleTimeString()}] ❌ Error al obtener transacciones: ${error.message}`);
      throw error;
    }
  },
};