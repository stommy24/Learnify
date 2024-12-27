import { ProgressionService } from '@/services/progression/ProgressionService';
import { AssessmentResult, AssessmentConfig } from '@/lib/types/assessment';
import { Question, QuestionType } from '@/lib/types/quiz';

describe('Progression Integration', () => {
  let progressionService: ProgressionService;

  beforeEach(() => {
    progressionService = new ProgressionService();
  });

  const createMockResult = (objectiveId: string, score: number): AssessmentResult => ({
      id: '1',
      questionId: '1',
      question: {
          id: '1',
          text: 'test',
          type: 'multiple-choice' as QuestionType,
          correctAnswer: 'correct',
          difficulty: 1,
          topic: 'math',
          subject: 'mathematics',
          options: ['correct', 'wrong1', 'wrong2']
      },
      answer: 'test',
      isCorrect: true,
      score,
      totalQuestions: 1,
      correctAnswers: 1,
      timeSpent: 0,
      timestamp: new Date(),
      feedback: [],
      objectiveId,
      config: {
          topics: ['test'],
          yearGroup: 1,
          term: 1,
          difficulty: 1,
          subject: 'test',
          questionCount: 1,
          allowNavigation: true,
          showFeedback: true,
          adaptiveDifficulty: false,
          questionTypes: ['multiple-choice' as QuestionType]
      },
      questions: [],
      startedAt: new Date()
  });

  const createMockQuestion = (id: string): Question => ({
    id,
    text: 'Test question',
    type: 'multiple-choice' as QuestionType,
    correctAnswer: 'correct',
    difficulty: 1,
    topic: 'math',
    subject: 'mathematics',
    options: ['correct', 'wrong1', 'wrong2']
  });

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
    correctAnswer: 'correct',
    difficulty: 1,
    topic: 'math',
    subject: 'mathematics',
    options: ['correct', 'wrong1', 'wrong2']
  };

  it('should track progress across multiple objectives', async () => {
    const result1 = createMockResult('obj1', 5);
    const result2 = createMockResult('obj2', 3);
    
    await progressionService.updateProgress(
      'testUser',
      [result1, result2],
      new Date(),
      'testTopic'
    );
    
    const progress = await progressionService.getAllProgress();
    expect(progress['obj1']).toBe(5);
    expect(progress['obj2']).toBe(3);
  });

  it('should accumulate scores for the same objective', async () => {
    const results = [
      createMockResult('obj1', 2),
      createMockResult('obj1', 3)
    ];
    
    await progressionService.updateProgress(
      'testUser',
      results,
      new Date(),
      'testTopic'
    );
    
    const progress = await progressionService.getAllProgress();
    expect(progress['obj1']).toBe(5);
  });

  test('should progress through assessment correctly', () => {
    const testQuestion: Question = {
      id: '1',
      text: 'Test question',
      type: 'multiple-choice' as QuestionType,
      correctAnswer: 'correct',
      difficulty: 1,
      topic: 'math',
      subject: 'mathematics',
      options: ['correct', 'wrong1', 'wrong2']
    };

    const result = {
      question: testQuestion,
      answer: 'correct',
      config: {
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
      },
      // ... other result properties
    };

    // ... rest of the test
  });
}); 