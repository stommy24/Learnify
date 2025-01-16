import { PrismaClient, Prisma } from '@prisma/client';

// Update interface to match your schema exactly
interface ContentInput {
  title: string;
  type: string;
  data: Prisma.InputJsonValue;
  metadata?: Prisma.NullableJsonNullValueInput | Prisma.InputJsonValue;
}

export class ContentService {
  constructor(private prisma: PrismaClient) {}

  async createContent(input: ContentInput) {
    try {
      const createdContent = await this.prisma.content.create({
        data: {
          title: input.title,
          type: input.type,
          data: input.data,
          metadata: input.metadata ?? Prisma.JsonNull,
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