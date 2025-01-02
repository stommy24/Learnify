import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { MasterySystem } from '@/lib/mastery';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { studentId, topicId } = req.query;

    if (!studentId || !topicId) {
      return res.status(400).json({ message: 'Missing required parameters' });
    }

    const masterySystem = new MasterySystem(prisma);
    const progress = await masterySystem.getStudentProgress(
      studentId as string,
      topicId as string
    );

    res.status(200).json(progress);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
} 