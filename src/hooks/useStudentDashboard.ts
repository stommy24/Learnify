import { useState, useEffect } from 'react';

interface LearningPath {
  currentModule: string;
  progress: number;
  nextLesson: string;
}

interface Performance {
  overallScore: number;
  recentActivities: Array<{
    date: string;
    score: number;
    activity: string;
  }>;
}

interface Schedule {
  upcoming: Array<{
    id: string;
    title: string;
    date: string;
    type: string;
  }>;
}

export function useStudentDashboard() {
  const [learningPath, setLearningPath] = useState<LearningPath | null>(null);
  const [performance, setPerformance] = useState<Performance | null>(null);
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data here
    // This is a placeholder - implement actual data fetching
    setLoading(false);
  }, []);

  return {
    learningPath,
    performance,
    schedule,
    loading,
  };
}

export { useStudentDashboard } from './useStudentDashboard'; 