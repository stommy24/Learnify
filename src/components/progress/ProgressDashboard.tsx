import { AssessmentResult } from '@/lib/types/assessment';
import { Adaptation } from '@/types/adaptive';
import { LearningProgress } from '@/types/progress';
import { ProgressChart } from './ProgressChart';

interface Props {
  studentProgress: LearningProgress;
  adaptations: Adaptation[];
}

export function ProgressDashboard({ studentProgress, adaptations }: Props) {
  return (
    <div className="progress-dashboard">
      <h2>Learning Progress</h2>
      
      <div className="progress-charts">
        <ProgressChart progress={studentProgress} />
      </div>
      
      <div className="adaptations">
        {adaptations.map((adaptation, index) => (
          <div key={index} className="adaptation-item">
            {adaptation.description}
          </div>
        ))}
      </div>
    </div>
  );
} 