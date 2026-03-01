export interface Medicamento {
    ID_Medicamento: string;
    Nombre: string;
    Marca: string;
    Precio: number;
    Descripcion: string;
    Familia: string;
    Tipo: 'con_receta' | 'sin_receta';
    Stock: number;
    Activo: boolean;
}