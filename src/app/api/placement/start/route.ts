import { NextResponse } from 'next/server';
import { placementSystem } from '@/lib/placement/PlacementSystem';
import { InitialPlacementParams } from '@/types/placement';

export async function POST(request: Request) {
  try {
    const { studentId, ...params } = await request.json();
    const test = await placementSystem.startTest(studentId, params as InitialPlacementParams);
    return NextResponse.json(test);
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Failed to start test' },
      { status: 500 }
    );
  }
} 