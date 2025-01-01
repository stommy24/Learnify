import { NextApiRequest, NextApiResponse } from 'next';
import { CurriculumPathService } from '@/services/curriculum/CurriculumPathService';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = req.query;
  
  try {
    // Fetch standards from database
    const standards = await prisma.curriculumStandard.findMany({
      include: { topics: true }
    });
    
    const pathService = new CurriculumPathService(standards);

    switch (req.method) {
      case 'GET':
        const currentPath = await pathService.getCurrentPath(userId as string);
        return res.status(200).json(currentPath);

      case 'POST':
        const nextTopic = await pathService.getNextTopic(userId as string);
        return res.status(200).json(nextTopic);

      default:
        return res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Curriculum path error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
} 