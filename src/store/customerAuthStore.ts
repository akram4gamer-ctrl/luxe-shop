import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { idbStorage } from './storage';

export interface Customer {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  passwordHash: string; // Mock hash
  createdAt: string;
}

interface CustomerAuthState {
  user: Omit<Customer, 'passwordHash'> | null;
  users: Customer[]; // Mock database of users
  isAuthenticated: boolean;
  login: (email: string, passwordHash: string) => void;
  signup: (customer: Customer) => void;
  logout: () => void;
  checkEmailExists: (email: string) => boolean;
}

export const useCustomerAuthStore = create<CustomerAuthState>()(
  persist(
    (set, get) => ({
      user: null,
      users: [],
      isAuthenticated: false,
      login: (email, passwordHash) => {
        const { users } = get();
        const user = users.find((u) => u.email === email && u.passwordHash === passwordHash);
        if (user) {
          const { passwordHash: _, ...userWithoutPassword } = user;
          set({ user: userWithoutPassword, isAuthenticated: true });
        } else {
          throw new Error('Invalid email or password');
        }
      },
      signup: (customer) => {
        const { users } = get();
        if (users.some((u) => u.email === customer.email)) {
          throw new Error('Email already exists');
        }
        set({ users: [...users, customer] });
        const { passwordHash: _, ...userWithoutPassword } = customer;
        set({ user: userWithoutPassword, isAuthenticated: true });
      },
      logout: () => set({ user: null, isAuthenticated: false }),
      checkEmailExists: (email) => {
        const { users } = get();
        return users.some((u) => u.email === email);
      },
    }),
    {
      name: 'aura-customer-auth',
      storage: createJSONStorage(() => idbStorage),
    }
  )
);
