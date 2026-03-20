import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || "https://ovhulucxlwyobrsiydsr.supabase.co";
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im92aHVsdWN4bHd5b2Jyc2l5ZHNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxNjE4OTQsImV4cCI6MjA4ODczNzg5NH0.jZx2z1lZ8vXz1ujy1cFkwPApmYP58JGVxiqlvZGrZCw";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
  const { data, error } = await supabase.from('categories').select('*');
  console.log('Error:', error);
  console.log('Data:', data);
}
test();
