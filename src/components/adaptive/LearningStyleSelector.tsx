import type { LearningStyleMapping } from '@/types/curriculum';

interface Props {
  current: keyof LearningStyleMapping;
  onChange: (style: keyof LearningStyleMapping) => void;
}

export function LearningStyleSelector({ current, onChange }: Props) {
  const styles: Array<{
    key: keyof LearningStyleMapping;
    label: string;
    icon: string;
  }> = [
    { key: 'visual', label: 'Visual', icon: '👁️' },
    { key: 'auditory', label: 'Auditory', icon: '👂' },
    { key: 'kinesthetic', label: 'Hands-on', icon: '✋' },
    { key: 'readingWriting', label: 'Reading/Writing', icon: '📝' },
  ];

  return (
    <div className="flex gap-2">
      {styles.map(({ key, label, icon }) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={`
            px-3 py-2 rounded-lg flex items-center gap-2
            ${current === key 
              ? 'bg-blue-100 text-blue-700 border-blue-300' 
              : 'bg-gray-50 hover:bg-gray-100'}
          `}
        >
          <span>{icon}</span>
          <span className="hidden md:inline">{label}</span>
        </button>
      ))}
    </div>
  );
} 