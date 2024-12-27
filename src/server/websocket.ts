import { Server } from 'socket.io';
import type { Server as HTTPServer } from 'http';
import type { AssessmentResult, ScoreCard } from '@/types/assessment';
import { PerformanceTracker } from '@/services/assessment/PerformanceTracker';
import { ScoringService } from '@/services/assessment/ScoringService';

export class WebSocketServer {
  private io: Server;
  private performanceTracker: PerformanceTracker;
  private scoringService: ScoringService;

  constructor(httpServer: HTTPServer) {
    this.io = new Server(httpServer, {
      cors: {
        origin: process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000',
        methods: ['GET', 'POST']
      }
    });
    this.performanceTracker = new PerformanceTracker();
    this.scoringService = new ScoringService();
    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    this.io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);

      socket.on('assessment:submit', async (results: AssessmentResult[]) => {
        try {
          const userId = socket.data.userId;
          if (!userId) {
            socket.emit('error', { message: 'User not authenticated' });
            return;
          }

          // Track performance and calculate score
          await this.performanceTracker.trackPerformance(userId, results);
          const scoreCard = this.scoringService.calculateScore(results, userId);

          // Emit results back to the client
          socket.emit('assessment:complete', { scoreCard });

          // Broadcast progress update to relevant subscribers
          this.broadcastProgressUpdate(userId, scoreCard);
        } catch (error) {
          console.error('Error processing assessment submission:', error);
          socket.emit('error', { message: 'Failed to process assessment' });
        }
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
    });
  }

  private broadcastProgressUpdate(userId: string, scoreCard: ScoreCard): void {
    this.io.to(`user:${userId}`).emit('progress:update', { scoreCard });
  }
} 