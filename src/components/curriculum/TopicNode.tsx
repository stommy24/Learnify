import type { CurriculumTopic } from '@/types/curriculum';

interface Props {
  topic: CurriculumTopic;
  isActive: boolean;
  isCompleted: boolean;
  isSelected: boolean;
  onClick: () => void;
}

export function TopicNode({ topic, isActive, isCompleted, isSelected, onClick }: Props) {
  return (
    <div
      className={`
        absolute p-4 rounded-lg shadow-md cursor-pointer
        transition-transform duration-200 hover:scale-105
        ${isActive ? 'bg-blue-500 text-white' : ''}
        ${isCompleted ? 'bg-green-500 text-white' : 'bg-white'}
        ${isSelected ? 'ring-2 ring-blue-400' : ''}
      `}
      style={{
        left: `${topic.difficulty * 15}%`,
        top: `${topic.ageRange.min * 10}%`,
      }}
      onClick={onClick}
    >
      <h3 className="font-medium">{topic.name}</h3>
      <p className="text-sm opacity-80">{topic.strand}</p>
      <div className="mt-2 text-xs">
        Difficulty: {topic.difficulty}
      </div>
    </div>
  );
} 