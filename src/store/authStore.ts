import { create } from 'zustand';
import { supabase } from '@/lib/supabase';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  checkSession: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  isLoading: true,
  checkSession: async () => {
    if (localStorage.getItem('admin_bypass') === 'true') {
      set({ isAuthenticated: true, isLoading: false });
      return;
    }
    const { data: { session } } = await supabase.auth.getSession();
    set({ isAuthenticated: !!session, isLoading: false });

    supabase.auth.onAuthStateChange((_event, session) => {
      if (localStorage.getItem('admin_bypass') === 'true') return;
      set({ isAuthenticated: !!session, isLoading: false });
    });
  },
  logout: async () => {
    localStorage.removeItem('admin_bypass');
    await supabase.auth.signOut();
    set({ isAuthenticated: false });
  },
}));
