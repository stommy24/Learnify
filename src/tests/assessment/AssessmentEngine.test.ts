import { Question, QuestionType } from '@/lib/types/quiz';
import { AssessmentConfig } from '@/lib/types/assessment';

describe('AssessmentEngine', () => {
  const mockConfig: AssessmentConfig = {
    topics: ['math'],
    yearGroup: 1,
    term: 1,
    difficulty: 1,
    subject: 'mathematics',
    questionCount: 1,
    allowNavigation: true,
    showFeedback: true,
    adaptiveDifficulty: false,
    questionTypes: ['multiple-choice' as QuestionType]
  };

  const mockQuestion: Question = {
    id: '1',
    text: 'Test question',
    type: 'multiple-choice' as QuestionType,
    correctAnswer: 'answer1',
    difficulty: 1,
    topic: 'math',
    subject: 'mathematics',
    options: ['answer1', 'answer2', 'answer3']
  };

  // ... rest of the test file
}); 