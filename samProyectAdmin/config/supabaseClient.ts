/*
  NOS CONECTAMOS A LA API DE SUPABASE:
  
  EJEMPLO:*/

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://rokzxjuxifpxsytmqmvm.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_2z-nfrCUbPF5zf9VwcZFbA_YxLKBYMp';

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);
