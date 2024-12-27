import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

interface Props {
  objectives: string[];
  masteryLevels: { [key: string]: number };
}

export function ObjectivesList({ objectives, masteryLevels }: Props) {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Learning Objectives</h2>
      <div className="space-y-2">
        {objectives.map(objective => (
          <div key={objective} className="flex items-center justify-between">
            <span>{objective}</span>
            <div className="flex items-center space-x-2">
              <span>{masteryLevels[objective]}%</span>
              {masteryLevels[objective] >= 85 ? (
                <CheckCircleIcon className="w-5 h-5 text-green-500" />
              ) : (
                <XCircleIcon className="w-5 h-5 text-red-500" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 