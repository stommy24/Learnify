import { StudentProgress, Adaptation } from '@/types/progress';

interface Props {
  progress: StudentProgress;
}

export function RecommendationPanel({ progress }: Props) {
  const findAdaptation = (type: string): Adaptation | undefined => {
    return progress.adaptations.find(a => a.type === type);
  };

  const learningStyle = findAdaptation('learningStyle')?.preferredStyle || 'Not determined';
  const formats = findAdaptation('formats')?.effectiveFormats || [];
  const strugglingAreas = findAdaptation('struggles')?.strugglingAreas || [];

  return (
    <div>
      <h3>Learning Style: {learningStyle}</h3>
      <div>
        <h4>Effective Learning Formats:</h4>
        <ul>
          {formats.map((format, index) => (
            <li key={index}>{format}</li>
          ))}
        </ul>
      </div>
      <div>
        <h4>Areas Needing Improvement:</h4>
        <ul>
          {strugglingAreas.map((area: string, index: number) => (
            <li key={index}>{area}</li>
          ))}
        </ul>
      </div>
    </div>
  );
} 