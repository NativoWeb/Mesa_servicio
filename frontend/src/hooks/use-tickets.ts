'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Ticket } from '@/types/ticket';
import { PaginatedResponse } from '@/types/api';

export function useTickets(params?: Record<string, string | number>) {
  return useQuery({
    queryKey: ['tickets', params],
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<Ticket>>('/tickets', { params });
      return data;
    },
  });
}

export function useTicket(id: number) {
  return useQuery({
    queryKey: ['tickets', id],
    queryFn: async () => {
      const { data } = await api.get<{ data: Ticket }>(`/tickets/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
}

export function useCreateTicket() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ticket: Partial<Ticket>) => {
      const { data } = await api.post('/tickets', ticket);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tickets'] }),
  });
}

export function useUpdateTicket() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...ticket }: Partial<Ticket> & { id: number }) => {
      const { data } = await api.put(`/tickets/${id}`, ticket);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

export function useDeleteTicket() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/tickets/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}
