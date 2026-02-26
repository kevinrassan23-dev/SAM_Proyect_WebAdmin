import { supabase } from '@/config/supabaseClient';

export const pedidosAdminService = {
  async obtenerTodosPedidos() {
    try {
      const { data, error } = await supabase
        .from('pedidos')
        .select(`
          *,
          pedido_medicamentos (*)
        `)
        .order('Fecha_Hora', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error al obtener pedidos:', error);
      throw error;
    }
  },

  async obtenerPedidosPorEstado(estado: string) {
    try {
      const { data, error } = await supabase
        .from('pedidos')
        .select(`
          *,
          pedido_medicamentos (*)
        `)
        .contains('Estado', [estado])
        .order('Fecha_Hora', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error al obtener pedidos por estado:', error);
      throw error;
    }
  },

  async obtenerDetallePedido(idPedido: string) {
    try {
      const { data, error } = await supabase
        .from('pedidos')
        .select(`
          *,
          pedido_medicamentos (
            *,
            medicamentos (*)
          )
        `)
        .eq('ID_Pedido', idPedido)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error al obtener detalle del pedido:', error);
      throw error;
    }
  },

  async actualizarEstadoPedido(idPedido: string, nuevoEstado: string) {
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
  },

  async agregarNotasPedido(idPedido: string, notas: string) {
    try {
      const { error } = await supabase
        .from('pedidos')
        .update({ Notas: notas })
        .eq('ID_Pedido', idPedido);

      if (error) throw error;
    } catch (error) {
      console.error('Error al agregar notas:', error);
      throw error;
    }
  },

  async obtenerEstadisticas() {
    try {
      const { data, error } = await supabase
        .from('pedidos')
        .select('ID_Pedido, Estado, Precio_Total, Fecha_Hora');

      if (error) throw error;

      return {
        totalPedidos: data?.length || 0,
        ingresoTotal: data?.reduce((sum, p) => sum + p.Precio_Total, 0) || 0,
        pedidosPorEstado: this.agruparPorEstado(data || [])
      };
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      throw error;
    }
  },

  async agruparPorEstado(pedidos: any[]) {
    return pedidos.reduce((acc, pedido) => {
      const estadoActual = pedido.Estado[pedido.Estado.length - 1];
      acc[estadoActual] = (acc[estadoActual] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }
};