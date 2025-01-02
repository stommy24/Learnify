import prisma from '@/lib/db';
import { TestGenerator } from '@/lib/placement/TestGenerator';
import { AssessmentType } from '@/types/assessment';
import { NextResponse } from 'next/server';
import { Prisma, User } from '@prisma/client';

interface UserWithEnrollments extends User {
  enrollments: Array<{
    subjectId: string;
  }>;
}

export async function GET() {
  try {
    // Get active users with specific fields
    const users = (await prisma.user.findMany({
      where: {
        isActive: true
      },
      include: {
        studentProfile: true,
        authoredCourses: true
      }
    })) as unknown as UserWithEnrollments[];

    const testGenerator = new TestGenerator();

    for (const user of users) {
      try {
        for (const enrollment of user.enrollments) {
          const test = await testGenerator.generateTest({
            userId: user.id,
            subjectId: enrollment.subjectId,
            type: AssessmentType.PRACTICE
          });

          if (user.needsPlacement) {
            const placementTest = await testGenerator.generateTest({
              userId: user.id,
              subjectId: enrollment.subjectId,
              type: AssessmentType.PLACEMENT
            });
          }
        }
      } catch (error) {
        console.error(`Error generating tests for user ${user.id}:`, error);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in daily test generation:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 