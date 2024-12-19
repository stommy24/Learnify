import { describe, expect, test, beforeAll, afterEach } from '@jest/globals';
import { CurriculumParser } from '../../lib/curriculum/parser';
import { QuestionGenerator } from '../../lib/assessment/questionGenerator';
import { ScaffoldingSystem } from '../../lib/assessment/scaffolding/scaffoldingSystem';
import { AssessmentCriteria } from '../../lib/assessment/criteria/assessmentCriteria';
import { LearningStyleAdapter } from '../../lib/assessment/adaptations/learningStyleAdapter';
import { MathsGenerator } from '../../lib/assessment/generators/mathsGenerator';
import { EnglishGenerator } from '../../lib/assessment/generators/englishGenerator';
import { PerformanceOptimizer } from '../../lib/assessment/performance';
import { ValidationRule } from '@/services/question-generation/types';

describe('Comprehensive Assessment System Testing', () => {
  let parser: CurriculumParser;
  let questionGenerator: QuestionGenerator;
  let scaffolding: ScaffoldingSystem;
  let criteria: AssessmentCriteria;
  let styleAdapter: LearningStyleAdapter;
  let mathsGen: MathsGenerator;
  let englishGen: EnglishGenerator;
  let optimizer: PerformanceOptimizer;

  beforeAll(async () => {
    parser = CurriculumParser.getInstance();
    questionGenerator = new QuestionGenerator();
    scaffolding = new ScaffoldingSystem();
    criteria = new AssessmentCriteria();
    styleAdapter = new LearningStyleAdapter();
    mathsGen = new MathsGenerator();
    englishGen = new EnglishGenerator();
    optimizer = PerformanceOptimizer.getInstance();
  });

  afterEach(() => {
    optimizer.clearCache();
  });

  describe('Curriculum Parsing', () => {
    test('parses maths curriculum correctly', async () => {
      const curriculum = await parser.parseCurriculum('maths');
      expect(curriculum).toBeDefined();
      expect(curriculum.length).toBeGreaterThan(0);
      expect(curriculum[0].topics).toBeDefined();
      expect(curriculum[0].topics[0].objectives).toBeDefined();
    });

    test('parses english curriculum correctly', async () => {
      const curriculum = await parser.parseCurriculum('english');
      expect(curriculum).toBeDefined();
      expect(curriculum.length).toBeGreaterThan(0);
      expect(curriculum[0].topics).toBeDefined();
      expect(curriculum[0].topics[0].objectives).toBeDefined();
    });

    test('handles invalid curriculum files', async () => {
      await expect(parser.parseCurriculum('invalid' as any))
        .rejects.toThrow('Invalid curriculum type');
    });
  });

  describe('Question Generation', () => {
    test.each([1, 2, 3, 4, 5])('generates appropriate difficulty for level %i', async (level) => {
      const curriculum = await parser.parseCurriculum('maths');
      const topic = curriculum[0].topics[0];
      const question = await questionGenerator.generateQuestion(
        topic,
        topic.objectives[0],
        level,
        'visual'
      );
      expect(question.difficulty).toBe(level);
    });

    test.each(['visual', 'auditory', 'kinesthetic', 'readingWriting'] as const)(
      'adapts to %s learning style',
      async (style) => {
        const curriculum = await parser.parseCurriculum('maths');
        const topic = curriculum[0].topics[0];
        const question = await questionGenerator.generateQuestion(
          topic,
          topic.objectives[0],
          3,
          style
        );
        expect(question.adaptations).toContain(style);
      }
    );

    test('generates valid maths questions', async () => {
      const numbers = await mathsGen.generateNumber(
        { type: 'number', range: { min: 1, max: 100 } },
        3
      );
      expect(numbers).toBeGreaterThanOrEqual(1);
      expect(numbers).toBeLessThanOrEqual(100);
    });

    test('generates valid english questions', async () => {
      const text = await englishGen.generateText(
        { type: 'text', constraints: ['length-50-100'] },
        3
      );
      const wordCount = text.split(' ').length;
      expect(wordCount).toBeGreaterThanOrEqual(50);
      expect(wordCount).toBeLessThanOrEqual(100);
    });
  });

  describe('Scaffolding System', () => {
    test('provides progressive hints', async () => {
      const curriculum = await parser.parseCurriculum('maths');
      const topic = curriculum[0].topics[0];
      const scaffoldingRules = scaffolding.generateScaffolding(
        await questionGenerator.generateQuestion(topic, topic.objectives[0], 3, 'visual'),
        topic.objectives[0],
        []
      );
      expect(scaffoldingRules).toHaveLength(3);
      expect(scaffoldingRules[0].condition).toBe('initial');
      expect(scaffoldingRules[1].condition).toContain('step-');
    });

    test('adapts to previous mistakes', async () => {
      const curriculum = await parser.parseCurriculum('maths');
      const topic = curriculum[0].topics[0];
      const mistakes = ['calculation-error', 'concept-misunderstanding'];
      const scaffoldingRules = scaffolding.generateScaffolding(
        await questionGenerator.generateQuestion(topic, topic.objectives[0], 3, 'visual'),
        topic.objectives[0],
        mistakes
      );
      expect(scaffoldingRules[0].condition).toContain('error');
      expect(scaffoldingRules[0].hint).toBeDefined();
    });
  });

  describe('Performance Optimization', () => {
    test('caches and retrieves questions correctly', async () => {
      const curriculum = await parser.parseCurriculum('maths');
      const topic = curriculum[0].topics[0];
      const question = await questionGenerator.generateQuestion(
        topic,
        topic.objectives[0],
        3,
        'visual'
      );

      const key = optimizer.generateCacheKey({
        topicId: topic.id,
        objectiveId: topic.objectives[0].id,
        level: 3,
        style: 'visual'
      });

      optimizer.cacheQuestion(key, question);
      const cached = optimizer.getCachedQuestion(key);
      expect(cached).toEqual(question);
    });

    test('preloads common questions', async () => {
      const curriculum = await parser.parseCurriculum('maths');
      const objectives = curriculum[0].topics[0].objectives;
      await optimizer.preloadCommonQuestions(
        objectives,
        [1, 2, 3],
        ['visual', 'auditory']
      );
      // Check a few random combinations
      const key1 = optimizer.generateCacheKey({
        topicId: objectives[0].id,
        objectiveId: objectives[0].id,
        level: 1,
        style: 'visual'
      });
      expect(optimizer.getCachedQuestion(key1)).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    test('handles invalid question generation parameters', async () => {
      await expect(questionGenerator.generateQuestion(
        null as any,
        null as any,
        -1,
        'invalid' as any
      )).rejects.toThrow();
    });

    test('handles invalid scaffolding parameters', () => {
      expect(() => scaffolding.generateScaffolding(
        null as any,
        null as any,
        null as any
      )).toThrow();
    });
  });

  describe('Assessment System Integration', () => {
    const generator = new QuestionGenerator();

    it('should generate questions with proper scaffolding', async () => {
      const result = await generator.generateQuestion({
        type: 'multiple',
        scaffolding: [],
        adaptations: [],
        resources: [],
        question: 'test',
        variables: {},
        validationRules: [] as ValidationRule[]
      });
      expect(result).toBeDefined();
    });
  });
}); 