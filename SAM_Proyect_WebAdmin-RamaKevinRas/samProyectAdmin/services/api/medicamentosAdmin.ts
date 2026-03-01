import { supabase } from '@/config/supabaseClient';
import { Medicamento } from '@/types';

export const medicamentosAdminService = {
  async crearMedicamento(medicamento: Omit<Medicamento, 'ID_Medicamento'>) {
    try {
      const { data, error } = await supabase
      //medicamentos -> Medicamentos
        .from('Medicamentos')
        .insert([{ 
          ID_Medicamento: crypto.randomUUID(), 
          ...medicamento,
          Tipo: [medicamento.Tipo]
        }])
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
      //medicamentos -> Medicamentos
        .from('Medicamentos')
        .update({
          ...actualizaciones,
          ...(actualizaciones.Tipo && { Tipo: [actualizaciones.Tipo] })
        })
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
      //medicamentos -> Medicamentos
        .from('Medicamentos')
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
      //medicamentos -> Medicamentos
        .from('Medicamentos')
        .select('*')
        .order('Nombre');

      if (error) throw error;
      // Normalizar Tipo de array a string
      return data?.map(m => ({
        ...m,
        Tipo: Array.isArray(m.Tipo) ? m.Tipo[0] : m.Tipo
      }));
    } catch (error) {
      console.error('Error al obtener medicamentos:', error);
      throw error;
    }
  },

  async obtenerStockBajo(umbral: number = 10) {
    try {
      const { data, error } = await supabase
      //medicamentos -> Medicamentos
        .from('Medicamentos')
        .select('*')
        .lt('Stock', umbral)
        .eq('Activo', true);

      if (error) throw error;
      return data?.map(m => ({
        ...m,
        Tipo: Array.isArray(m.Tipo) ? m.Tipo[0] : m.Tipo
      }));
    } catch (error) {
      console.error('Error al obtener medicamentos con stock bajo:', error);
      throw error;
    }
  }
};