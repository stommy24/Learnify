import { describe, beforeAll, afterEach, it, expect } from '@jest/globals';
import { CurriculumParser } from '@/lib/curriculum/parser';
import { QuestionGenerator, LearningStyle } from '@/lib/assessment/generator';
import { ScaffoldingSystem } from '@/lib/assessment/scaffolding';
import { AssessmentCriteria } from '@/lib/assessment/criteria';
import { QuestionOptimizer } from '@/lib/assessment/optimizer';
import { Topic } from '@prisma/client';

describe('Comprehensive Assessment System Testing', () => {
  let parser: CurriculumParser;
  let questionGenerator: QuestionGenerator;
  let scaffolding: ScaffoldingSystem;
  let criteria: AssessmentCriteria;
  let optimizer: QuestionOptimizer;

  const mockTopic: Topic = {
    id: '1',
    name: 'Test Topic',
    description: null,
    difficulty: 1,
    ageRange: [10, 12],
    strand: 'Math',
    // Add any other required fields from your Topic model
  };

  beforeAll(() => {
    parser = CurriculumParser.getInstance();
    questionGenerator = new QuestionGenerator();
    scaffolding = new ScaffoldingSystem();
    criteria = new AssessmentCriteria();
    optimizer = QuestionOptimizer.getInstance();
  });

  afterEach(() => {
    optimizer.clearCache();
  });

  describe('Question Generation', () => {
    it('generates appropriate difficulty for level 1', () => {
      const question = questionGenerator.generateQuestion(
        mockTopic,
        1,
        'visual' as LearningStyle
      );
      expect(question.difficulty).toBe(1);
    });

    // ... rest of the tests using mockTopic instead of curriculum.topics
  });
}); 