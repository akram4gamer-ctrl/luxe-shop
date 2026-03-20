import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://ovhulucxlwyobrsiydsr.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im92aHVsdWN4bHd5b2Jyc2l5ZHNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxNjE4OTQsImV4cCI6MjA4ODczNzg5NH0.jZx2z1lZ8vXz1ujy1cFkwPApmYP58JGVxiqlvZGrZCw";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function check() {
  const { data, error } = await supabase.from('products').select('*');
  console.log('Products:', data?.length);
  console.log('Error:', error);
  process.exit(0);
}

check();
