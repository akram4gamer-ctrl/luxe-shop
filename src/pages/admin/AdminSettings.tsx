import React, { useState } from 'react';
import { useSettingsStore } from '@/store/settingsStore';
import { Button } from '@/components/ui/Button';
import { toast } from 'sonner';

export function AdminSettings() {
  const { settings, updateSettings } = useSettingsStore();
  const [formData, setFormData] = useState(settings);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    toast.success('Store settings updated successfully');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-serif mb-2">Store Settings</h1>
        <p className="text-gray-500">Manage your store's general information and appearance.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 border border-gray-100 rounded-lg">
        <div className="space-y-4">
          <h2 className="text-lg font-medium border-b border-gray-100 pb-2">General Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
              <input
                type="text"
                name="storeName"
                value={formData.storeName}
                onChange={handleChange}
                className="w-full border border-gray-200 px-4 py-2 focus:border-gold-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
              <input
                type="email"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleChange}
                className="w-full border border-gray-200 px-4 py-2 focus:border-gold-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
              <input
                type="text"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleChange}
                className="w-full border border-gray-200 px-4 py-2 focus:border-gold-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full border border-gray-200 px-4 py-2 focus:border-gold-500 outline-none"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Store Description</label>
              <textarea
                name="storeDescription"
                value={formData.storeDescription}
                onChange={handleChange}
                rows={3}
                className="w-full border border-gray-200 px-4 py-2 focus:border-gold-500 outline-none resize-none"
                required
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-medium border-b border-gray-100 pb-2">Hero Section</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hero Title</label>
              <input
                type="text"
                name="heroTitle"
                value={formData.heroTitle}
                onChange={handleChange}
                className="w-full border border-gray-200 px-4 py-2 focus:border-gold-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hero Image URL</label>
              <input
                type="url"
                name="heroImage"
                value={formData.heroImage}
                onChange={handleChange}
                className="w-full border border-gray-200 px-4 py-2 focus:border-gold-500 outline-none"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Hero Subtitle</label>
              <textarea
                name="heroSubtitle"
                value={formData.heroSubtitle}
                onChange={handleChange}
                rows={2}
                className="w-full border border-gray-200 px-4 py-2 focus:border-gold-500 outline-none resize-none"
                required
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </div>
  );
}
