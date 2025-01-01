import { PrismaClient } from '@prisma/client';

// Set up test environment variables
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/testdb';

// Initialize Prisma Client with explicit config
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const testPrisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
    log: ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = testPrisma;

// Clean up function
export const cleanupDatabase = async () => {
  try {
    // Get all table names except migrations
    const result = await testPrisma.$queryRaw<Array<{ tablename: string }>>`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname='public' 
        AND tablename != '_prisma_migrations'
    `;

    // Truncate each table
    for (const { tablename } of result || []) {
      await testPrisma.$executeRawUnsafe(
        `TRUNCATE TABLE "public"."${tablename}" CASCADE;`
      );
    }
  } catch (error) {
    console.error('Failed to clean database:', error);
  }
};

// Setup function
export const setupTestDatabase = async () => {
  try {
    await testPrisma.$connect();
    await cleanupDatabase();
    return testPrisma;
  } catch (error) {
    console.error('Database setup failed:', error);
    throw error;
  }
};

// Ensure cleanup after all tests
afterAll(async () => {
  await cleanupDatabase();
  await testPrisma.$disconnect();
}); 