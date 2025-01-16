import { PrismaClient, AssessmentType } from '@prisma/client';
import { jest } from '@jest/globals';

// Define mock functions first
const mockCreate = jest.fn();
const mockFindUnique = jest.fn();

// Create mock client object
const mockPrismaClient = {
  assessment: {
    create: mockCreate,
    findUnique: mockFindUnique
  }
} as unknown as PrismaClient;

// Mock PrismaClient after creating the mock object
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn(() => mockPrismaClient),
  AssessmentType: {
    PLACEMENT: 'PLACEMENT',
    DIAGNOSTIC: 'DIAGNOSTIC'
  }
}));

// Now import the system that uses the mocked client
import { AssessmentSystem } from '../../../lib/assessment/AssessmentSystem';

describe('AssessmentSystem', () => {
  let system: AssessmentSystem;

  beforeEach(() => {
    jest.clearAllMocks();
    system = new AssessmentSystem(mockPrismaClient);
  });

  // Add your test cases here
}); 