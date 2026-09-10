'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Asset } from '@/types/asset';
import { PaginatedResponse } from '@/types/api';

export function useAssets(params?: Record<string, string | number>) {
  return useQuery({
    queryKey: ['assets', params],
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<Asset>>('/assets', { params });
      return data;
    },
  });
}

export function useAsset(id: number) {
  return useQuery({
    queryKey: ['assets', id],
    queryFn: async () => {
      const { data } = await api.get<{ data: Asset }>(`/assets/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
}

export function useCreateAsset() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (asset: Partial<Asset>) => {
      const { data } = await api.post('/assets', asset);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['assets'] }),
  });
}

export function useUpdateAsset() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...asset }: Partial<Asset> & { id: number }) => {
      const { data } = await api.put(`/assets/${id}`, asset);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['assets'] }),
  });
}

export function useDeleteAsset() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/assets/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['assets'] }),
  });
}
