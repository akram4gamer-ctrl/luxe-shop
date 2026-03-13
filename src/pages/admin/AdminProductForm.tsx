import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useProductStore } from '@/store/productStore';
import { useCategoryStore } from '@/store/categoryStore';
import { Button, buttonVariants } from '@/components/ui/Button';
import { ArrowLeft, Upload, X, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { ProductVariant } from '@/types';

export function AdminProductForm() {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { products, addProduct, updateProduct } = useProductStore();
  const { categories } = useCategoryStore();
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    originalPriceCNY: '',
    salePriceCNY: '',
    isOnSale: false,
    categoryId: categories[0]?.id || '',
    images: [] as string[],
    inStock: true,
    featured: false,
  });

  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    if (isEdit && id) {
      const product = products.find(p => p.id === id);
      if (product) {
        setFormData({
          name: product.name,
          slug: product.slug,
          description: product.description,
          originalPriceCNY: (product.originalPriceCNY ?? (product as any).price ?? 0).toString(),
          salePriceCNY: product.salePriceCNY?.toString() || '',
          isOnSale: product.isOnSale || false,
          categoryId: product.categoryId,
          images: [...product.images],
          inStock: product.inStock,
          featured: product.featured || false,
        });
        setVariants(product.variants || []);
      } else {
        toast.error('Product not found');
        navigate('/admin');
      }
    }
  }, [id, isEdit, products, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
      
      // Auto-generate slug from name if not editing
      if (name === 'name' && !isEdit) {
        setFormData(prev => ({ 
          ...prev, 
          slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') 
        }));
      }
    }
  };

  const handleAddVariant = () => {
    setVariants([...variants, { id: Date.now().toString(), name: '', priceCNY: null, inStock: true }]);
  };

  const handleRemoveVariant = (id: string) => {
    setVariants(variants.filter(v => v.id !== id));
  };

  const handleVariantChange = (id: string, field: keyof ProductVariant, value: any) => {
    setVariants(variants.map(v => v.id === id ? { ...v, [field]: value } : v));
  };

  const handleAddImage = () => {
    if (imageUrl.trim()) {
      setFormData(prev => ({ ...prev, images: [...prev.images, imageUrl.trim()] }));
      setImageUrl('');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (e.g., limit to 10MB) to prevent localStorage quota exceeded
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB. Please compress your image or use an image URL instead.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setFormData(prev => ({ ...prev, images: [...prev.images, base64String] }));
    };
    reader.onerror = () => {
      toast.error('Failed to read file');
    };
    reader.readAsDataURL(file);
    
    // Reset the input so the same file can be uploaded again if removed
    e.target.value = '';
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.images.length === 0) {
      toast.error('Please add at least one image');
      return;
    }

    const originalPriceCNY = Number(formData.originalPriceCNY);
    if (originalPriceCNY <= 0) {
      toast.error('Original price must be greater than 0');
      return;
    }

    let salePriceCNY = null;
    if (formData.isOnSale) {
      salePriceCNY = Number(formData.salePriceCNY);
      if (salePriceCNY <= 0) {
        toast.error('Sale price must be greater than 0');
        return;
      }
      if (salePriceCNY >= originalPriceCNY) {
        toast.error('Sale price must be less than original price');
        return;
      }
    }

    // Clean variants
    const cleanedVariants = variants.filter(v => v.name.trim() !== '').map(v => ({
      ...v,
      priceCNY: v.priceCNY ? Number(v.priceCNY) : null
    }));

    const productData = {
      name: formData.name,
      slug: formData.slug,
      description: formData.description,
      originalPriceCNY,
      salePriceCNY,
      isOnSale: formData.isOnSale,
      categoryId: formData.categoryId,
      images: formData.images,
      inStock: formData.inStock,
      featured: formData.featured,
      variants: cleanedVariants,
    };

    try {
      if (isEdit && id) {
        await updateProduct(id, productData);
        toast.success('Product updated successfully');
      } else {
        await addProduct(productData);
        toast.success('Product added successfully');
      }
      navigate('/admin');
    } catch (error: any) {
      toast.error(error.message || 'Failed to save product');
      console.error(error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/admin" className="p-2 text-gray-500 hover:text-black transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h2 className="text-2xl font-serif">{isEdit ? 'Edit Product' : 'Add New Product'}</h2>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 p-8 rounded-sm space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Product Name</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-200 px-4 py-2 outline-none focus:border-gold-500 transition-colors"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">URL Slug</label>
            <input
              type="text"
              name="slug"
              required
              value={formData.slug}
              onChange={handleChange}
              className="w-full border border-gray-200 px-4 py-2 outline-none focus:border-gold-500 transition-colors bg-gray-50"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Original Price (¥ CNY)</label>
            <input
              type="number"
              name="originalPriceCNY"
              required
              min="0"
              step="0.01"
              value={formData.originalPriceCNY}
              onChange={handleChange}
              className="w-full border border-gray-200 px-4 py-2 outline-none focus:border-gold-500 transition-colors"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select
              name="categoryId"
              required
              value={formData.categoryId}
              onChange={handleChange}
              className="w-full border border-gray-200 px-4 py-2 outline-none focus:border-gold-500 transition-colors bg-white"
            >
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-gray-50 p-6 border border-gray-200 rounded-sm space-y-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="isOnSale"
              checked={formData.isOnSale}
              onChange={handleChange}
              className="w-4 h-4 accent-gold-500"
            />
            <span className="text-sm font-medium text-gray-900">Enable Sale Pricing</span>
          </label>
          
          {formData.isOnSale && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-200">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Sale Price (¥ CNY)</label>
                <input
                  type="number"
                  name="salePriceCNY"
                  required={formData.isOnSale}
                  min="0"
                  step="0.01"
                  value={formData.salePriceCNY}
                  onChange={handleChange}
                  className="w-full border border-gray-200 px-4 py-2 outline-none focus:border-gold-500 transition-colors bg-white"
                />
              </div>
              <div className="flex items-end pb-2">
                {formData.originalPriceCNY && formData.salePriceCNY && Number(formData.salePriceCNY) < Number(formData.originalPriceCNY) ? (
                  <span className="text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded-sm border border-green-200">
                    {Math.round(((Number(formData.originalPriceCNY) - Number(formData.salePriceCNY)) / Number(formData.originalPriceCNY)) * 100)}% Discount
                  </span>
                ) : null}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700">Product Variants</label>
            <Button type="button" variant="outline" size="sm" onClick={handleAddVariant} className="flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add Variant
            </Button>
          </div>
          
          {variants.length > 0 && (
            <div className="space-y-3">
              {variants.map((variant, index) => (
                <div key={variant.id} className="flex flex-col gap-4 p-4 border border-gray-200 bg-gray-50 rounded-sm">
                  <div className="flex items-center gap-4">
                    <div className="flex-1 space-y-2">
                      <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">Variant Name</label>
                      <input
                        type="text"
                        value={variant.name}
                        onChange={(e) => handleVariantChange(variant.id, 'name', e.target.value)}
                        placeholder="e.g. Small, Red, 128GB"
                        className="w-full border border-gray-200 px-3 py-1.5 text-sm outline-none focus:border-gold-500 bg-white"
                        required
                      />
                    </div>
                    <div className="w-32 space-y-2">
                      <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">Price (¥)</label>
                      <input
                        type="number"
                        value={variant.priceCNY || ''}
                        onChange={(e) => handleVariantChange(variant.id, 'priceCNY', e.target.value ? Number(e.target.value) : null)}
                        placeholder="Optional"
                        min="0"
                        step="0.01"
                        className="w-full border border-gray-200 px-3 py-1.5 text-sm outline-none focus:border-gold-500 bg-white"
                      />
                    </div>
                    <div className="w-24 space-y-2">
                      <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">In Stock</label>
                      <div className="flex items-center h-9">
                        <input
                          type="checkbox"
                          checked={variant.inStock}
                          onChange={(e) => handleVariantChange(variant.id, 'inStock', e.target.checked)}
                          className="w-4 h-4 accent-gold-500"
                        />
                      </div>
                    </div>
                    <div className="pt-6">
                      <button
                        type="button"
                        onClick={() => handleRemoveVariant(variant.id)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        title="Remove variant"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <div className="flex-1 space-y-2">
                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">Variant Image (Optional)</label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={variant.image || ''}
                        onChange={(e) => handleVariantChange(variant.id, 'image', e.target.value)}
                        placeholder="https://example.com/image.jpg"
                        className="flex-1 border border-gray-200 px-3 py-1.5 text-sm outline-none focus:border-gold-500 bg-white"
                      />
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            if (file.size > 10 * 1024 * 1024) {
                              toast.error('File size must be less than 10MB.');
                              return;
                            }
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              handleVariantChange(variant.id, 'image', reader.result as string);
                            };
                            reader.readAsDataURL(file);
                            e.target.value = '';
                          }}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          title="Upload image"
                        />
                        <Button type="button" variant="secondary" size="sm" className="h-full px-3">
                          Upload
                        </Button>
                      </div>
                      {variant.image && (
                        <div className="w-9 h-9 border border-gray-200 rounded-sm overflow-hidden flex-shrink-0 relative group">
                          <img src={variant.image} alt="Variant" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          <button
                            type="button"
                            onClick={() => handleVariantChange(variant.id, 'image', null)}
                            className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-4 h-4 text-white" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            required
            rows={4}
            value={formData.description}
            onChange={handleChange}
            className="w-full border border-gray-200 px-4 py-2 outline-none focus:border-gold-500 transition-colors resize-y"
          />
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">Images</label>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 flex gap-2">
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Image URL (e.g., https://example.com/image.jpg)"
                className="flex-1 border border-gray-200 px-4 py-2 outline-none focus:border-gold-500 transition-colors"
              />
              <Button type="button" variant="secondary" onClick={handleAddImage}>
                Add URL
              </Button>
            </div>
            <div className="flex items-center justify-center">
              <span className="text-gray-400 text-sm px-2">OR</span>
            </div>
            <div className="flex-1">
              <label className="flex items-center justify-center w-full border border-gray-200 border-dashed px-4 py-2 cursor-pointer hover:border-gold-500 hover:bg-gray-50 transition-colors">
                <Upload className="w-4 h-4 mr-2 text-gray-500" />
                <span className="text-sm text-gray-600">Upload File (Max 10MB)</span>
                <input 
                  type="file" 
                  accept="image/jpeg, image/png, image/webp" 
                  onChange={handleFileUpload} 
                  className="hidden" 
                />
              </label>
            </div>
          </div>
          
          {formData.images.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
              {formData.images.map((img, idx) => (
                <div key={idx} className="relative aspect-square bg-gray-100 border border-gray-200 group">
                  <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-2 right-2 p-1 bg-white text-red-500 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-6 pt-4 border-t border-gray-100">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="inStock"
              checked={formData.inStock}
              onChange={handleChange}
              className="w-4 h-4 accent-gold-500"
            />
            <span className="text-sm font-medium text-gray-700">In Stock</span>
          </label>
          
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="featured"
              checked={formData.featured}
              onChange={handleChange}
              className="w-4 h-4 accent-gold-500"
            />
            <span className="text-sm font-medium text-gray-700">Featured Product</span>
          </label>
        </div>

        <div className="pt-6 flex justify-end gap-4">
          <Link to="/admin" className={buttonVariants({ variant: 'outline' })}>
            Cancel
          </Link>
          <Button type="submit">
            {isEdit ? 'Save Changes' : 'Create Product'}
          </Button>
        </div>
      </form>
    </div>
  );
}
