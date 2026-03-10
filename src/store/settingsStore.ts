import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface StoreSettings {
  storeName: string;
  storeDescription: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
}

interface SettingsState {
  settings: StoreSettings;
  updateSettings: (settings: Partial<StoreSettings>) => void;
}

const defaultSettings: StoreSettings = {
  storeName: "Luxe & Co.",
  storeDescription: "Premium luxury products curated for you.",
  heroTitle: "Timeless Elegance",
  heroSubtitle: "Discover our curated collection of premium fragrances and masterfully crafted timepieces.",
  heroImage: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=1999",
  contactEmail: "contact@luxeandco.com",
  contactPhone: "+1 (555) 123-4567",
  address: "123 Luxury Ave, New York, NY 10001",
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      settings: defaultSettings,
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),
    }),
    {
      name: 'settings-storage-v2',
    }
  )
);
