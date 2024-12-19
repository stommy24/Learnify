import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export const useStudentProgress = () => {
  const [students, setStudents] = useState([]);
  const [progress, setProgress] = useState({
    overall: [],
    maths: [],
    english: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStudentProgress();
  }, []);

  const fetchStudentProgress = async () => {
    try {
      setLoading(true);
      
      // Fetch students and their progress
      const { data: studentsData, error: studentsError } = await supabase
        .from('students')
        .select(`
          *,
          progress:student_progress(*)
        `);

      if (studentsError) throw studentsError;

      // Fetch overall progress metrics
      const { data: progressData, error: progressError } = await supabase
        .from('student_progress')
        .select('*')
        .order('date', { ascending: true });

      if (progressError) throw progressError;

      setStudents(studentsData);
      setProgress({
        overall: processProgressData(progressData, 'overall'),
        maths: processProgressData(progressData, 'maths'),
        english: processProgressData(progressData, 'english')
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { students, progress, loading, error };
}; 