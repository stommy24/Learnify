import { prisma } from '@/lib/prisma';
import { AssessmentCache } from '@/lib/cache/assessment';
import { 
  AssessmentResult, 
  ScoreCard, 
  PerformanceMetrics,
  AnalyticsData 
} from '@/types/assessment';

export class AnalyticsService {
  private cache: AssessmentCache;

  constructor() {
    this.cache = new AssessmentCache();
  }

  async generateAnalytics(userId: string): Promise<AnalyticsData> {
    const [results, scoreCards, metrics] = await Promise.all([
      this.getAssessmentResults(userId),
      this.getScoreCards(userId),
      this.getPerformanceMetrics(userId)
    ]);

    return {
      overallProgress: this.calculateOverallProgress(scoreCards),
      topicStrengths: this.analyzeTopicStrengths(results),
      learningTrends: this.analyzeLearningTrends(scoreCards),
      recommendedActions: this.generateRecommendations(metrics)
    };
  }

  private calculateOverallProgress(scoreCards: ScoreCard[]): number {
    if (!scoreCards.length) return 0;
    return scoreCards.reduce((sum, card) => sum + card.percentage, 0) / scoreCards.length;
  }

  private analyzeTopicStrengths(results: AssessmentResult[]): Record<string, number> {
    const strengths: Record<string, { correct: number; total: number }> = {};
    
    results.forEach(result => {
      const topic = result.question?.topic || 'unknown';
      if (!strengths[topic]) {
        strengths[topic] = { correct: 0, total: 0 };
      }
      strengths[topic].total++;
      if (result.isCorrect) strengths[topic].correct++;
    });

    return Object.entries(strengths).reduce((acc, [topic, data]) => {
      acc[topic] = (data.correct / data.total) * 100;
      return acc;
    }, {} as Record<string, number>);
  }

  private analyzeLearningTrends(scoreCards: ScoreCard[]): {
    date: string;
    score: number;
  }[] {
    return scoreCards
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
      .map(card => ({
        date: new Date(card.timestamp).toISOString().split('T')[0],
        score: card.percentage
      }));
  }

  private generateRecommendations(metrics: PerformanceMetrics[]): string[] {
    if (!metrics.length) return [];
    const latestMetrics = metrics[metrics.length - 1];
    return latestMetrics.recommendedFocus ?? [] as string[];
  }

  async getAssessmentResults(userId: string): Promise<AssessmentResult[]> {
    return await prisma.assessmentResult.findMany({
      where: { userId },
      include: { question: true }
    });
  }

  async getScoreCards(userId: string): Promise<ScoreCard[]> {
    return await prisma.scoreCard.findMany({
      where: { userId }
    });
  }

  async getPerformanceMetrics(userId: string): Promise<PerformanceMetrics[]> {
    return await prisma.performanceMetrics.findMany({
      where: { userId }
    });
  }
} 