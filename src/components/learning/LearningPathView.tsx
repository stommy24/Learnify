import React from 'react';
import { useAppSelector } from '../../app/hooks';

export const LearningPathView: React.FC = () => {
  const learningPaths = useAppSelector(state => state.recommendations.learningPaths);
  const currentSubject = useAppSelector(state => state.curriculum.currentSubject);

  const currentPath = learningPaths[currentSubject];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Your Learning Path</h2>

      <div className="space-y-6">
        {currentPath.topics.map((topic, index) => (
          <div
            key={topic.id}
            className={`relative p-6 rounded-lg border ${
              topic.status === 'locked' ? 'bg-gray-50 border-gray-200' :
              topic.status === 'completed' ? 'bg-green-50 border-green-200' :
              'bg-white border-blue-200'
            }`}
          >
            {/* Connection Line */}
            {index < currentPath.topics.length - 1 && (
              <div className="absolute h-8 w-0.5 bg-gray-200 left-1/2 -bottom-8" />
            )}

            {/* Topic Content */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">{topic.name}</h3>
                <p className="text-sm text-gray-600">
                  Estimated time: {topic.estimatedTime} minutes
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded text-sm ${
                  topic.priority === 'high' ? 'bg-red-100 text-red-800' :
                  topic.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {topic.priority} priority
                </span>
                <span className="text-lg">
                  {topic.status === 'locked' ? '🔒' :
                   topic.status === 'completed' ? '✅' : '📚'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 
