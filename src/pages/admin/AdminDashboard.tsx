import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProductStore } from '@/store/productStore';
import { useCategoryStore } from '@/store/categoryStore';
import { formatCurrency, getDiscountPercentage } from '@/lib/utils';
import { Button, buttonVariants } from '@/components/ui/Button';
import { Edit, Trash2, Plus } from 'lucide-react';

export function AdminDashboard() {
  const { products, deleteProduct } = useProductStore();
  const { categories } = useCategoryStore();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProduct(id);
    }
    setDeleteId(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-serif">Products</h2>
        <Link to="/admin/products/new" className={buttonVariants({ size: 'sm' })}>
          <Plus className="w-4 h-4 mr-2" /> Add Product
        </Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-medium">Product</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Original Price</th>
                <th className="px-6 py-4 font-medium">Sale Price</th>
                <th className="px-6 py-4 font-medium">Discount</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-100 flex-shrink-0">
                        <img 
                          src={product.images[0]} 
                          alt={product.name} 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{product.name}</p>
                        <p className="text-xs text-gray-500 truncate max-w-[200px]">{product.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {categories.find(c => c.id === product.categoryId)?.name || 'Unknown'}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-500">
                    {formatCurrency(product.originalPriceCNY ?? (product as any).price ?? 0)}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {product.isOnSale && product.salePriceCNY ? formatCurrency(product.salePriceCNY) : '-'}
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {product.isOnSale && product.salePriceCNY ? (
                      <span className="text-green-600 font-medium">{getDiscountPercentage(product.originalPriceCNY ?? (product as any).price ?? 0, product.salePriceCNY)}%</span>
                    ) : '-'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium w-fit ${product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                      {product.isOnSale && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium w-fit bg-gold-100 text-gold-800">
                          On Sale
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link 
                        to={`/admin/products/${product.id}/edit`}
                        className="p-2 text-gray-400 hover:text-gold-600 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button 
                        onClick={() => handleDelete(product.id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    No products found. Add one to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
