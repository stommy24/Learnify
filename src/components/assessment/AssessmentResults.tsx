import { ObjectiveMasteryGrid } from '../progress/ObjectiveMasteryGrid';
import type { AssessmentResult } from '@/types/assessment';

interface Props {
  results: AssessmentResult[];
  objectives: {
    id: string;
    description: string;
  }[];
  onContinue: () => void;
}

export function AssessmentResults({ results, objectives, onContinue }: Props) {
  const calculateObjectiveMastery = (objectiveId: string) => {
    const relevantResults = results.filter(r => 
      r.questionId.startsWith(objectiveId)
    );
    
    if (relevantResults.length === 0) return 0;
    
    const correct = relevantResults.filter(r => r.isCorrect).length;
    return Math.round((correct / relevantResults.length) * 100);
  };

  const objectivesWithMastery = objectives.map(obj => ({
    ...obj,
    mastery: calculateObjectiveMastery(obj.id)
  }));

  const overallScore = Math.round(
    (results.filter(r => r.isCorrect).length / results.length) * 100
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Assessment Complete</h2>
        <p className="text-xl">
          Overall Score: <span className="font-bold">{overallScore}%</span>
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium mb-4">Objective Mastery</h3>
        <ObjectiveMasteryGrid objectives={objectivesWithMastery} />
      </div>

      <div className="flex justify-center">
        <button
          onClick={onContinue}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Continue Learning
        </button>
      </div>
    </div>
  );
} 