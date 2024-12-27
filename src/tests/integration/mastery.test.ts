import { describe, it, expect, beforeEach } from 'vitest';
import { MasteryService } from '@/services/mastery/MasteryService';
import { prisma } from '@/lib/prisma';

describe('MasteryService Integration Tests', () => {
  let masteryService: MasteryService;
  let testUserId: string;
  let testTopicId: string;

  beforeEach(async () => {
    masteryService = new MasteryService();
    
    // Setup test data
    const testUser = await prisma.user.create({
      data: {
        email: 'test@example.com',
        name: 'Test User'
      }
    });
    testUserId = testUser.id;

    const testTopic = await prisma.topic.create({
      data: {
        name: 'Test Topic',
        strand: 'Number',
        difficulty: 1
      }
    });
    testTopicId = testTopic.id;
  });

  it('should evaluate advancement correctly', async () => {
    // Create progress with mastered objectives
    await prisma.studentProgress.create({
      data: {
        userId: testUserId,
        topicId: testTopicId,
        objectiveIds: ['obj1', 'obj2'],
        masteryLevel: {
          obj1: 90,
          obj2: 95
        }
      }
    });

    const canAdvance = await masteryService.evaluateAdvancement(testUserId);

    expect(canAdvance).toBe(true);
  });
}); 