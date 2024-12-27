import React from 'react';
import { Card } from '../common/Card';
import { ProgressBar } from '../common/ProgressBar';

interface TopicProgress {
  id: string;
  name: string;
  progress: number;
  totalItems: number;
  completedItems: number;
  lastAccessed: Date;
  mastery: 'none' | 'basic' | 'intermediate' | 'advanced';
}

interface SubjectProgress {
  id: string;
  name: string;
  topics: TopicProgress[];
  overallProgress: number;
}

export const ProgressTracker: React.FC<{
  subjects: SubjectProgress[];
}> = ({ subjects }) => {
  const getMasteryColor = (mastery: TopicProgress['mastery']) => {
    switch (mastery) {
      case 'advanced': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-blue-100 text-blue-800';
      case 'basic': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {subjects.map(subject => (
        <Card key={subject.id}>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">{subject.name}</h3>
              <span className="text-sm text-gray-500">
                {Math.round(subject.overallProgress)}% Complete
              </span>
            </div>

            <ProgressBar
              progress={subject.overallProgress}
              className="h-2"
            />

            <div className="space-y-3">
              {subject.topics.map(topic => (
                <div key={topic.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <span>{topic.name}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${getMasteryColor(topic.mastery)}`}>
                        {topic.mastery}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {topic.completedItems}/{topic.totalItems} completed
                    </span>
                  </div>
                  <ProgressBar
                    progress={topic.progress}
                    className="h-1.5"
                  />
                </div>
              ))}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}; 
