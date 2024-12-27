import type { NextApiRequest, NextApiResponse } from 'next';
import { QuestionGenerationOrchestrator } from '@/services/question-generation';
import { GenerationRequest } from '@/types/generation';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const orchestrator = new QuestionGenerationOrchestrator();
    const request = req.body as GenerationRequest;
    
    // Validate request
    if (!request.curriculum || !request.difficulty || !request.count) {
      return res.status(400).json({ error: 'Invalid request parameters' });
    }

    const requestId = await orchestrator.generateQuestions(request);
    res.status(200).json({ requestId });
  } catch (error) {
    console.error('Question generation failed:', error);
    res.status(500).json({ error: 'Failed to generate questions' });
  }
} 