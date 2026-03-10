import { create } from 'zustand';
import { Category } from '@/types';
import { supabase } from '@/lib/supabase';

interface CategoryState {
  categories: Category[];
  isLoading: boolean;
  fetchCategories: () => Promise<void>;
  addCategory: (category: Omit<Category, 'id'>) => Promise<void>;
  updateCategory: (id: string, category: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
}

export const useCategoryStore = create<CategoryState>((set, get) => ({
  categories: [],
  isLoading: true,
  fetchCategories: async () => {
    set({ isLoading: true });
    const { data, error } = await supabase.from('categories').select('*').order('created_at', { ascending: true });
    if (data) {
      set({ categories: data, isLoading: false });
    } else {
      set({ isLoading: false });
      console.error('Error fetching categories:', error);
    }
  },
  addCategory: async (category) => {
    const { error } = await supabase.from('categories').insert(category);
    if (!error) {
      await get().fetchCategories();
    } else {
      console.error('Error adding category:', error);
    }
  },
  updateCategory: async (id, updatedFields) => {
    const { error } = await supabase.from('categories').update(updatedFields).eq('id', id);
    if (!error) {
      await get().fetchCategories();
    } else {
      console.error('Error updating category:', error);
    }
  },
  deleteCategory: async (id) => {
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (!error) {
      await get().fetchCategories();
    } else {
      console.error('Error deleting category:', error);
    }
  },
}));
