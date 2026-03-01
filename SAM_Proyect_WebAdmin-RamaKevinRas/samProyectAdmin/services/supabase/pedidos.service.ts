import { supabase } from '@/config/supabaseClient';
import { Pedido, PedidoMedicamento } from '@/types';

export const pedidosService = {
    async crearPedido(pedido: Omit<Pedido, 'ID_Pedido'>): Promise<string> {
        try {
        const { data, error } = await supabase
            .from('pedidos')
            .insert([pedido])
            .select('ID_Pedido')
            .single();

        if (error) throw error;
        return data?.ID_Pedido;
        } catch (error) {
        console.error('Error al crear pedido:', error);
        throw error;
        }
    },

    async obtenerPorID(idPedido: string): Promise<Pedido | null> {
        try {
        const { data, error } = await supabase
            .from('pedidos')
            .select('*')
            .eq('ID_Pedido', idPedido)
            .single();

        if (error) throw error;
        return data as Pedido;
        } catch (error) {
        console.error('Error al obtener pedido:', error);
        throw error;
        }
    },

    async obtenerTodos(): Promise<Pedido[]> {
        try {
        const { data, error } = await supabase
            .from('pedidos')
            .select('*')
            .order('Fecha_Hora', { ascending: false });

        if (error) throw error;
        return data as Pedido[];
        } catch (error) {
        console.error('Error al obtener todos los pedidos:', error);
        throw error;
        }
    },

    async agregarMedicamentoPedido(
            medicamentoPedido: Omit<PedidoMedicamento, 'ID_Pedido_Medicamento'>
        ): Promise<string> {
            try {
            const { data, error } = await supabase
                .from('pedido_medicamentos')
                .insert([medicamentoPedido])
                .select('ID_Pedido_Medicamento')
                .single();

            if (error) throw error;
            return data?.ID_Pedido_Medicamento;
            } catch (error) {
            console.error('Error al agregar medicamento al pedido:', error);
            throw error;
            }
    },

    async actualizarEstadoPedido(idPedido: string, nuevoEstado: string): Promise<void> {
        try {
        const { data: pedidoActual, error: errorGet } = await supabase
            .from('pedidos')
            .select('Estado')
            .eq('ID_Pedido', idPedido)
            .single();

        if (errorGet) throw errorGet;

        const estadosActualizados = [
            ...(pedidoActual?.Estado || []),
            nuevoEstado
        ];

        const { error } = await supabase
            .from('pedidos')
            .update({ Estado: estadosActualizados })
            .eq('ID_Pedido', idPedido);

        if (error) throw error;
        } catch (error) {
        console.error('Error al actualizar estado:', error);
        throw error;
        }
    }
};