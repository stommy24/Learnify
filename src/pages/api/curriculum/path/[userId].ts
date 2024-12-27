import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { CurriculumPathService } from '@/services/curriculum/CurriculumPathService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: 'Unauthorized' });

  const { userId } = req.query;
  const pathService = new CurriculumPathService();

  try {
    switch (req.method) {
      case 'GET':
        const currentPath = await pathService.getCurrentPath(userId as string);
        return res.status(200).json(currentPath);

      case 'POST':
        const { currentTopicId, curriculum } = req.body;
        const nextTopic = await pathService.getNextTopic(
          userId as string,
          currentTopicId,
          curriculum
        );
        return res.status(200).json(nextTopic);

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
} 