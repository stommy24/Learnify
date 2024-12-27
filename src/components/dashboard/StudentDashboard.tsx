import { useStudentDashboard } from '@/hooks/useStudentDashboard';
import { LearningPathCard, PerformanceCard, ScheduleCard } from '@/components/cards';

export function StudentDashboard() {
  const { learningPath, performance, schedule, loading } = useStudentDashboard();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {learningPath && <LearningPathCard currentModule={learningPath} />}
      {performance && <PerformanceCard performance={performance} />}
      {schedule && <ScheduleCard schedule={schedule} />}
    </div>
  );
} 
