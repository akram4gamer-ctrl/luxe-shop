import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Category } from '@/types';
import { categories as mockCategories } from '@/data/mock';

interface CategoryState {
  categories: Category[];
  addCategory: (category: Category) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
}

export const useCategoryStore = create<CategoryState>()(
  persist(
    (set) => ({
      categories: mockCategories,
      addCategory: (category) =>
        set((state) => ({ categories: [...state.categories, category] })),
      updateCategory: (id, updatedFields) =>
        set((state) => ({
          categories: state.categories.map((c) =>
            c.id === id ? { ...c, ...updatedFields } : c
          ),
        })),
      deleteCategory: (id) =>
        set((state) => ({
          categories: state.categories.filter((c) => c.id !== id),
        })),
    }),
    {
      name: 'category-storage-v2',
    }
  )
);
