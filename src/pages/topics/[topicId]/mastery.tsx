import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { MasteryAttemptForm } from '@/components/mastery/MasteryAttemptForm';
import { MasteryProgress } from '@/components/mastery/MasteryProgress';
import { useMastery } from '@/hooks/useMastery';
import { useAuth } from '@/hooks/useAuth';

export default function MasteryPage() {
  const router = useRouter();
  const { session } = useAuth();
  const { topicId } = router.query;
  
  const { 
    progress, 
    loading, 
    error, 
    submitAttempt,
    fetchProgress 
  } = useMastery({
    studentId: session?.user?.id || '',
    skillId: topicId as string
  });

  useEffect(() => {
    if (session?.user && topicId) {
      fetchProgress();
    }
  }, [session, topicId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!progress) return <div>No progress found</div>;

  return (
    <div className="space-y-8">
      <MasteryProgress progress={progress} />
      <MasteryAttemptForm onSubmit={submitAttempt} />
    </div>
  );
} 