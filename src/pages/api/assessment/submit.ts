import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import type { NextApiRequest, NextApiResponse } from 'next';
import { PerformanceTracker } from '@/services/assessment/PerformanceTracker';
import type { AssessmentResult } from '@/types/assessment';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const results = req.body.results as AssessmentResult[];
  const tracker = new PerformanceTracker();
  
  try {
    await tracker.trackPerformance(session.user.id, results);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error tracking performance:', error);
    res.status(500).json({ error: 'Failed to track performance' });
  }
} 