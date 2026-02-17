/*
  NOS CONECTAMOS A LA API DE SUPABASE:
  
  EJEMPLO:*/

// config/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://rokzxjuxifpxsytmqmvm.supabase.co';
const SUPABASE_ANON_KEY = 'sb_secret_p_LuqdmtT5bCQWyTUHTbRA_08zPQfn9';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
