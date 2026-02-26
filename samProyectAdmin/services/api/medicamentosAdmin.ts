import { supabase } from '@/config/supabaseClient';
import { Medicamento } from '@/types';

export const medicamentosAdminService = {
  async crearMedicamento(medicamento: Omit<Medicamento, 'ID_Medicamento'>) {
    try {
      const { data, error } = await supabase
        .from('medicamentos')
        .insert([{ ID_Medicamento: crypto.randomUUID(), ...medicamento }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error al crear medicamento:', error);
      throw error;
    }
  },

  async actualizarMedicamento(idMedicamento: string, actualizaciones: Partial<Medicamento>) {
    try {
      const { data, error } = await supabase
        .from('medicamentos')
        .update(actualizaciones)
        .eq('ID_Medicamento', idMedicamento)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error al actualizar medicamento:', error);
      throw error;
    }
  },

  async eliminarMedicamento(idMedicamento: string) {
    try {
      const { error } = await supabase
        .from('medicamentos')
        .delete()
        .eq('ID_Medicamento', idMedicamento);

      if (error) throw error;
    } catch (error) {
      console.error('Error al eliminar medicamento:', error);
      throw error;
    }
  },

  async obtenerTodosMedicamentos() {
    try {
      const { data, error } = await supabase
        .from('medicamentos')
        .select('*')
        .order('Nombre');

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error al obtener medicamentos:', error);
      throw error;
    }
  },

  async obtenerStockBajo(umbral: number = 10) {
    try {
      const { data, error } = await supabase
        .from('medicamentos')
        .select('*')
        .lt('Stock', umbral)
        .eq('Activo', true);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error al obtener medicamentos con stock bajo:', error);
      throw error;
    }
  }
};