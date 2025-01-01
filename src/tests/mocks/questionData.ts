import { Question } from '@/lib/assessment/generator';

export const mockQuestions: Question[] = [
  {
    id: '1',
    topic: 'algebra',
    difficulty: 1,
    content: 'What is x in 2x + 4 = 10?',
    type: 'multiple-choice',
    options: ['2', '3', '4', '5'],
    correctAnswer: '3'
  },
  {
    id: '2',
    topic: 'geometry',
    difficulty: 2,
    content: 'What is the area of a square with side length 5?',
    type: 'multiple-choice',
    options: ['20', '25', '30', '35'],
    correctAnswer: '25'
  }
];

export const mockFilters = {
  difficulty: [1, 2, 3],
  topics: ['algebra', 'geometry'],
  types: ['multiple-choice', 'open-ended']
}; 