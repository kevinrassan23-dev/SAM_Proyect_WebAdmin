
/**
 * INTERFAZ DE PEDIDO
 */
export interface Transaccion {
    id: string;
    ID_Pedido: number;
    dni_paciente: string;
    monto: number;
    metodo_pago: string;
    estado: string;
    codigo_transaccion: string;
    fecha_inicio: string;
    fecha_completacion: string;
    created_at: string;
    updated_at: string;
}