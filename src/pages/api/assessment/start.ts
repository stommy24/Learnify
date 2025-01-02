import { NextApiRequest, NextApiResponse } from 'next';
import { assessmentSystem } from '@/lib/assessment/AssessmentSystem';
import { AssessmentType } from '@/types/assessment';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { studentId, type } = req.body;

    if (!studentId || !type) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const assessment = await assessmentSystem.startAssessment(
      studentId,
      type as AssessmentType
    );

    res.status(200).json(assessment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
} 