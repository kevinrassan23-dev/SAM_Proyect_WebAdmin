import { supabase } from '@/config/supabaseClient';
import { Medicamento } from '@/types';

export const medicamentosService = {
    async obtenerSinReceta(): Promise<Medicamento[]> {
        try {
        const { data, error } = await supabase
            .from('medicamentos')
            .select('*')
            .eq('Tipo', 'sin_receta')
            .eq('Activo', true);

        if (error) throw error;
        return data as Medicamento[];
        } catch (error) {
        console.error('Error al obtener medicamentos sin receta:', error);
        throw error;
        }
    },

    async obtenerPorFamilia(familia: string): Promise<Medicamento[]> {
        try {
        const { data, error } = await supabase
            .from('medicamentos')
            .select('*')
            .eq('Familia', familia)
            .eq('Activo', true);

        if (error) throw error;
        return data as Medicamento[];
        } catch (error) {
        console.error('Error al obtener medicamentos por familia:', error);
        throw error;
        }
    },

    async obtenerPorID(id: string): Promise<Medicamento | null> {
        try {
        const { data, error } = await supabase
            .from('medicamentos')
            .select('*')
            .eq('ID_Medicamento', id)
            .single();

        if (error) throw error;
        return data as Medicamento;
        } catch (error) {
        console.error('Error al obtener medicamento:', error);
        throw error;
        }
    },

    async obtenerTodos(): Promise<Medicamento[]> {
        try {
        const { data, error } = await supabase
            .from('medicamentos')
            .select('*')
            .eq('Activo', true)
            .order('Nombre');

        if (error) throw error;
        return data as Medicamento[];
        } catch (error) {
        console.error('Error al obtener todos los medicamentos:', error);
        throw error;
        }
    },

    async obtenerFamilias(): Promise<string[]> {
        try {
            const { data, error } = await supabase
            .from('medicamentos')
            .select('Familia')
            .eq('Activo', true);

            if (error) throw error;

            // Eliminar duplicados en JavaScript
            const familias = [...new Set(data?.map(m => m.Familia) || [])];
            return familias as string[];
        } catch (error) {
            console.error('Error al obtener familias:', error);
            throw error;
        }
    }
}