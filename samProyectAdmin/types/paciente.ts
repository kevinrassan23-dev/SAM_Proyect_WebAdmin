
/**
 * INTERFAZ DE PACIENTE
 */
export interface Paciente {
    DNI: string;
    Nombre_Paciente: string;
    Num_Cartilla: string;
    Num_Telefono: string;
    Edad_Paciente: number;
    Tipo_Paciente: 'activo' | 'pensionista' | 'mutualista';
    contrasena_dispensador?: string | null;
    Activo: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}