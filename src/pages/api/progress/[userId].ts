import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { ProgressionService } from '@/services/progression/ProgressionService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = req.query;
  const progressionService = new ProgressionService();

  if (req.method === 'GET') {
    const progress = await progressionService.getCurrentProgress(userId as string);
    return res.status(200).json(progress);
  }

  if (req.method === 'POST') {
    const { results } = req.body;
    const progress = await progressionService.updateProgress(
      userId as string,
      results
    );
    return res.status(200).json(progress);
  }

  return res.status(405).json({ message: 'Method not allowed' });
} 