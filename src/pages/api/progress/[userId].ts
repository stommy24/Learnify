import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { ProgressionService } from '@/services/progression/ProgressionService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: 'Unauthorized' });

  const { userId } = req.query;
  const progressionService = new ProgressionService();

  try {
    switch (req.method) {
      case 'GET':
        const { topicId } = req.query;
        const progress = progressionService.getCurrentProgress(userId as string, topicId as string);
        return res.status(200).json(progress);

      case 'POST':
        const { topicId: tid, objectiveId, assessmentResult } = req.body;
        const updatedProgress = progressionService.updateProgress(
            userId as string,
            tid,
            objectiveId,
            assessmentResult
        );
        return res.status(200).json(updatedProgress);

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
} 