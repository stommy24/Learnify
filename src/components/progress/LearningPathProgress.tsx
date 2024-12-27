import { Progress } from '@/components/ui/Progress';
import type { LearningProgress } from '@/types/progress';

interface Props {
  progress: LearningProgress;
  showDetails?: boolean;
}

export function LearningPathProgress({ progress, showDetails = false }: Props) {
  const overallProgress = calculateOverallProgress(progress);
  const recentAssessments = progress.assessmentHistory.slice(-3);

  return (
    <div className="space-y-6 p-4 bg-white rounded-lg shadow">
      <div>
        <h3 className="text-lg font-medium mb-2">Overall Progress</h3>
        <Progress 
          value={overallProgress} 
          max={100}
          className="w-full" 
        />
        <p className="text-sm text-gray-600 mt-1">{overallProgress}% Complete</p>
      </div>

      {showDetails && (
        <div>
          <h4 className="text-md font-medium mb-2">Recent Assessments</h4>
          <div className="space-y-2">
            {recentAssessments.map((assessment, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span>{new Date(assessment.timestamp!).toLocaleDateString()}</span>
                <span className="font-medium">{assessment.score}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function calculateOverallProgress(progress: LearningProgress): number {
  const totalObjectives = Object.keys(progress.masteryLevel || {}).length;
  if (totalObjectives === 0) return 0;
  
  const masteredObjectives = Object.values(progress.masteryLevel)
    .filter(level => level >= 85)
    .length;
  
  return Math.round((masteredObjectives / totalObjectives) * 100);
} 