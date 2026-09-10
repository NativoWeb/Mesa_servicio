'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { PaginatedResponse } from '@/types/api';

export interface Notification {
  id: number;
  description: string;
  subject_type: string;
  subject_id: number;
  causer_id: number;
  properties: Record<string, unknown>;
  created_at: string;
  causer?: { id: number; name: string };
}

export function useNotifications(params?: Record<string, string | number>) {
  return useQuery({
    queryKey: ['notifications', params],
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<Notification>>('/notifications', { params });
      return data;
    },
  });
}
