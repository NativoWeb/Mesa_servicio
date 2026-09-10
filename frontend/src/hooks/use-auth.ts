'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore, getRoleRoute } from '@/stores/auth-store';
import api from '@/lib/api';
import { LoginRequest, LoginResponse } from '@/types/api';
import { User } from '@/types/user';

export function useAuth() {
  const router = useRouter();
  const { user, isAuthenticated, setAuth, logout: clearAuth } = useAuthStore();

  const login = async (credentials: LoginRequest) => {
    const { data } = await api.post<LoginResponse>('/auth/login', credentials);
    setAuth(data.user, data.token);
    const route = getRoleRoute(data.user.role);
    router.push(route);
    return data.user;
  };

  const fetchUser = async (): Promise<User | null> => {
    try {
      const { data } = await api.get<User>('/auth/me');
      const token = useAuthStore.getState().token;
      if (token) setAuth(data, token);
      return data;
    } catch {
      clearAuth();
      return null;
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Token ya expiró, no importa
    }
    clearAuth();
    router.push('/login');
  };

  return { user, isAuthenticated, login, logout, fetchUser };
}
