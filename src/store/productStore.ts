import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/types';
import { products as initialProducts } from '@/data/mock';

interface ProductState {
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
}

export const useProductStore = create<ProductState>()(
  persist(
    (set) => ({
      products: initialProducts,
      addProduct: (productData) => {
        set((state) => {
          const newProduct: Product = {
            ...productData,
            id: `p-${Date.now()}`,
          };
          return { products: [...state.products, newProduct] };
        });
      },
      updateProduct: (id, productData) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, ...productData } : p
          ),
        }));
      },
      deleteProduct: (id) => {
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        }));
      },
    }),
    {
      name: 'aura-product-storage-v2',
    }
  )
);
