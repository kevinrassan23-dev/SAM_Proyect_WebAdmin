// IMPORTAR
import { pacientesService } from '../firebase/pacientes.service';
import { recetaMedicamentosService } from '../firebase/recetas_medicamentos.service';
import { recetasService } from '../firebase/recetas.service';
import { medicamentosService } from '../supabase/medicamentos.service';
import { Paciente } from '@/types';

export const validacionService = {
  async validarCompra(
    dni: string,
    idMedicamento: string
  ): Promise<{ permitido: boolean; razon?: string; paciente?: Paciente }> {
    try {
      console.log("🔍 Validando compra para DNI:", dni, "Medicamento:", idMedicamento);
      
      // ✅ 1. Verificar que el paciente existe
      const paciente = await pacientesService.obtenerPorDNI(dni);
      if (!paciente) {
        console.log("❌ Paciente no encontrado");
        return { permitido: false, razon: 'Paciente no encontrado' };
      }

      // ✅ 2. Verificar que el medicamento existe
      const medicamento = await medicamentosService.obtenerPorID(idMedicamento);
      if (!medicamento) {
        console.log("❌ Medicamento no encontrado");
        return { permitido: false, razon: 'Medicamento no encontrado' };
      }

      // ✅ 3. Si requiere receta, validar que existe
      if (medicamento.Tipo === 'con_receta') {
        console.log("📋 Medicamento requiere receta, validando...");
        
        // Obtener todas las recetas del paciente
        const recetasPaciente = await recetasService.obtenerRecetasPorPaciente(dni);
        
        if (recetasPaciente.length === 0) {
          console.log("❌ El paciente no tiene recetas");
          return { 
            permitido: false, 
            razon: 'El paciente no tiene recetas válidas' 
          };
        }

        // Obtener todas las recetas-medicamentos
        const todasLasRelaciones = await recetaMedicamentosService.obtenerTodos();
        
        // Verificar si el medicamento está en una receta activa del paciente
        const medicamentoEnReceta = todasLasRelaciones.find(relacion => 
          relacion.ID_Medicamento === idMedicamento &&
          recetasPaciente.some(receta => receta.ID_Receta === relacion.ID_Receta)
        );

        if (!medicamentoEnReceta) {
          console.log("❌ El medicamento no está en las recetas del paciente");
          return { 
            permitido: false, 
            razon: 'No tiene receta válida para este medicamento' 
          };
        }

        // Verificar si la receta aún está vigente
        const recetaDelMedicamento = recetasPaciente.find(r => r.ID_Receta === medicamentoEnReceta.ID_Receta);
        
        if (!recetaDelMedicamento || !recetaDelMedicamento.Activa) {
          console.log("❌ La receta no está activa");
          return { 
            permitido: false, 
            razon: 'La receta no está activa' 
          };
        }

        console.log("✅ Receta válida encontrada");
      }

      console.log("✅ Compra permitida");
      return { 
        permitido: true, 
        paciente 
      };
      
    } catch (error: any) {
      console.error('❌ Error en validación:', error.message);
      throw error;
    }
  }
};