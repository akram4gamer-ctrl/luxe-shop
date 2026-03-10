import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://ovhulucxlwyobrsiydsr.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "sb_publishable_VdHIj7zCTM5WbwF-eCyomQ_gYlm5P7l";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
