import { FC, useState } from 'react';
import { MasteryAttempt } from '@/types/mastery';

interface Props {
  onSubmit: (attempt: Omit<MasteryAttempt, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

export const MasteryAttemptForm: FC<Props> = ({ onSubmit }) => {
  const [score, setScore] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      studentId: 'current-user-id', // This should come from auth context
      skillId: 'current-skill-id', // This should be passed as prop
      score,
      timeSpent,
      errors,
      completedAt: new Date()
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form implementation */}
    </form>
  );
}; 