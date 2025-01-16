import { FormEvent, useState } from 'react';

interface MasteryAttemptFormProps {
  onSubmit: (data: MasteryAttemptData) => void;
}

interface MasteryAttemptData {
  score: number;
  timeSpent: number;
  studentId: string;
  skillId: string;
  errors: string[];
  completedAt: Date;
}

export function MasteryAttemptForm({ onSubmit }: MasteryAttemptFormProps) {
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const score = formData.get('score');
    const timeSpent = formData.get('timeSpent');
    
    setValidationErrors([]);
    
    if (!score) {
      setValidationErrors(prev => [...prev, 'Score is required']);
      return;
    }
    if (!timeSpent) {
      setValidationErrors(prev => [...prev, 'Time spent is required']);
      return;
    }

    const data: MasteryAttemptData = {
      score: Number(score),
      timeSpent: Number(timeSpent),
      studentId: 'default-student-id',
      skillId: 'default-skill-id',
      errors: [],
      completedAt: new Date()
    };
    
    setIsSubmitting(true);
    try {
      await Promise.resolve(onSubmit(data)); // Handle both sync and async onSubmit
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="score">Score</label>
        <input
          type="number"
          id="score"
          name="score"
          disabled={isSubmitting}
        />
      </div>
      <div>
        <label htmlFor="timeSpent">Time Spent</label>
        <input
          type="number"
          id="timeSpent"
          name="timeSpent"
          disabled={isSubmitting}
        />
      </div>
      {validationErrors.length > 0 && (
        <div role="alert" className="validation-errors">
          {validationErrors.map((error, index) => (
            <div key={index} className="error-message">{error}</div>
          ))}
        </div>
      )}
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
} 