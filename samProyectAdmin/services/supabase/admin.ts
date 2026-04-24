import { supabase } from '@/config/supabaseClient';
import bcrypt from 'bcryptjs';
import { Administrador } from '@/types/Admin';

const TABLA = 'Administradores';
const SALT_ROUNDS = 10;

/**
 * Servicio para la gestión de cuentas de administrador en Supabase.
 * Maneja el cifrado de contraseñas y validación de existencia de usuarios.
 */
export const adminService = {

  /**
   * Registra un nuevo administrador cifrando la contraseña con bcrypt.
   */
  async crearAdministrador(email: string, password: string, nombre: string, rol: string): Promise<number> {
    try {
      console.log(`[${new Date().toLocaleTimeString()}] Intentando crear administrador: ${email}`);
      
      const { data: existente } = await supabase
        .from(TABLA)
        .select('id')
        .eq('email', email.toLowerCase().trim())
        .single();

      if (existente) {
        throw new Error('Ya existe un administrador con ese correo electrónico.');
      }

      const hash = await bcrypt.hash(password, SALT_ROUNDS);

      const { data, error } = await supabase
        .from(TABLA)
        .insert([{
          email: email.toLowerCase().trim(),
          password: hash,
          nombre: nombre.trim(),
          rol,
        }])
        .select('id')
        .single();

      if (error) throw new Error(error.message);
      
      console.log(`[${new Date().toLocaleTimeString()}] Administrador creado con ID: ${data.id}`);
      return data.id;
    } catch (error: any) {
      console.error(`[${new Date().toLocaleTimeString()}] ❌ Error al crear administrador: ${error.message}`);
      throw error;
    }
  },

  /**
   * Obtiene la lista de administradores omitiendo datos sensibles.
   */
  async obtenerTodos(): Promise<Omit<Administrador, 'password'>[]> {
    try {
      console.log(`[${new Date().toLocaleTimeString()}] Obteniendo lista de administradores`);
      const { data, error } = await supabase
        .from(TABLA)
        .select('id, email, nombre, rol')
        .order('id', { ascending: true });

      if (error) throw new Error(error.message);
      return data ?? [];
    } catch (error: any) {
      console.error(`[${new Date().toLocaleTimeString()}] ❌ Error al obtener administradores: ${error.message}`);
      return [];
    }
  },

  /**
   * Busca un administrador por su correo electrónico.
   */
  async obtenerPorEmail(email: string): Promise<Administrador | null> {
    try {
      console.log(`[${new Date().toLocaleTimeString()}] Buscando administrador por email: ${email}`);
      const { data, error } = await supabase
        .from(TABLA)
        .select('*')
        .eq('email', email.toLowerCase().trim())
        .single();

      if (error || !data) return null;
      return data as Administrador;
    } catch (error: any) {
      console.error(`[${new Date().toLocaleTimeString()}] ❌ Error al obtener administrador: ${error.message}`);
      return null;
    }
  },

  /**
   * Cifra y actualiza la contraseña de un administrador existente.
   */
  async actualizarPassword(id: number, nuevaPassword: string): Promise<void> {
    try {
      console.log(`[${new Date().toLocaleTimeString()}] Actualizando contraseña para ID: ${id}`);
      const hash = await bcrypt.hash(nuevaPassword, SALT_ROUNDS);
      const { error } = await supabase
        .from(TABLA)
        .update({ password: hash })
        .eq('id', id);

      if (error) throw new Error(error.message);
      console.log(`[${new Date().toLocaleTimeString()}] Contraseña actualizada correctamente.`);
    } catch (error: any) {
      console.error(`[${new Date().toLocaleTimeString()}] ❌ Error al actualizar contraseña: ${error.message}`);
      throw error;
    }
  },

  /**
   * Actualiza los datos básicos (nombre y rol) de un administrador.
   */
  async actualizarAdmin(id: number, nombre: string, rol: string): Promise<void> {
    try {
      console.log(`[${new Date().toLocaleTimeString()}] Actualizando datos básicos para ID: ${id}`);
      const { error } = await supabase
        .from(TABLA)
        .update({ nombre: nombre.trim(), rol })
        .eq('id', id);

      if (error) throw new Error(error.message);
      console.log(`[${new Date().toLocaleTimeString()}] Datos de administrador actualizados.`);
    } catch (error: any) {
      console.error(`[${new Date().toLocaleTimeString()}] ❌ Error al actualizar administrador: ${error.message}`);
      throw error;
    }
  },

  /**
   * Elimina un registro de administrador de la base de datos.
   */
  async eliminarAdministrador(id: number): Promise<void> {
    try {
      console.log(`[${new Date().toLocaleTimeString()}] Eliminando administrador ID: ${id}`);
      const { error } = await supabase
        .from(TABLA)
        .delete()
        .eq('id', id);

      if (error) throw new Error(error.message);
      console.log(`[${new Date().toLocaleTimeString()}] Administrador eliminado correctamente.`);
    } catch (error: any) {
      console.error(`[${new Date().toLocaleTimeString()}] ❌ Error al eliminar administrador: ${error.message}`);
      throw error;
    }
  },
};