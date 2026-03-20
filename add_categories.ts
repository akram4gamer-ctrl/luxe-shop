import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || "https://ovhulucxlwyobrsiydsr.supabase.co";
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im92aHVsdWN4bHd5b2Jyc2l5ZHNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxNjE4OTQsImV4cCI6MjA4ODczNzg5NH0.jZx2z1lZ8vXz1ujy1cFkwPApmYP58JGVxiqlvZGrZCw";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function addCategories() {
  const categoriesToAdd = [
    {
      name: 'Bags',
      slug: 'bags',
      description: 'Luxury bags and accessories'
    },
    {
      name: 'Glasses',
      slug: 'glasses',
      description: 'Designer sunglasses and eyewear'
    }
  ];

  for (const category of categoriesToAdd) {
    // Check if exists
    const { data: existing } = await supabase.from('categories').select('*').eq('slug', category.slug);
    
    if (!existing || existing.length === 0) {
      const { data, error } = await supabase.from('categories').insert(category).select();
      if (error) {
        console.error('Error inserting', category.name, error);
      } else {
        console.log('Inserted', category.name, data);
      }
    } else {
      console.log('Category already exists:', category.name);
    }
  }
}

addCategories();
