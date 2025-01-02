import { PlacementSystem } from '@/lib/placement/PlacementSystem';

export async function POST(request: Request) {
  try {
    const { userId, questionId, answer, difficulty } = await request.json();

    if (!userId || !questionId || answer === undefined || difficulty === undefined) {
      return new Response('Missing required fields', { status: 400 });
    }

    const placementSystem = new PlacementSystem();
    const result = await placementSystem.submitAnswer(userId, questionId, answer, difficulty);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error submitting answer:', error);
    return new Response('Failed to submit answer', { status: 500 });
  }
} 