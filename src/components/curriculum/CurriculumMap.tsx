import { useState } from 'react';
import type { CurriculumTopic } from '@/types/curriculum';
import { TopicNode } from './TopicNode';
import { TopicConnection } from './TopicConnection';

interface Props {
  topics: CurriculumTopic[];
  currentTopicId: string;
  completedTopics: string[];
}

export function CurriculumMap({ topics, currentTopicId, completedTopics }: Props) {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  return (
    <div className="relative w-full h-[600px] bg-gray-50 rounded-lg p-4">
      <div className="absolute inset-0">
        {topics.map(topic => (
          <TopicNode
            key={topic.id}
            topic={topic}
            isActive={topic.id === currentTopicId}
            isCompleted={completedTopics.includes(topic.id)}
            isSelected={topic.id === selectedTopic}
            onClick={() => setSelectedTopic(topic.id)}
          />
        ))}
        
        {topics.map(topic => 
          topic.prerequisites.map(preReqId => (
            <TopicConnection
              key={`${topic.id}-${preReqId}`}
              fromTopic={topics.find(t => t.id === preReqId)!}
              toTopic={topic}
              isCompleted={completedTopics.includes(preReqId)}
            />
          ))
        )}
      </div>
    </div>
  );
} 