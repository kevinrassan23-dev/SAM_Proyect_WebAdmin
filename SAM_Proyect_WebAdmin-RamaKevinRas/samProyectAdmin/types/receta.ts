export interface Receta {
    ID_Receta: string;
    DNI_Paciente: string;
    Nombre_Especialista: string;
    Afecciones: string;
    Direccion_Centro: string;
    Fecha: Date;
    Activa: boolean;
}

export interface RecetaMedicamento {
    ID_Receta_Medicamento: string;
    ID_Receta: string;
    ID_Medicamento: string;
    Dosis: string;
    Duracion: string;
    Fecha_Caducidad: Date;
}