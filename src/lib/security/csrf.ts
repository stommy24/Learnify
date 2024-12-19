import { csrf } from '@/lib/security/tokens';
import { NextApiRequest, NextApiResponse } from 'next';

export const csrfProtection = async (req: NextApiRequest, res: NextApiResponse, next: () => void) => {
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method || '')) {
    const token = req.headers['x-csrf-token'] as string;
    const cookieToken = req.cookies['csrf-token'];

    if (!token || !cookieToken || !csrf.verify(cookieToken, token)) {
      return res.status(403).json({ error: 'Invalid CSRF token' });
    }
  }
  next();
}; 