import { CurriculumTopic } from '@/types/curriculum';
import { TopicNode } from './TopicNode';
import { TopicConnection } from './TopicConnection';

interface CurriculumMapProps {
  topics: CurriculumTopic[];
  completedTopics: string[];
  selectedTopic?: string;
  onTopicSelect: (topic: CurriculumTopic) => void;
}

export function CurriculumMap({ 
  topics, 
  completedTopics, 
  selectedTopic,
  onTopicSelect 
}: CurriculumMapProps) {
  return (
    <div className="curriculum-map">
      {topics.map(topic => (
        <TopicNode
          key={topic.id}
          topic={topic}
          isActive={!!topic.prerequisites.every(preReqId => 
            completedTopics.includes(preReqId)
          )}
          isCompleted={completedTopics.includes(topic.id)}
          isSelected={selectedTopic === topic.id}
          onClick={() => onTopicSelect(topic)}
        />
      ))}

      {topics.map(topic =>
        topic.prerequisites.map(preReqId => {
          const fromTopic = topics.find(t => t.id === preReqId);
          if (!fromTopic) return null;
          
          return (
            <TopicConnection
              key={`${preReqId}-${topic.id}`}
              source={fromTopic}
              target={topic}
              isCompleted={completedTopics.includes(preReqId)}
            />
          );
        })
      )}
    </div>
  );
} 