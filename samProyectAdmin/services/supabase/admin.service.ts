import { supabase } from '../../config/supabaseClient';

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
