import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../../config/supabaseClient';
import { Platform } from 'react-native';

const storage = {
  setItem: async (key: string, value: string) => {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
    } else {
      await AsyncStorage.setItem(key, value);
    }
  },
  getItem: async (key: string) => {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    } else {
      return await AsyncStorage.getItem(key);
    }
  },
  removeItem: async (key: string) => {
    if (Platform.OS === 'web') {
      localStorage.removeItem(key);
    } else {
      await AsyncStorage.removeItem(key);
    }
  }
};

export const loginAdminDirect = async (nombre: string, contraseña: string) => {
  const { data, error } = await supabase
    .from('administradores')
    .select('*')
    .eq('nombre', nombre)
    .eq('contraseña', contraseña)
    .single();

  if (error || !data) {
    console.error('Error de login:', error);
    throw new Error('Nombre o contraseña incorrectos');
  }

  await storage.setItem('adminSession', JSON.stringify(data));
  
  return data;
};

export const logoutAdmin = async () => {
  await storage.removeItem('adminSession');
};

export const checkSession = async () => {
  const session = await storage.getItem('adminSession');
  return session ? JSON.parse(session) : null;
};

export const getAdminById = async (id: number) => {
  const { data, error } = await supabase
    .from('administradores')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw error;
  }

  return data;
};