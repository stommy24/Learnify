import { describe, it, expect, beforeEach } from '@jest/globals';
import { MasteryService } from '@/services/mastery/MasteryService';
import { LearningProgress } from '@/types/progress';
import { Question } from '@/lib/types/assessment';
import { AssessmentResult } from '@/lib/types/assessment';

describe('MasteryService Integration Tests', () => {
  let masteryService: MasteryService;
  const testUserId = 'test-user-id';

  beforeEach(() => {
    masteryService = new MasteryService();
    
    const mockQuestion: Question = {
      id: 'q1',
      text: 'Test question',
      topic: 'math',
      subject: 'mathematics',
      type: 'multiple-choice',
      correctAnswer: 'answer',
      difficulty: 1,
      options: ['answer', 'wrong1', 'wrong2'],
      explanation: 'Test explanation'
    };

    const mockResult: AssessmentResult = {
        id: 'r1',
        questionId: 'q1',
        score: 90,
        isCorrect: true,
        objectiveId: 'obj1',
        question: mockQuestion,
        answer: 'answer',
        totalQuestions: 2,
        timeSpent: 60,
        timestamp: new Date(),
        feedback: ['Good job!'],
        correctAnswers: 0,
        startedAt: new Date(),
        config: {
            timeLimit: 600,
            topics: [],
            yearGroup: 0,
            term: 0,
            difficulty: 0,
            subject: '',
            questionCount: 0,
            allowNavigation: false,
            showFeedback: false,
            adaptiveDifficulty: false,
            questionTypes: []
        },
        questions: [],
        currentQuestion: 0,
        completed: false
    };

    // Mock the private getProgress method
    const mockProgress: LearningProgress = {
      id: testUserId,
      userId: testUserId,
      timestamp: new Date(),
      results: [
        { ...mockResult },
        { ...mockResult, id: 'r2', score: 95 }
      ],
      adaptations: [],
      assessmentHistory: [],
      objectiveIds: ['obj1', 'obj2'],
      masteryLevel: { obj1: 90, obj2: 95 }
    };

    // @ts-ignore - accessing private method for testing
    masteryService.getProgress = jest.fn().mockResolvedValue(mockProgress);
  });

  it('should evaluate advancement correctly', async () => {
    const canAdvance = await masteryService.evaluateAdvancement(testUserId);
    expect(canAdvance).toBe(true);
  });
});