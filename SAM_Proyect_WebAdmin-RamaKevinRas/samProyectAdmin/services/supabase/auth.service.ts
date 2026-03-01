/**
 * Aquí van las funciones de autenticación de supabase:
 * 
 * EJEMPLO: un método para verificar usuario y contraseña desde supabase ->
 * 
 * export const Login = (user, password) =>
 * supabase.auth.verificarUserPassword({ user, password });
 * export const signOut = () => supabase.auth.signOut();
 * 
 */

import { supabase } from '@/config/supabaseClient';
import bcrypt from 'bcryptjs';

export const validators = {

    // Validaciones de formato de email
    email: (email: string): string | null => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) return "El email es obligatorio";
        if (!regex.test(email)) return "Formato de email inválido";
        return null;
    },

    // Validaciones de formato de contraseña
    password: (password: string): string | null => {
        if (!password) return "La contraseña es obligatoria";
        if (password.length < 8) return "Mínimo 8 caracteres";
        if (!/[A-Z]/.test(password)) return "Debe incluir al menos una mayúscula";
        if (!/[a-z]/.test(password)) return "Debe incluir al menos una minúscula";
        if (!/[!@#$%^&*(),.?\":{}|<>]/.test(password)) return "Debe incluir al menos un símbolo especial";
        return null;
    }
};

export const adminAuthService = {

    // Pasamos las variables insertadas
    async login(email: string, password: string) {
        try {
            // Buscamos por email
            const { data, error } = await supabase
                .from('Administradores')
                .select('id, email, password')
                .eq('email', email)
                .single();

            // Compara el valor de la contraseña
            if (error || !data) {
                throw new Error("Email o contraseña incorrectos");
            }

            // Compara contraseña con hash
            const passwordMatch = await bcrypt.compare(password, data.password);
            if (!passwordMatch) {
                throw new Error("Email o contraseña incorrectos");
            }

            // Guarda sesión sin la contraseña
            const session = { id: data.id, email: data.email };
            if (typeof window !== 'undefined') {
                localStorage.setItem('adminSession', JSON.stringify(session));
            }

            return session;

        } catch (error) {
            console.error("Error en login:", error);
            throw error;
        }
    },

    logout() {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('adminSession');
        }
    },

    checkSession() {
        if (typeof window !== 'undefined') {
            const session = localStorage.getItem('adminSession');
            return session ? JSON.parse(session) : null;
        }

        return null;
    }
};