import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { logger } from '@/lib/logger';
import { rateLimit } from '@/lib/rateLimit';

export function apiHandler(handler: Function) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      // Rate limiting
      await rateLimit(req, res);

      // Authentication check
      const session = await getSession({ req });
      if (!session) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Add user to request
      req.user = session.user;

      // Log request
      logger.info(`API Request: ${req.method} ${req.url}`, {
        userId: session.user.id,
        method: req.method,
        path: req.url
      });

      // Execute handler
      await handler(req, res);

    } catch (error) {
      logger.error('API Error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
} 