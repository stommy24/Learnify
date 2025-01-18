import { ContentService } from '@/services/content/ContentService';
import { prisma } from '@/lib/prisma';

describe('Content Service Integration Tests', () => {
  const contentService = new ContentService(prisma);

  const testContent = {
    title: 'Test Content',
    description: 'Test Description',
    type: 'TEST',
    data: { test: 'data' }
  };

  it('should handle content operations', async () => {
    const content = await contentService.createContent(testContent);
    expect(content).toBeDefined();
    expect(content.title).toBe(testContent.title);

    if (content?.id) {
      await contentService.deleteContent(content.id);
    }
  });
});