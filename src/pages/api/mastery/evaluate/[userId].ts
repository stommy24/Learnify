import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { MasteryService } from '@/services/mastery/MasteryService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { userId } = req.query;
    const masteryService = new MasteryService();
    const evaluation = masteryService.evaluateAdvancement(userId as string);
    return res.status(200).json(evaluation);
  }
  return res.status(405).end();
} 