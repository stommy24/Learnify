import { MockDataGenerator } from '../mocks/generators';
import type { AssessmentScenario } from '@/types/testing';

export const scenarios: AssessmentScenario[] = [
  {
    name: 'Basic Math Assessment',
    questions: Array(5).fill(null).map(() => MockDataGenerator.generateQuestion()),
    timeLimit: 300,
    passingScore: 70,
    metadata: {
      difficulty: 'medium',
      topic: 'mathematics',
      gradeLevel: '6th'
    }
  },
  // ... other scenarios
]; 