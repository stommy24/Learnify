import { CurriculumTopic } from '@/types/curriculum';

interface TopicNodeProps {
  topic: CurriculumTopic;
  isActive?: boolean;
  isCompleted?: boolean;
  isSelected?: boolean;
  onClick?: (topic: CurriculumTopic) => void;
}

export function TopicNode({ 
  topic, 
  isActive = false, 
  isCompleted = false,
  isSelected = false,
  onClick 
}: TopicNodeProps) {
  const [minAge] = topic.ageRange;
  
  return (
    <div 
      className={`topic-node ${topic.strand} ${isActive ? 'active' : ''} 
                 ${isCompleted ? 'completed' : ''} ${isSelected ? 'selected' : ''}`}
      onClick={() => onClick?.(topic)}
    >
      <h3>{topic.name}</h3>
      <div className="topic-metadata">
        <span>Difficulty: {topic.difficulty}</span>
        <span>Age: {minAge}+</span>
      </div>
    </div>
  );
} 