import { supabase } from '@/config/supabaseClient';
import { Medicamento } from '@/types';

/**
 * Servicio de gestión del catálogo de medicamentos.
 */
export const medicamentosService = {

    /**
     * Crea un nuevo medicamento validando duplicados por Nombre y Marca.
     * Genera un ID automático con formato MED-00X.
     */
    async crearMedicamento(medicamento: Omit<Medicamento, 'ID_Medicamento'>): Promise<Medicamento> {
        try {
            console.log(`[${new Date().toLocaleTimeString()}] Registrando medicamento: ${medicamento.Nombre}`);
            
            const { data: existentes, error: errorBusqueda } = await supabase
                .from('Medicamentos')
                .select('*')
                .eq('Nombre', medicamento.Nombre)
                .eq('Marca', medicamento.Marca);

            if (errorBusqueda) throw errorBusqueda;

            if (existentes && existentes.length > 0) {
                throw new Error(`Ya existe un medicamento "${medicamento.Nombre}" de la marca "${medicamento.Marca}".`);
            }
            
            const { count, error: countError } = await supabase
                .from('Medicamentos')
                .select('*', { count: 'exact', head: true });

            if (countError) throw countError;

            const nextNum = (count ?? 0) + 1;
            const docId = `MED-${String(nextNum).padStart(3, '0')}`;

            const { data, error } = await supabase
                .from('Medicamentos')
                .insert([{
                    ID_Medicamento: docId,
                    ...medicamento,
                    Activo: medicamento.Activo ?? true,
                }])
                .select()
                .single();

            if (error) throw error;
            console.log(`[${new Date().toLocaleTimeString()}] Medicamento creado exitosamente con ID: ${docId}`);
            return data as Medicamento;
        } catch (error: any) {
            console.error(`[${new Date().toLocaleTimeString()}] ❌ Error al crear medicamento: ${error.message}`);
            throw error;
        }
    },

    /**
     * Obtiene medicamentos categorizados como "sin receta".
     */
    async obtenerSinReceta(): Promise<Medicamento[]> {
        try {
            console.log(`[${new Date().toLocaleTimeString()}] Obteniendo medicamentos sin receta`);
            const { data, error } = await supabase
                .from('Medicamentos')
                .select('*')
                .contains('Tipo', ['sin_receta'])
                .eq('Activo', true);

            if (error) throw error;
            return data?.map(m => ({ ...m, Tipo: Array.isArray(m.Tipo) ? m.Tipo[0] : m.Tipo })) as Medicamento[];
        } catch (error: any) {
            console.error(`[${new Date().toLocaleTimeString()}] ❌ Error al obtener sin receta: ${error.message}`);
            throw error;
        }
    },

    /**
     * Obtiene medicamentos categorizados como "con receta".
     */
    async obtenerConReceta(): Promise<Medicamento[]> {
        try {
            console.log(`[${new Date().toLocaleTimeString()}] Obteniendo medicamentos con receta`);
            const { data, error } = await supabase
                .from('Medicamentos')
                .select('*')
                .ilike('Tipo', '%con_receta%')
                .eq('Activo', true)
                .order('Nombre');

            if (error) throw error;
            return data?.map(m => ({ ...m, Tipo: Array.isArray(m.Tipo) ? m.Tipo[0] : m.Tipo })) as Medicamento[];
        } catch (error: any) {
            console.error(`[${new Date().toLocaleTimeString()}] ❌ Error al obtener con receta: ${error.message}`);
            throw error;
        }
    },

    /**
     * Filtra medicamentos por su familia terapéutica.
     */
    async obtenerPorFamilia(familia: string): Promise<Medicamento[]> {
        try {
            console.log(`[${new Date().toLocaleTimeString()}] Buscando medicamentos de la familia: ${familia}`);
            const { data, error } = await supabase
                .from('Medicamentos')
                .select('*')
                .eq('Familia', familia)
                .eq('Activo', true);

            if (error) throw error;
            return data?.map(m => ({ ...m, Tipo: Array.isArray(m.Tipo) ? m.Tipo[0] : m.Tipo })) as Medicamento[];
        } catch (error: any) {
            console.error(`[${new Date().toLocaleTimeString()}] ❌ Error por familia: ${error.message}`);
            throw error;
        }
    },

    /**
     * Recupera la ficha de un medicamento mediante su identificador único.
     */
    async obtenerPorID(id: string): Promise<Medicamento | null> {
        try {
            console.log(`[${new Date().toLocaleTimeString()}] Consultando medicamento ID: ${id}`);
            const { data, error } = await supabase
                .from('Medicamentos')
                .select('*')
                .eq('ID_Medicamento', id)
                .single();

            if (error) throw error;
            return { ...data, Tipo: Array.isArray(data.Tipo) ? data.Tipo[0] : data.Tipo } as Medicamento;
        } catch (error: any) {
            console.error(`[${new Date().toLocaleTimeString()}] ❌ Error al obtener por ID: ${error.message}`);
            throw error;
        }
    },

    /**
     * Lista todos los medicamentos activos ordenados por nombre.
     */
    async obtenerTodos(): Promise<Medicamento[]> {
        try {
            console.log(`[${new Date().toLocaleTimeString()}] Recuperando catálogo completo de medicamentos`);
            const { data, error } = await supabase
                .from('Medicamentos')
                .select('*')
                .eq('Activo', true)
                .order('Nombre');

            if (error) throw error;
            return data?.map(m => ({ ...m, Tipo: Array.isArray(m.Tipo) ? m.Tipo[0] : m.Tipo })) as Medicamento[];
        } catch (error: any) {
            console.error(`[${new Date().toLocaleTimeString()}] ❌ Error al obtener todos: ${error.message}`);
            throw error;
        }
    },

    /**
     * Obtiene una lista única de todas las familias de medicamentos disponibles.
     */
    async obtenerFamilias(): Promise<string[]> {
        try {
            console.log(`[${new Date().toLocaleTimeString()}] Consultando lista de familias`);
            const { data, error } = await supabase
                .from('Medicamentos')
                .select('Familia')
                .eq('Activo', true);

            if (error) throw error;
            const familias = [...new Set(data?.map(m => m.Familia) || [])];
            return familias as string[];
        } catch (error: any) {
            console.error(`[${new Date().toLocaleTimeString()}] ❌ Error al obtener familias: ${error.message}`);
            throw error;
        }
    },

    /**
     * Actualiza la información de un medicamento existente.
     */
    async actualizarMedicamento(idMedicamento: string, actualizaciones: Partial<Medicamento>): Promise<void> {
        try {
            console.log(`[${new Date().toLocaleTimeString()}] Actualizando medicamento ID: ${idMedicamento}`);
            const { error } = await supabase
                .from('Medicamentos')
                .update({
                    ...actualizaciones,
                    Fecha_Envase: actualizaciones.Fecha_Envase ?? null,
                    Fecha_Caducidad: actualizaciones.Fecha_Caducidad ?? null,
                })
                .eq('ID_Medicamento', idMedicamento);

            if (error) throw error;
            console.log(`[${new Date().toLocaleTimeString()}] Medicamento actualizado correctamente.`);
        } catch (error: any) {
            console.error(`[${new Date().toLocaleTimeString()}] ❌ Error al actualizar: ${error.message}`);
            throw error;
        }
    },

    /**
     * Elimina un medicamento del catálogo.
     */
    async eliminarMedicamento(idMedicamento: string): Promise<void> {
        try {
            console.log(`[${new Date().toLocaleTimeString()}] Eliminando medicamento ID: ${idMedicamento}`);
            const { error } = await supabase
                .from('Medicamentos')
                .delete()
                .eq('ID_Medicamento', idMedicamento);

            if (error) throw error;
            console.log(`[${new Date().toLocaleTimeString()}] Medicamento eliminado del sistema.`);
        } catch (error: any) {
            console.error(`[${new Date().toLocaleTimeString()}] ❌ Error al eliminar: ${error.message}`);
            throw error;
        }
    },
}