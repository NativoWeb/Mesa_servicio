'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { PaginatedResponse } from '@/types/api';

export interface AuditLog {
  id: number;
  log_name: string;
  description: string;
  subject_type: string | null;
  subject_id: number | null;
  causer_type: string | null;
  causer_id: number | null;
  properties: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  causer: { id: number; name: string; email: string } | null;
}

export function useAuditLogs(params?: Record<string, string | number>) {
  return useQuery({
    queryKey: ['audit-logs', params],
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<AuditLog>>('/audit-logs', { params });
      return data;
    },
  });
}
