'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { MassMessage } from '@/types/message';
import { PaginatedResponse } from '@/types/api';

export function useMessages(params?: Record<string, string | number>) {
  return useQuery({
    queryKey: ['messages', params],
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<MassMessage>>('/messages', { params });
      return data;
    },
  });
}

export function useCreateMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (message: Partial<MassMessage>) => {
      const { data } = await api.post('/messages', message);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['messages'] }),
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await api.post(`/messages/${id}/send`);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['messages'] }),
  });
}
