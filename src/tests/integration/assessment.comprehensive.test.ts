import { Topic } from '@prisma/client';
import { prisma } from '@/lib/prisma';

describe('Comprehensive Assessment Tests', () => {
  const mockTopic: Topic = {
    id: '1',
    name: 'Test Topic',
    description: null,
    difficulty: 1,
    ageRange: [10, 12],
    strand: 'Math'
  };

  test('should create assessment with topic', async () => {
    const assessment = await createAssessmentWithTopic(mockTopic);
    expect(assessment).toBeDefined();
  });

  // Update function signature to use Topic instead of CurriculumTopic
  async function createAssessmentWithTopic(topic: Topic) {
    // Your implementation here
    return prisma.assessment.create({
      data: {
        assessmentType: 'DIAGNOSTIC',
        status: 'NOT_STARTED',
        userId: 'test-user-id',
        questions: {
          create: []
        }
      }
    });
  }
}); 