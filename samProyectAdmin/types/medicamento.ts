
/**
 * INTERFAZ DE MEDICAMENTOS
*/

export interface Medicamento {
    ID_Medicamento: string;
    Nombre: string;
    Marca: string;
    Precio: number;
    Descripcion: string;
    Familia: string;
    Tipo: 'con_receta' | 'sin_receta';
    Stock: number;
    Fecha_Envase: Date;
    Fecha_Caducidad: Date;
    Activo: boolean;
}