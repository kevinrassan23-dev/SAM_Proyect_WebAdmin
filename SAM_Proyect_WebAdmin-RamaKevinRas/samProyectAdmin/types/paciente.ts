export interface Paciente {
    DNI: string;
    Num_Cartilla: string;
    Num_Telefono: string;
    Nombre_Paciente: string;
    Edad_Paciente: number;
    Tipo_Paciente: 'activo' | 'pensionista' | 'mutualista';
    Activo: boolean;
}