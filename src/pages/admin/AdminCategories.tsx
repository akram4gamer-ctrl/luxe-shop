import React, { useState } from 'react';
import { useCategoryStore } from '@/store/categoryStore';
import { Button } from '@/components/ui/Button';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export function AdminCategories() {
  const { categories, addCategory, updateCategory, deleteCategory } = useCategoryStore();
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', slug: '', description: '' });

  const handleEdit = (category: any) => {
    setIsEditing(category.id);
    setFormData({ name: category.name, slug: category.slug, description: category.description });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await deleteCategory(id);
        toast.success('Category deleted successfully');
      } catch (error: any) {
        toast.error(error.message || 'Failed to delete category');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing && isEditing !== 'new') {
        await updateCategory(isEditing, formData);
        toast.success('Category updated successfully');
      } else {
        await addCategory(formData);
        toast.success('Category added successfully');
      }
      setIsEditing(null);
      setFormData({ name: '', slug: '', description: '' });
    } catch (error: any) {
      toast.error(error.message || 'Failed to save category');
      console.error(error);
    }
  };

  const handleSeedCategories = async () => {
    try {
      const bagsExists = categories.some(c => c.slug === 'bags');
      const glassesExists = categories.some(c => c.slug === 'glasses');

      if (!bagsExists) {
        await addCategory({
          name: 'Bags',
          slug: 'bags',
          description: 'Luxury bags and accessories'
        });
      }
      
      if (!glassesExists) {
        await addCategory({
          name: 'Glasses',
          slug: 'glasses',
          description: 'Designer sunglasses and eyewear'
        });
      }

      if (bagsExists && glassesExists) {
        toast.info('Bags and Glasses categories already exist');
      } else {
        toast.success('Successfully added Bags and Glasses categories');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to seed categories');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-serif mb-2">Categories</h1>
          <p className="text-gray-500">Manage your product categories.</p>
        </div>
        <div className="flex gap-4">
          {!isEditing && (
            <>
              <Button variant="outline" onClick={handleSeedCategories} className="flex items-center gap-2">
                <Plus className="w-4 h-4" /> Add Bags & Glasses
              </Button>
              <Button onClick={() => setIsEditing('new')} className="flex items-center gap-2">
                <Plus className="w-4 h-4" /> Add Category
              </Button>
            </>
          )}
        </div>
      </div>

      {isEditing && (
        <form onSubmit={handleSubmit} className="bg-white p-6 border border-gray-100 rounded-lg mb-8 space-y-4">
          <h2 className="text-lg font-medium mb-4">{isEditing === 'new' ? 'Add New Category' : 'Edit Category'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full border border-gray-200 px-4 py-2 focus:border-gold-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full border border-gray-200 px-4 py-2 focus:border-gold-500 outline-none"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={2}
                className="w-full border border-gray-200 px-4 py-2 focus:border-gold-500 outline-none resize-none"
                required
              />
            </div>
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <Button type="button" variant="outline" onClick={() => { setIsEditing(null); setFormData({ name: '', slug: '', description: '' }); }}>
              Cancel
            </Button>
            <Button type="submit">
              {isEditing === 'new' ? 'Add Category' : 'Save Changes'}
            </Button>
          </div>
        </form>
      )}

      <div className="bg-white border border-gray-100 rounded-lg overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-6 py-4 text-sm font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-4 text-sm font-medium text-gray-500 uppercase tracking-wider">Slug</th>
              <th className="px-6 py-4 text-sm font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-4 text-sm font-medium text-gray-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {categories.map((category) => (
              <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-900">{category.name}</td>
                <td className="px-6 py-4 text-gray-500">{category.slug}</td>
                <td className="px-6 py-4 text-gray-500">{category.description}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <button
                      onClick={() => handleEdit(category)}
                      className="text-gray-400 hover:text-gold-600 transition-colors"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                  No categories found. Add one to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
