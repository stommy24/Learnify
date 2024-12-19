import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSocket } from '@/hooks/useSocket';
import { api } from '@/lib/api';

interface Content {
  id: string;
  title: string;
  type: string;
  data: unknown;
}

interface ApiResponse<T> {
  data: T;
  error?: string;
}

export function useDataManagement() {
  const queryClient = useQueryClient();
  const socket = useSocket();
  const [error, setError] = useState<string | null>(null);

  const { data: content, isLoading } = useQuery<ApiResponse<Content[]>>({
    queryKey: ['content'],
    queryFn: async () => {
      const response = await api.get<ApiResponse<Content[]>>('/content');
      return response.data;
    },
  });

  const createContent = useMutation({
    mutationFn: async (newContent: Omit<Content, 'id'>) => {
      const response = await api.post<ApiResponse<Content>>('/content', newContent);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content'] });
      socket?.emit('content:updated');
    },
    onError: (err: Error) => {
      setError(err.message);
    },
  });

  const updateContent = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Content> }) => {
      const response = await api.patch<ApiResponse<Content>>(`/content/${id}`, updates);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content'] });
      socket?.emit('content:updated');
    },
    onError: (err: Error) => {
      setError(err.message);
    },
  });

  return {
    content: content?.data ?? [],
    isLoading,
    error,
    createContent: createContent.mutate,
    updateContent: updateContent.mutate,
  };
}

// ... more custom hooks 