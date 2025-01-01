import { ContentService } from '@/services/content/ContentService';
import { PrismaClient } from '@prisma/client';

jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => ({
      content: {
        create: jest.fn().mockImplementation((data) => {
          return {
            id: '1',
            ...data.data,
            createdAt: new Date(),
            updatedAt: new Date()
          };
        }),
        delete: jest.fn().mockResolvedValue({})
      }
    }))
  };
});

describe('Content Management', () => {
  let contentService: ContentService;
  let prisma: PrismaClient;

  beforeEach(() => {
    prisma = new PrismaClient();
    contentService = new ContentService(prisma);
  });

  it('should handle content operations', async () => {
    const testContent = {
      title: 'Test Content',
      description: 'Test Description',
      type: 'LESSON'
    };

    const content = await contentService.createContent(testContent);
    expect(content).toBeDefined();
    expect(content.title).toBe(testContent.title);

    if (content?.id) {
      await contentService.deleteContent(content.id);
    }
  });
});