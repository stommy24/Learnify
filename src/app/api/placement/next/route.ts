import { PlacementSystem } from '@/lib/placement/PlacementSystem';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const currentDifficulty = parseFloat(searchParams.get('difficulty') || '0');

    if (!userId) {
      return new Response('User ID is required', { status: 400 });
    }

    const placementSystem = new PlacementSystem();
    const nextQuestion = await placementSystem.getNextQuestion(userId, currentDifficulty);

    return new Response(JSON.stringify(nextQuestion), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error getting next question:', error);
    return new Response('Failed to get next question', { status: 500 });
  }
} 