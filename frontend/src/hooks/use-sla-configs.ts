'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export interface SlaConfig {
  id: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  response_time_hours: number;
  resolution_time_hours: number;
  created_at: string;
  updated_at: string;
}

export function useSlaConfigs() {
  return useQuery({
    queryKey: ['sla-configs'],
    queryFn: async () => {
      const { data } = await api.get<{ data: SlaConfig[] }>('/sla-configs');
      return data.data;
    },
  });
}

export function useUpdateSlaConfig() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: { id: number; response_time_hours: number; resolution_time_hours: number }) => {
      const { data } = await api.put(`/sla-configs/${id}`, payload);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['sla-configs'] }),
  });
}

export function useCreateSlaConfig() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { priority: string; response_time_hours: number; resolution_time_hours: number }) => {
      const { data } = await api.post('/sla-configs', payload);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['sla-configs'] }),
  });
}
