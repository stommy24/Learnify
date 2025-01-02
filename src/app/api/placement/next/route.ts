import { NextResponse } from 'next/server';
import { placementSystem } from '@/lib/placement/PlacementSystem';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const testId = searchParams.get('testId');
    const currentDifficulty = searchParams.get('difficulty');

    if (!testId) {
      return NextResponse.json(
        { message: 'Test ID is required' },
        { status: 400 }
      );
    }

    const nextQuestion = await placementSystem.getNextQuestion(
      testId,
      currentDifficulty ? parseInt(currentDifficulty) : undefined
    );

    return NextResponse.json(nextQuestion);
  } catch (error) {
    console.error('Get next question error:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Failed to get next question' },
      { status: error instanceof Error ? (error as any).status || 500 : 500 }
    );
  }
} 