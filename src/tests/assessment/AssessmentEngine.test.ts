import { Question, QuestionType } from '@/lib/types/quiz';
import { AssessmentConfig } from '@/lib/types/assessment';
import { AssessmentEngine } from '@/lib/assessment/engine';
import { describe, it, expect, beforeEach } from '@jest/globals';

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

  let engine: AssessmentEngine;

  beforeEach(() => {
    engine = new AssessmentEngine(mockConfig);
  });

  it('should initialize with config', () => {
    expect(engine.getConfig()).toEqual(mockConfig);
  });

  it('should handle question submission', () => {
    engine.addQuestion(mockQuestion);
    const result = engine.submitAnswer('1', 'answer1');
    expect(result.correct).toBe(true);
  });
}); 