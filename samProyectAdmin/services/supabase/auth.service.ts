// services/supabase/auth.service.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../../config/supabaseClient';

export const loginAdmin = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });

  if (error) {
    throw new Error(error.message);
  }

  const { data: adminData, error: adminError } = await supabase
    .from('administradores')
    .select('*')
    .eq('email', email)
    .single();

  if (adminError || !adminData) {
    await supabase.auth.signOut();
    throw new Error('No tienes permisos de administrador');
  }

  return { user: data.user, admin: adminData };
};

export const loginAdminDirect = async (usuario: string, password: string) => {
  const { data, error } = await supabase
    .from('administradores')
    .select('*')
    .eq('usuario', usuario)
    .eq('password', password)
    .single();

  if (error || !data) {
    console.error('Error de login:', error);
    throw new Error('Usuario o contraseña incorrectos');
  }

  await AsyncStorage.setItem('adminSession', JSON.stringify(data));
  
  return data;
};

export const logoutAdmin = async () => {
  await AsyncStorage.removeItem('adminSession');
  await supabase.auth.signOut();
};

export const checkSession = async () => {
  const session = await AsyncStorage.getItem('adminSession');
  return session ? JSON.parse(session) : null;
};