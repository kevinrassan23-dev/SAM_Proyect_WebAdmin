export interface Pedido {
    ID_Pedido: string;
    DNI_Paciente: string;
    Tipo_Paciente: 'activo' | 'pensionista' | 'mutualista';
    Descuento_Aplicado: number;
    Precio_Total: number;
    Estado: string[];
    Fecha_Hora: Date;
    Notas?: string;
}

export interface PedidoMedicamento {
    ID_Pedido_Medicamento: string;
    ID_Pedido: string;
    ID_Medicamento: string;
    ID_Receta_Medicamento?: string | null;
    Cantidad: number;
    Precio_Unitario: number;
    Subtotal: number;
}