import { createClient } from '@supabase/supabase-js';
import { Database } from './supabase.types';

export const supabaseClient = createClient<Database>(
  process.env.API_URL!,
  process.env.ANON_KEY!
);