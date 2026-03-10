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
    const { data: { session } } = await supabase.auth.getSession();
    set({ isAuthenticated: !!session, isLoading: false });

    supabase.auth.onAuthStateChange((_event, session) => {
      set({ isAuthenticated: !!session, isLoading: false });
    });
  },
  logout: async () => {
    await supabase.auth.signOut();
    set({ isAuthenticated: false });
  },
}));
