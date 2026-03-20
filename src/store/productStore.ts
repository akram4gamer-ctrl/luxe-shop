import { create } from 'zustand';
import { Product, ProductVariant } from '@/types';
import { supabase } from '@/lib/supabase';

interface ProductState {
  products: Product[];
  isLoading: boolean;
  fetchProducts: () => Promise<void>;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
}

const parseDescription = (desc: string) => {
  try {
    if (desc && desc.startsWith('{"_isComplex":true')) {
      const parsed = JSON.parse(desc);
      return {
        description: parsed.text || '',
        variants: parsed.variants || [],
        gender: parsed.gender || 'unisex'
      };
    }
  } catch (e) {
    // ignore
  }
  return { description: desc || '', variants: [], gender: 'unisex' };
};

const stringifyDescription = (description: string, variants?: ProductVariant[], gender?: string) => {
  if ((variants && variants.length > 0) || gender) {
    return JSON.stringify({
      _isComplex: true,
      text: description,
      variants: variants || [],
      gender: gender || 'unisex'
    });
  }
  return description;
};

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  isLoading: true,
  fetchProducts: async () => {
    set({ isLoading: true });
    const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    
    let mapped = (data || []).map(p => {
      const { description, variants, gender } = parseDescription(p.description);
      return {
        id: p.id,
        name: p.name,
        slug: p.slug,
        description: description,
        originalPriceCNY: p.original_price_cny,
        salePriceCNY: p.sale_price_cny,
        isOnSale: p.is_on_sale,
        categoryId: p.category_id,
        images: p.images || [],
        inStock: p.in_stock,
        featured: p.featured,
        variants: variants,
        gender: gender as 'male' | 'female' | 'unisex'
      };
    });

    // Add mock products for Bags and Glasses if they don't exist
    const hasBags = mapped.some(p => p.categoryId === '33333333-3333-3333-3333-333333333333');
    const hasGlasses = mapped.some(p => p.categoryId === '44444444-4444-4444-4444-444444444444');

    if (!hasBags) {
      mapped.push({
        id: 'mock-bag-1',
        name: 'Classic Leather Tote',
        slug: 'classic-leather-tote',
        description: 'A timeless leather tote bag perfect for everyday use.',
        originalPriceCNY: 3500,
        salePriceCNY: null,
        isOnSale: false,
        categoryId: '33333333-3333-3333-3333-333333333333',
        images: ['https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&q=80&w=800'],
        inStock: true,
        featured: true,
        variants: [],
        gender: 'female'
      });
      mapped.push({
        id: 'mock-bag-2',
        name: 'Urban Backpack',
        slug: 'urban-backpack',
        description: 'A sleek, modern backpack for the urban commuter.',
        originalPriceCNY: 2800,
        salePriceCNY: null,
        isOnSale: false,
        categoryId: '33333333-3333-3333-3333-333333333333',
        images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800'],
        inStock: true,
        featured: false,
        variants: [],
        gender: 'unisex'
      });
    }

    if (!hasGlasses) {
      mapped.push({
        id: 'mock-glasses-1',
        name: 'Aviator Classic',
        slug: 'aviator-classic',
        description: 'Iconic aviator sunglasses with polarized lenses.',
        originalPriceCNY: 1200,
        salePriceCNY: null,
        isOnSale: false,
        categoryId: '44444444-4444-4444-4444-444444444444',
        images: ['https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=800'],
        inStock: true,
        featured: true,
        variants: [],
        gender: 'unisex'
      });
      mapped.push({
        id: 'mock-glasses-2',
        name: 'Cat Eye Elegance',
        slug: 'cat-eye-elegance',
        description: 'Elegant cat-eye frames for a sophisticated look.',
        originalPriceCNY: 1450,
        salePriceCNY: null,
        isOnSale: false,
        categoryId: '44444444-4444-4444-4444-444444444444',
        images: ['https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&q=80&w=800'],
        inStock: true,
        featured: false,
        variants: [],
        gender: 'female'
      });
    }

    set({ products: mapped, isLoading: false });
    if (error) console.error('Error fetching products:', error);
  },
  addProduct: async (productData) => {
    const dbProduct = {
      name: productData.name,
      slug: productData.slug,
      description: stringifyDescription(productData.description, productData.variants, productData.gender),
      original_price_cny: productData.originalPriceCNY,
      sale_price_cny: productData.salePriceCNY,
      is_on_sale: productData.isOnSale,
      category_id: productData.categoryId || null,
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
    
    // If we are updating description, variants, or gender, we need to get the current ones to merge them properly
    if (productData.description !== undefined || productData.variants !== undefined || productData.gender !== undefined) {
      const currentProduct = get().products.find(p => p.id === id);
      const newDesc = productData.description !== undefined ? productData.description : (currentProduct?.description || '');
      const newVars = productData.variants !== undefined ? productData.variants : (currentProduct?.variants || []);
      const newGender = productData.gender !== undefined ? productData.gender : (currentProduct?.gender || 'unisex');
      dbProduct.description = stringifyDescription(newDesc, newVars, newGender);
    }

    if (productData.originalPriceCNY !== undefined) dbProduct.original_price_cny = productData.originalPriceCNY;
    if (productData.salePriceCNY !== undefined) dbProduct.sale_price_cny = productData.salePriceCNY;
    if (productData.isOnSale !== undefined) dbProduct.is_on_sale = productData.isOnSale;
    if (productData.categoryId !== undefined) dbProduct.category_id = productData.categoryId || null;
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
