
// IMPORTAR
import { pacientesService } from '../firebase/pacientes.service';
import { recetaMedicamentosService } from '../firebase/recetas_medicamentos.service';
import { medicamentosService } from '../supabase/medicamentos.service';
import { Paciente } from '@/types';

export const validacionService = {
  async validarCompra(
    numCartilla: string,
    idMedicamento: string
  ): Promise<{ permitido: boolean; razon?: string; paciente?: Paciente }> {
    try {
      const paciente = await pacientesService.obtenerPorCartilla(numCartilla);
      if (!paciente) {
        return { permitido: false, razon: 'Paciente no encontrado' };
      }

      const medicamento = await medicamentosService.obtenerPorID(idMedicamento);
      if (!medicamento) {
        return { permitido: false, razon: 'Medicamento no encontrado' };
      }

      if (medicamento.Tipo === 'con_receta') {
        const { valido } = await recetaMedicamentosService
          .validarMedicamentoEnReceta(paciente.DNI, idMedicamento);

        if (!valido) {
          return { 
            permitido: false, 
            razon: 'No tiene receta válida para este medicamento' 
          };
        }
      }

      return { 
        permitido: true, 
        paciente 
      };
    } catch (error) {
      console.error('Error en validación:', error);
      throw error;
    }
  }
};