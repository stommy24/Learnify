import { FC } from 'react';
import { Assessment, SkillLevel } from '@/types/assessment';

interface Props {
  assessment: Assessment;
}

export const AssessmentProgress: FC<Props> = ({ assessment }) => {
  const totalQuestions = assessment.questions?.length ?? 0;
  const currentQuestion = assessment.currentQuestionIndex + 1;
  const progress = (currentQuestion / totalQuestions) * 100;

  const getSkillLevelName = (level: SkillLevel): string => {
    switch (level) {
      case 'NOVICE': return 'Novice';
      case 'BEGINNER': return 'Beginner';
      case 'INTERMEDIATE': return 'Intermediate';
      case 'ADVANCED': return 'Advanced';
      case 'EXPERT': return 'Expert';
      default: return 'Unknown';
    }
  };

  return (
    <div className="space-y-4">
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-blue-600 h-2.5 rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      <div className="flex justify-between text-sm text-gray-600">
        <span>Question {currentQuestion} of {totalQuestions}</span>
        <span>Score: {assessment.score}</span>
      </div>
    </div>
  );
}; 