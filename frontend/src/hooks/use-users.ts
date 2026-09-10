'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { User } from '@/types/user';
import { PaginatedResponse } from '@/types/api';

export function useUsers(params?: Record<string, string | number>) {
  return useQuery({
    queryKey: ['users', params],
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<User>>('/users', { params });
      return data;
    },
  });
}

export function useUser(id: number) {
  return useQuery({
    queryKey: ['users', id],
    queryFn: async () => {
      const { data } = await api.get<User>(`/users/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (user: Partial<User> & { password: string; role: string }) => {
      const { data } = await api.post('/users', user);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...user }: Partial<User> & { id: number; password?: string; role?: string }) => {
      const { data } = await api.put(`/users/${id}`, user);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/users/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });
}
