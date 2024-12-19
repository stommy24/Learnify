import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import routes from './api/routes';
import { errorHandler } from './api/middleware/errorHandler';
import { requestLogger } from './api/middleware/requestLogger';
import { MetricsService } from './monitoring/metrics';

const app = express();

// Security
app.use(helmet());
app.use(cors());

// Rate limiting
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
}));

// Middleware
app.use(express.json());
app.use(requestLogger);

// Metrics
MetricsService.getInstance();

// Routes
app.use('/api', routes);

// Error handling
app.use(errorHandler);

export default app; 