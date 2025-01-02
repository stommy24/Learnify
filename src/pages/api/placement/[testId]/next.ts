import { NextApiRequest, NextApiResponse } from 'next';
import { placementSystem } from '@/lib/placement/PlacementSystem';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { testId } = req.query;
    const { difficulty } = req.query;

    if (!testId) {
      return res.status(400).json({ message: 'Test ID is required' });
    }

    const question = await placementSystem.getNextQuestion(
      testId as string,
      Number(difficulty) || 1
    );

    res.status(200).json(question);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
} 