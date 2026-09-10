'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export interface Attachment {
  id: number;
  file_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  user_id: number;
  created_at: string;
  user?: { id: number; name: string; email: string };
}

export function useAttachments(type: string, id: number) {
  return useQuery({
    queryKey: ['attachments', type, id],
    queryFn: async () => {
      const { data } = await api.get(`/${type}/${id}/attachments`);
      return data;
    },
    enabled: !!id,
  });
}

export function useCreateAttachment(type: string, id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      const { data } = await api.post(`/${type}/${id}/attachments`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attachments', type, id] });
    },
  });
}

export function useDeleteAttachment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (attachmentId: number) => {
      await api.delete(`/attachments/${attachmentId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attachments'] });
    },
  });
}
