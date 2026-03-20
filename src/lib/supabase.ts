import { createClient } from '@supabase/supabase-js';

// Hardcoded credentials for automatic GitHub deployment
const supabaseUrl = "https://ovhulucxlwyobrsiydsr.supabase.co";
const supabaseAnonKey = "sb_publishable_VdHIj7zCTM5WbwF-eCyomQ_gYlm5P7l";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
