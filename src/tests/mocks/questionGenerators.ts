import { faker } from '@faker-js/faker';
import type { Question } from '@/types/assessment';
import type { QuestionType } from '@/types/curriculum';

export class QuestionGenerator {
  static generate(type: QuestionType): Question {
    return {
      id: faker.string.uuid(),
      type,
      content: faker.lorem.sentence(),
      template: faker.lorem.sentence(),
      correctAnswer: faker.lorem.word(),
      points: faker.number.int({ min: 1, max: 10 }),
      difficulty: faker.helpers.arrayElement(['easy', 'medium', 'hard']),
      topic: faker.helpers.arrayElement(['math', 'science', 'history']),
      options: type === 'multiple-choice' ? Array(4).fill(null).map(() => faker.lorem.word()) : undefined,
      validationRules: [{ type: 'exact', value: faker.lorem.word() }]
    };
  }

  private static generateAnswer(type: QuestionType): string {
    switch (type) {
      case 'multiple-choice':
        return faker.lorem.word();
      case 'numeric':
        return faker.number.int({ min: 0, max: 100 }).toString();
      default:
        return faker.lorem.sentence();
    }
  }

  private static generateOptions(): string[] {
    return Array.from({ length: 4 }, () => faker.lorem.word());
  }
} 