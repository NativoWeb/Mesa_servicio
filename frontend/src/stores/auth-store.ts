'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, UserRole } from '@/types/user';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  setHydrated: () => void;
}

const ROLE_ROUTES: Record<UserRole, string> = {
  admin: '/admin',
  it_leader: '/lider',
  technician: '/tecnico',
  inventory_manager: '/inventario',
  end_user: '/usuario',
  asset_holder: '/cuentadante',
};

export function getRoleRoute(role: UserRole): string {
  return ROLE_ROUTES[role] || '/usuario';
}

export const ROLE_LABELS: Record<UserRole, string> = {
  admin: 'Administrador',
  it_leader: 'Líder TIC',
  technician: 'Técnico de Soporte',
  inventory_manager: 'Gestor de Inventario',
  end_user: 'Usuario',
  asset_holder: 'Cuentadante',
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isHydrated: false,
      setAuth: (user, token) => {
        set({ user, token, isAuthenticated: true });
      },
      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
      },
      setHydrated: () => {
        set({ isHydrated: true });
      },
    }),
    {
      name: 'auth-storage',
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    }
  )
);
