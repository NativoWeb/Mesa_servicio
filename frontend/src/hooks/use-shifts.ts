'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Shift } from '@/types/shift';
import { PaginatedResponse } from '@/types/api';

export function useShifts(params?: Record<string, string | number>) {
  return useQuery({
    queryKey: ['shifts', params],
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<Shift>>('/shifts', { params });
      return data;
    },
  });
}

export function useShift(id: number) {
  return useQuery({
    queryKey: ['shifts', id],
    queryFn: async () => {
      const { data } = await api.get<Shift>(`/shifts/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

export function useCreateShift() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (shift: Partial<Shift>) => {
      const { data } = await api.post('/shifts', shift);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['shifts'] }),
  });
}
