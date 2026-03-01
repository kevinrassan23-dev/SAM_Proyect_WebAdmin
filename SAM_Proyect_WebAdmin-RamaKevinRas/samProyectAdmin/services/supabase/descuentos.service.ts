import { supabase } from '@/config/supabaseClient';

export const descuentosService = {
  async obtenerDescuentoPaciente(tipoPaciente: string): Promise<number> {
    try {
      const { data, error } = await supabase
        .from('descuentos')
        .select('Porcentaje')
        .eq('Tipo_Paciente', tipoPaciente)
        .single();

      if (error) {
        console.warn('No se encontró descuento para:', tipoPaciente);
        return 0;
      }

      return data?.Porcentaje || 0;
    } catch (error) {
      console.error('Error al obtener descuento:', error);
      return 0;
    }
  },

  async obtenerTodos(): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('descuentos')
        .select('*');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error al obtener descuentos:', error);
      throw error;
    }
  }
};