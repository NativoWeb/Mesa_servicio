'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Maintenance } from '@/types/maintenance';
import { PaginatedResponse } from '@/types/api';

export function useMaintenances(params?: Record<string, string | number>) {
  return useQuery({
    queryKey: ['maintenances', params],
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<Maintenance>>('/maintenances', { params });
      return data;
    },
  });
}

export function useMaintenance(id: number) {
  return useQuery({
    queryKey: ['maintenances', id],
    queryFn: async () => {
      const { data } = await api.get<Maintenance>(`/maintenances/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

export function useCreateMaintenance() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (maintenance: Partial<Maintenance>) => {
      const { data } = await api.post('/maintenances', maintenance);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['maintenances'] }),
  });
}

export function useUpdateMaintenance() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...maintenance }: Partial<Maintenance> & { id: number }) => {
      const { data } = await api.put(`/maintenances/${id}`, maintenance);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['maintenances'] }),
  });
}
