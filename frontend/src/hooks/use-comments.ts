'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export interface Comment {
  id: number;
  body: string;
  is_internal: boolean;
  user_id: number;
  created_at: string;
  user?: { id: number; name: string; email: string; role: string };
}

export function useComments(type: string, id: number) {
  return useQuery({
    queryKey: ['comments', type, id],
    queryFn: async () => {
      const { data } = await api.get(`/${type}/${id}/comments`);
      return data;
    },
    enabled: !!id,
  });
}

export function useCreateComment(type: string, id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: { body: string; is_internal?: boolean }) => {
      const { data } = await api.post(`/${type}/${id}/comments`, body);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', type, id] });
      queryClient.invalidateQueries({ queryKey: ['tickets', id] });
    },
  });
}
