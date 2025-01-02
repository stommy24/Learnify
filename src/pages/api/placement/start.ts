import { NextApiRequest, NextApiResponse } from 'next';
import { placementSystem } from '@/lib/placement/PlacementSystem';
import { InitialPlacementParams } from '@/types/placement';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { studentId, ...params } = req.body;

    if (!studentId) {
      return res.status(400).json({ message: 'Student ID is required' });
    }

    const test = await placementSystem.startTest(studentId, params as InitialPlacementParams);
    res.status(200).json(test);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
} 