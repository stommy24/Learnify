import { CurriculumTopic } from '@/types/curriculum';

interface TopicConnectionProps {
  source: CurriculumTopic;
  target: CurriculumTopic;
  isCompleted?: boolean;
}

export function TopicConnection({ source, target, isCompleted = false }: TopicConnectionProps) {
  const [sourceMinAge] = source.ageRange;
  const [targetMinAge] = target.ageRange;

  // Default positions if not provided
  const sourcePos = source.position || { x: 0, y: 0 };
  const targetPos = target.position || { x: 100, y: 100 };

  return (
    <div className={`topic-connection ${isCompleted ? 'completed' : ''}`}>
      <svg>
        <path
          d={`M${sourcePos.x} ${sourcePos.y} L${targetPos.x} ${targetPos.y}`}
          className={isCompleted ? 'completed' : ''}
        />
      </svg>
    </div>
  );
} 