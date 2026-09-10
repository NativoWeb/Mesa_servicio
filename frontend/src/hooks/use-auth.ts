'use client';

import { useAuthStore } from '@/stores/auth-store';
import api from '@/lib/api';
import { LoginRequest, LoginResponse } from '@/types/api';

export function useAuth() {
  const { user, isAuthenticated, setAuth, logout } = useAuthStore();

  const login = async (credentials: LoginRequest) => {
    const { data } = await api.post<LoginResponse>('/auth/login', credentials);
    setAuth(data.user, data.token);
    return data.user;
  };

  const fetchUser = async () => {
    const { data } = await api.get('/auth/me');
    const token = localStorage.getItem('token');
    if (token) setAuth(data.data, token);
    return data.data;
  };

  return { user, isAuthenticated, login, logout, fetchUser };
}
