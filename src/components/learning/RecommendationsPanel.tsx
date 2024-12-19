import React from 'react';
import { useAppSelector } from '../../app/hooks';
import { Link } from 'react-router-dom';

export const RecommendationsPanel: React.FC = () => {
  const recommendations = useAppSelector(state => state.recommendations.recommendations);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Recommended for You</h2>

      <div className="grid gap-4 md:grid-cols-2">
        {recommendations.map(recommendation => (
          <Link
            key={recommendation.id}
            to={`/learn/${recommendation.subject}/${recommendation.topicId}`}
            className="block p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold">{recommendation.title}</h3>
              <span className={`px-2 py-1 rounded text-sm ${
                recommendation.priority === 'high' ? 'bg-red-100 text-red-800' :
                recommendation.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {recommendation.priority} priority
              </span>
            </div>

            <p className="text-gray-600 text-sm mb-4">
              {recommendation.description}
            </p>

            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>⏱️ {recommendation.estimatedTime} mins</span>
              <span>
                Difficulty: {'⭐'.repeat(recommendation.difficulty)}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}; 