import { supabase } from '@/config/supabaseClient';
import bcrypt from 'bcryptjs';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Validadores de formato para credenciales de acceso.
 */
export const validators = {
    email: (email: string): string | null => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) return "El email es obligatorio";
        if (!regex.test(email)) return "Formato de email inválido";
        return null;
    },

    // ── Unificado con InsertarAdmin: acepta cualquier carácter no alfanumérico como símbolo
    password: (password: string): string | null => {
        if (!password) return "La contraseña es obligatoria";
        if (password.length < 8) return "Mínimo 8 caracteres";
        if (!/[A-Z]/.test(password)) return "Debe incluir al menos una mayúscula";
        if (!/[a-z]/.test(password)) return "Debe incluir al menos una minúscula";
        if (!/[^A-Za-z0-9]/.test(password)) return "Debe incluir al menos un símbolo especial";
        return null;
    }
};

/**
 * Servicio de autenticación para el panel de administración.
 * Gestiona el inicio de sesión mediante sessionStorage y AsyncStorage.
 */
export const adminAuthService = {

  /**
   * Verifica credenciales y establece la sesión del administrador.
   * ── Guarda en sessionStorage (web) Y en AsyncStorage (layout)
   */
  async login(email: string, password: string) {
    try {
      console.log(`[${new Date().toLocaleTimeString()}] Intento de login: ${email}`);
      const { data, error } = await supabase
        .from('Administradores')
        .select('id, email, password, nombre, rol')
        .eq('email', email)
        .single();

      if (error || !data) throw new Error("Email o contraseña incorrectos");

      const passwordMatch = await bcrypt.compare(password, data.password);
      if (!passwordMatch) throw new Error("Email o contraseña incorrectos");

      const session = { id: data.id, email: data.email, nombre: data.nombre, rol: data.rol };

      // ── sessionStorage para checkSession del useAuthGuard
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('adminSession', JSON.stringify(session));
      }

      // ── AsyncStorage para que el _layout lea nombre y rol correctamente
      await AsyncStorage.setItem('adminId', String(data.id));
      await AsyncStorage.setItem('adminRol', data.rol);
      await AsyncStorage.setItem('adminNombre', data.nombre);

      console.log(`[${new Date().toLocaleTimeString()}] Sesión iniciada para: ${data.nombre}`);
      return session;
    } catch (error: any) {
      console.error(`[${new Date().toLocaleTimeString()}] ❌ Error en login: ${error.message}`);
      throw error;
    }
  },

  /**
   * Cierra la sesión activa limpiando sessionStorage y AsyncStorage.
   */
  async logout() {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('adminSession');
    }

    // ── Limpiar también AsyncStorage para que el layout no muestre datos obsoletos
    await AsyncStorage.removeItem('adminId');
    await AsyncStorage.removeItem('adminRol');
    await AsyncStorage.removeItem('adminNombre');

    console.log(`[${new Date().toLocaleTimeString()}] Sesión cerrada.`);
  },

  /**
   * Recupera la sesión actual del almacenamiento local del navegador.
   */
  checkSession() {
    if (typeof window !== 'undefined') {
      const session = sessionStorage.getItem('adminSession');
      return session ? JSON.parse(session) : null;
    }
    return null;
  }
};