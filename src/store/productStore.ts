import { create } from 'zustand';
import { Product } from '@/types';
import { supabase } from '@/lib/supabase';

interface ProductState {
  products: Product[];
  isLoading: boolean;
  fetchProducts: () => Promise<void>;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  isLoading: true,
  fetchProducts: async () => {
    set({ isLoading: true });
    const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (data) {
      const mapped = data.map(p => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        description: p.description,
        originalPriceCNY: p.original_price_cny,
        salePriceCNY: p.sale_price_cny,
        isOnSale: p.is_on_sale,
        categoryId: p.category_id,
        images: p.images || [],
        inStock: p.in_stock,
        featured: p.featured
      }));
      set({ products: mapped, isLoading: false });
    } else {
      set({ isLoading: false });
      console.error('Error fetching products:', error);
    }
  },
  addProduct: async (productData) => {
    const dbProduct = {
      name: productData.name,
      slug: productData.slug,
      description: productData.description,
      original_price_cny: productData.originalPriceCNY,
      sale_price_cny: productData.salePriceCNY,
      is_on_sale: productData.isOnSale,
      category_id: productData.categoryId,
      images: productData.images,
      in_stock: productData.inStock,
      featured: productData.featured
    };
    const { error } = await supabase.from('products').insert(dbProduct);
    if (error) {
      console.error('Error adding product:', error);
      throw error;
    }
    await get().fetchProducts();
  },
  updateProduct: async (id, productData) => {
    const dbProduct: any = {};
    if (productData.name !== undefined) dbProduct.name = productData.name;
    if (productData.slug !== undefined) dbProduct.slug = productData.slug;
    if (productData.description !== undefined) dbProduct.description = productData.description;
    if (productData.originalPriceCNY !== undefined) dbProduct.original_price_cny = productData.originalPriceCNY;
    if (productData.salePriceCNY !== undefined) dbProduct.sale_price_cny = productData.salePriceCNY;
    if (productData.isOnSale !== undefined) dbProduct.is_on_sale = productData.isOnSale;
    if (productData.categoryId !== undefined) dbProduct.category_id = productData.categoryId;
    if (productData.images !== undefined) dbProduct.images = productData.images;
    if (productData.inStock !== undefined) dbProduct.in_stock = productData.inStock;
    if (productData.featured !== undefined) dbProduct.featured = productData.featured;

    const { error } = await supabase.from('products').update(dbProduct).eq('id', id);
    if (error) {
      console.error('Error updating product:', error);
      throw error;
    }
    await get().fetchProducts();
  },
  deleteProduct: async (id) => {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
    await get().fetchProducts();
  }
}));
