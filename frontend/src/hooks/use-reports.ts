'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

interface ReportSummary {
  by_status: Record<string, number>;
  by_priority?: Record<string, number>;
  by_category?: Record<string, number>;
  by_type?: Record<string, number>;
  total: number;
}

export function useTicketsReport(params?: Record<string, string>) {
  return useQuery({
    queryKey: ['reports', 'tickets', params],
    queryFn: async () => {
      const { data } = await api.get<ReportSummary>('/reports/tickets', { params });
      return data;
    },
  });
}

export function useAssetsReport(params?: Record<string, string>) {
  return useQuery({
    queryKey: ['reports', 'assets', params],
    queryFn: async () => {
      const { data } = await api.get<ReportSummary>('/reports/assets', { params });
      return data;
    },
  });
}

export function useMaintenancesReport(params?: Record<string, string>) {
  return useQuery({
    queryKey: ['reports', 'maintenances', params],
    queryFn: async () => {
      const { data } = await api.get<ReportSummary>('/reports/maintenances', { params });
      return data;
    },
  });
}
