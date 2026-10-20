'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Role, GroupedPermissions } from '@/types/role';

export function useRoles() {
  return useQuery({
    queryKey: ['roles'],
    queryFn: async () => {
      const { data } = await api.get<{ data: Role[] }>('/roles');
      return data.data;
    },
  });
}

export function usePermissions() {
  return useQuery({
    queryKey: ['permissions'],
    queryFn: async () => {
      const { data } = await api.get<{ data: GroupedPermissions }>('/permissions');
      return data.data;
    },
  });
}

export function useCreateRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (role: { name: string; description: string; permissions: string[] }) => {
      const { data } = await api.post('/roles', role);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['roles'] }),
  });
}

export function useUpdateRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...role }: { id: number; name: string; description: string; permissions: string[] }) => {
      const { data } = await api.put(`/roles/${id}`, role);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['roles'] }),
  });
}

export function useDeleteRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/roles/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['roles'] }),
  });
}
