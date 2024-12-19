import { useState, useEffect } from 'react';
import { Question } from '@/services/question-generation/types';
import { useDebounce } from './useDebounce';

interface UseQuestionsProps {
  filters: Record<string, any>;
  searchQuery: string;
  initialPage?: number;
  pageSize?: number;
}

interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
}

export function useQuestions({
  filters,
  searchQuery,
  initialPage = 0,
  pageSize = 10
}: UseQuestionsProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({
    page: initialPage,
    pageSize,
    total: 0
  });

  const debouncedSearch = useDebounce(searchQuery, 300);
  const debouncedFilters = useDebounce(filters, 300);

  useEffect(() => {
    const fetchQuestions = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const queryParams = new URLSearchParams({
          page: pagination.page.toString(),
          pageSize: pagination.pageSize.toString(),
          search: debouncedSearch,
          ...debouncedFilters
        });

        const response = await fetch(`/api/questions?${queryParams}`);
        if (!response.ok) throw new Error('Failed to fetch questions');

        const data = await response.json();
        setQuestions(data.questions);
        setPagination(prev => ({ ...prev, total: data.total }));
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, [pagination.page, pagination.pageSize, debouncedSearch, debouncedFilters]);

  return {
    questions,
    isLoading,
    error,
    pagination,
    setPagination
  };
} 