import { NextApiRequest, NextApiResponse } from 'next';
import { placementSystem } from '@/lib/placement/PlacementSystem';
import { PlacementTestError, PlacementTestErrorCodes } from '@/lib/errors/PlacementTestError';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      code: 'METHOD_NOT_ALLOWED',
      message: 'Method not allowed' 
    });
  }

  try {
    const { testId } = req.query;
    const { questionId, answer, timeSpent } = req.body;

    // Validate required fields
    if (!testId || !questionId || answer === undefined) {
      return res.status(400).json({
        code: 'INVALID_REQUEST',
        message: 'Missing required fields',
        details: {
          testId: !testId ? 'Required' : undefined,
          questionId: !questionId ? 'Required' : undefined,
          answer: answer === undefined ? 'Required' : undefined
        }
      });
    }

    // Validate timeSpent
    if (typeof timeSpent !== 'number' || timeSpent < 0) {
      return res.status(400).json({
        code: 'INVALID_TIME_SPENT',
        message: 'Time spent must be a positive number'
      });
    }

    const nextQuestion = await placementSystem.submitAnswer(
      testId as string,
      questionId,
      answer,
      timeSpent
    );

    res.status(200).json(nextQuestion);
  } catch (error) {
    if (error instanceof PlacementTestError) {
      return res.status(error.statusCode).json({
        code: error.code,
        message: error.message
      });
    }

    console.error('Placement test error:', error);
    res.status(500).json({
      code: PlacementTestErrorCodes.DATABASE_ERROR,
      message: 'An unexpected error occurred'
    });
  }
} 