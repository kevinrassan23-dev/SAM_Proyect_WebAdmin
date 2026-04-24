
/**
 * INTERFAZ DE RECETAS
 */

export interface Receta {
    ID_Receta?: string;
    DNI_Paciente: string;
    Num_Cartilla_Paciente: string;
    Nombre_Paciente: string; 
    Nombre_Especialista: string;
    Afecciones: string;
    Medicamentos_Recetados: string;
    Direccion_Centro: string;
    Fecha_Inicio: Date;
    Fecha_Expiracion: Date;
    Activa: boolean;
}

/**
 * INTERFAZ RELACIONAL
 */
export interface RecetaMedicamento {
    ID_Receta_Medicamento: string;
    ID_Receta: string;
    ID_Medicamento: string;
    Dosis: string;
    Duracion: string;
    Fecha_Caducidad: Date;
}