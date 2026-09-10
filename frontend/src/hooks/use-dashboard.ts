'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Ticket } from '@/types/ticket';

interface TicketCounts {
  total: number;
  open: number;
  in_progress: number;
  pending: number;
  escalated: number;
  closed: number;
  closed_today: number;
}

interface AssetCounts {
  total: number;
  operational: number;
  damaged: number;
  decommissioned: number;
}

interface TechnicianLoad {
  id: number;
  name: string;
  campus: string;
  open_tickets: number;
}

interface WeeklyData {
  day: string;
  date: string;
  creados: number;
  resueltos: number;
}

export interface DashboardData {
  tickets: TicketCounts;
  assets: AssetCounts;
  maintenances: { total: number; pending_this_month: number };
  users: { total: number };
  // Datos extra para admin/lider
  tickets_by_priority?: Record<string, number>;
  tickets_weekly?: WeeklyData[];
  technician_workload?: TechnicianLoad[];
  unassigned_tickets?: Ticket[];
  // Datos extra para técnico
  my_tickets?: { open: number; in_progress: number; pending: number; closed_today: number };
  // Datos extra para cuentadante
  my_assets?: { total: number; damaged: number; maintenance_this_month: number };
}

export function useDashboard() {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const { data } = await api.get<DashboardData>('/dashboard');
      return data;
    },
  });
}
