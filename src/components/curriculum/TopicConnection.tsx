import type { CurriculumTopic } from '@/types/curriculum';

interface Props {
  fromTopic: CurriculumTopic;
  toTopic: CurriculumTopic;
  isCompleted: boolean;
}

export function TopicConnection({ fromTopic, toTopic, isCompleted }: Props) {
  const startX = fromTopic.difficulty * 15;
  const startY = fromTopic.ageRange.min * 10;
  const endX = toTopic.difficulty * 15;
  const endY = toTopic.ageRange.min * 10;

  return (
    <svg className="absolute inset-0 pointer-events-none">
      <line
        x1={`${startX}%`}
        y1={`${startY}%`}
        x2={`${endX}%`}
        y2={`${endY}%`}
        stroke={isCompleted ? '#22c55e' : '#e5e7eb'}
        strokeWidth="2"
      />
    </svg>
  );
} 