import { describe, it, expect } from 'vitest';
import { PrismaClient } from '@prisma/client';
import { mockDeep } from 'vitest-mock-extended';

const prisma = mockDeep<PrismaClient>();

describe('Content Management', () => {
  it('should handle content operations', async () => {
    const content = await prisma.content.create({
      data: {
        content: 'Test content'
      }
    });
    expect(content).toBeDefined();
  });
}); 