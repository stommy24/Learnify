import { NextResponse } from 'next/server';
import { placementSystem } from '@/lib/placement/PlacementSystem';
import { placementAnalytics } from '@/lib/analytics/placement';

export async function POST(request: Request) {
  try {
    const { testId, questionId, answer, timeSpent } = await request.json();
    
    const result = await placementSystem.submitAnswer(
      testId,
      questionId,
      answer,
      timeSpent
    );

    placementAnalytics.trackQuestionAnswer(
      testId,
      questionId,
      result.isCorrect,
      timeSpent
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error('Submit answer error:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Failed to submit answer' },
      { status: error instanceof Error ? (error as any).status || 500 : 500 }
    );
  }
} 