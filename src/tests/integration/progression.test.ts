import { ProgressionService } from '@/services/progression/ProgressionService';
import { AssessmentResult } from '@/types/learning';

describe('Progression Integration', () => {
  let progressionService: ProgressionService;
  const testUserId = 'test-user-123';

  beforeEach(() => {
    progressionService = new ProgressionService();
  });

  test('should track progress across multiple objectives', async () => {
    const results: AssessmentResult[] = [
      {
        topicId: 'topic1',
        score: 85,
        timestamp: new Date()
      }
    ];

    await progressionService.updateProgress(
      testUserId,
      results
    );

    // ... rest of test
  });

  test('should accumulate scores for the same objective', async () => {
    const results: AssessmentResult[] = [
      {
        topicId: 'topic1',
        score: 75,
        timestamp: new Date()
      }
    ];

    await progressionService.updateProgress(
      testUserId,
      results
    );

    // ... rest of test
  });
}); 