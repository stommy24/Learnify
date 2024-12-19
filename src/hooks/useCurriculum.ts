import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface Curriculum {
  id: string;
  title: string;
  description: string;
  grade: string;
  subject: string;
  topics: string[];
  objectives: string[];
  createdAt: string;
  updatedAt: string;
}

export function useCurriculum() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCurriculum = async () => {
    try {
      setLoading(true);
      const { data, error: supabaseError } = await supabase
        .from('curriculum')
        .select('*');

      if (supabaseError) throw supabaseError;

      return data as Curriculum[];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while fetching curriculum';
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const createCurriculum = async (curriculum: Omit<Curriculum, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setLoading(true);
      const { data, error: supabaseError } = await supabase
        .from('curriculum')
        .insert([{ ...curriculum, createdAt: new Date().toISOString() }])
        .select();

      if (supabaseError) throw supabaseError;

      return data?.[0] as Curriculum;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while creating curriculum';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateCurriculum = async (id: string, updates: Partial<Curriculum>) => {
    try {
      setLoading(true);
      const { data, error: supabaseError } = await supabase
        .from('curriculum')
        .update({ ...updates, updatedAt: new Date().toISOString() })
        .eq('id', id)
        .select();

      if (supabaseError) throw supabaseError;

      return data?.[0] as Curriculum;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while updating curriculum';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    fetchCurriculum,
    createCurriculum,
    updateCurriculum,
  };
} 