import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { TestGenerator } from '@/lib/placement/TestGenerator';
import { logger } from '@/lib/monitoring';

const prisma = new PrismaClient();
const testGenerator = new TestGenerator(prisma);

export async function GET(request: Request) {
  try {
    // Verify CRON secret to ensure this is a legitimate request
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all active students
    const students = await prisma.user.findMany({
      where: {
        status: 'ACTIVE',
        role: 'STUDENT'
      },
      select: {
        id: true
      }
    });

    // Generate tests for each student
    const results = await Promise.allSettled(
      students.map(student => testGenerator.generateDailyTests(student.id))
    );

    const summary = {
      total: results.length,
      succeeded: results.filter(r => r.status === 'fulfilled').length,
      failed: results.filter(r => r.status === 'rejected').length
    };

    logger.info('Daily test generation complete', summary);

    return NextResponse.json(summary);
  } catch (error) {
    logger.error('Failed to run daily test generation', { 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
} 