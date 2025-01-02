import { NextResponse } from 'next/server';
import { placementSystem } from '@/lib/placement/PlacementSystem';
import { placementAnalytics } from '@/lib/analytics/placement';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const testId = searchParams.get('testId');

    if (!testId) {
      return NextResponse.json(
        { message: 'Test ID is required' },
        { status: 400 }
      );
    }

    const result = await placementSystem.getTestResult(testId);
    
    if (result.status === 'COMPLETED') {
      placementAnalytics.trackTestCompletion(
        testId,
        result.finalLevel,
        result.totalTime
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Get test result error:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Failed to get test result' },
      { status: error instanceof Error ? (error as any).status || 500 : 500 }
    );
  }
} 