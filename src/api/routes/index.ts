import express from 'express';
import authRoutes from './auth.routes';
import assessmentRoutes from './assessment.routes';
import subjectRoutes from './subject.routes';
import notificationRoutes from './notification.routes';
import challengeRoutes from './challenge.routes';
import recommendationRoutes from './recommendation.routes';
import progressRoutes from './progress.routes';
import { errorHandler } from '../middleware/errorHandler';
import { requestLogger } from '../middleware/requestLogger';
import { authenticate } from '../middleware/authenticate';

const router = express.Router();

// Middleware
router.use(requestLogger);

// Public routes
router.use('/auth', authRoutes);

// Protected routes
router.use('/assessments', authenticate, assessmentRoutes);
router.use('/subjects', authenticate, subjectRoutes);
router.use('/notifications', authenticate, notificationRoutes);
router.use('/challenges', authenticate, challengeRoutes);
router.use('/recommendations', authenticate, recommendationRoutes);
router.use('/progress', authenticate, progressRoutes);

// Error handling
router.use(errorHandler);

export default router; 