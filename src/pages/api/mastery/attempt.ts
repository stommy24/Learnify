import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { MasterySystem } from '@/lib/mastery';
import { MasteryAttempt } from '@/types/mastery';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const attempt = req.body as Omit<MasteryAttempt, 'id' | 'createdAt' | 'updatedAt'>;
    const masterySystem = new MasterySystem(prisma);
    const result = await masterySystem.submitAttempt(attempt);

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
} 