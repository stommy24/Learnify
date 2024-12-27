import { faker } from '@faker-js/faker';
import type { Question, Answer, AssessmentResult, ScoreCard } from '@/types/assessment';

export class MockDataGenerator {
  static generateQuestion(): Question {
    return {
      id: faker.string.uuid(),
      type: faker.helpers.arrayElement(['multiple-choice', 'true-false', 'short-answer', 'numeric', 'open-ended']),
      content: faker.lorem.sentence(),
      template: faker.lorem.sentence(),
      correctAnswer: faker.lorem.word(),
      points: faker.number.int({ min: 1, max: 10 }),
      difficulty: faker.helpers.arrayElement(['easy', 'medium', 'hard']),
      topic: faker.helpers.arrayElement(['math', 'science', 'history', 'language']),
      options: Array(4).fill(null).map(() => faker.lorem.word()),
      validationRules: [{ type: 'exact', value: faker.lorem.word() }],
      metadata: {
        created: faker.date.past().toISOString(),
        author: faker.internet.email(),
        version: '1.0'
      }
    };
  }

  static generateAnswer(): Answer {
    return {
      content: faker.lorem.word(),
      timestamp: new Date().toISOString()
    };
  }
  static generateScoreCard(): ScoreCard {
    const totalQuestions = faker.number.int({ min: 10, max: 50 });
    const correctAnswers = faker.number.int({ min: 0, max: totalQuestions });
    const pointsPerQuestion = faker.number.int({ min: 1, max: 10 });
    const totalPoints = correctAnswers * pointsPerQuestion;
    const maxPoints = totalQuestions * pointsPerQuestion;
    
    return {
      userId: faker.string.uuid(),
      totalQuestions,
      correctAnswers,
      timeSpent: faker.number.int({ min: 300, max: 3600 }),
      totalPoints,
      maxPoints,
      percentage: (totalPoints / maxPoints) * 100,
      timestamp: new Date().toISOString()
    };
  }
} 