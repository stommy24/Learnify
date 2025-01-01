export const mockPrisma = {
  learningProgress: {
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    upsert: jest.fn(),
  },
  user: {
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    deleteMany: jest.fn(),
  },
  // Add other models as needed
};

jest.mock('@/lib/prisma', () => ({
  prisma: mockPrisma
})); 