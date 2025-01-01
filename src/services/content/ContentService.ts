import { PrismaClient } from '@prisma/client';

interface Content {
  id?: string;
  title: string;
  description: string;
  type: string;
}

interface ContentInput {
  title: string;
  description: string;
  type: string;
}

export class ContentService {
  constructor(private prisma: PrismaClient) {}

  async createContent(content: ContentInput): Promise<Content> {
    try {
      const createdContent = await this.prisma.content.create({
        data: {
          ...content,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      });
      return createdContent;
    } catch (error) {
      console.error('Error creating content:', error);
      throw new Error('Failed to create content');
    }
  }

  async deleteContent(id: string): Promise<void> {
    try {
      await this.prisma.content.delete({
        where: { id }
      });
    } catch (error) {
      console.error('Error deleting content:', error);
      throw new Error('Failed to delete content');
    }
  }

  async getContent(id: string) {
    return this.prisma.content.findUnique({
      where: { id },
    });
  }
} 