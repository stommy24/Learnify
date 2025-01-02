import { FC } from 'react';
import { MasteryProgress as MasteryProgressType, MasteryLevel } from '@/types/mastery';

interface Props {
  progress: MasteryProgressType;
}

const LEVEL_NAMES: Record<MasteryLevel, string> = {
  NOVICE: 'Novice',
  PRACTICING: 'Practicing',
  COMPETENT: 'Competent',
  PROFICIENT: 'Proficient',
  EXPERT: 'Expert'
};

export const MasteryProgress: FC<Props> = ({ progress }) => {
  return (
    <div className="space-y-4">
      <div>
        <h3>Current Level</h3>
        <p>{LEVEL_NAMES[progress.currentLevel]}</p>
      </div>
      
      <div>
        <h3>Recent Attempts</h3>
        <div className="space-y-2">
          {progress.attempts?.map(attempt => (
            <div key={attempt.id} className="p-2 border rounded">
              <p>Score: {attempt.score}%</p>
              <p>Time: {attempt.timeSpent}s</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 