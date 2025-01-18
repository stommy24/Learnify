import { useRouter } from 'next/router';
import { useMastery } from '@/hooks/useMastery';
import { useSession } from 'next-auth/react';

export default function MasteryPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { topicId } = router.query;
  
  const {
    progress,
    score,
    isLoading,
    error,
    submitAttempt
  } = useMastery(topicId as string);

  if (!session) {
    return <div>Please sign in to access this page</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const handleSubmit = async () => {
    await submitAttempt({
      topicId: topicId as string,
      correct: true, // This should come from actual user input
      timestamp: new Date()
    });
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Mastery Progress</h1>
      
      {progress ? (
        <div className="mb-4">
          <p>Current Level: {progress.currentLevel}</p>
          <p>Consecutive Successes: {progress.consecutiveSuccesses}</p>
          <p>Current Score: {score}</p>
        </div>
      ) : (
        <div>No progress found</div>
      )}

      <button
        onClick={handleSubmit}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Submit Attempt
      </button>
    </div>
  );
} 