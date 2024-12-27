import React from 'react';
import { Challenge } from '../../features/gamification/challengesSlice';
import { useChallenges } from '../../features/gamification/hooks/useChallenges';

interface ChallengePanelProps {
  yearGroup: number;
}

export const ChallengesPanel: React.FC<ChallengePanelProps> = ({ yearGroup }) => {
  const { dailyChallenges } = useChallenges(yearGroup);

  const renderChallenge = (challenge: Challenge) => (
    <div 
      key={challenge.id}
      className={`p-4 rounded-lg border ${
        challenge.completed ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
      }`}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold text-lg">{challenge.title}</h3>
          <p className="text-gray-600">{challenge.description}</p>
        </div>
        <span className={`px-2 py-1 rounded text-sm ${
          challenge.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
          challenge.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {challenge.difficulty}
        </span>
      </div>

      <div className="mt-3">
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full transition-all"
            style={{
              width: `${(challenge.requirements.current / challenge.requirements.target) * 100}%`
            }}
          />
        </div>
        <p className="text-sm text-gray-600 mt-1">
          Progress: {challenge.requirements.current} / {challenge.requirements.target}
        </p>
      </div>

      <div className="mt-3 flex gap-2">
        <div className="flex items-center gap-1">
          <span>⭐</span>
          <span>{challenge.rewards.stars}</span>
        </div>
        {challenge.rewards.gems && (
          <div className="flex items-center gap-1">
            <span>💎</span>
            <span>{challenge.rewards.gems}</span>
          </div>
        )}
        <div className="flex items-center gap-1">
          <span>✨</span>
          <span>{challenge.rewards.experience} XP</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Daily Challenges</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {dailyChallenges.map(renderChallenge)}
      </div>
    </div>
  );
}; 
