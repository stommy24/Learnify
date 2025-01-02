import { NextApiRequest, NextApiResponse } from 'next';
import { assessmentSystem } from '@/lib/assessment/AssessmentSystem';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { id } = req.query;
    const { answer, timeSpent } = req.body;

    if (!id || !answer || typeof timeSpent !== 'number') {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const result = await assessmentSystem.submitAnswer(String(id), answer, timeSpent);

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
} 