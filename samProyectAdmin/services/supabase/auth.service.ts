import { supabase } from '../../config/supabaseClient';

export const loginAdmin = async (usuario: string, password: string) => {
  const { data, error } = await supabase
    .from('administradores')
    .select('*')
    .eq('usuario', usuario)
    .eq('password', password)
    .single();

  if (error || !data) {
    throw new Error('Usuario o contraseña incorrectos');
  }

  return data;
};

