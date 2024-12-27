import { prisma } from '@/lib/prisma';
import type { AssessmentResult, ScoreCard, PerformanceMetrics } from '@/types/assessment';

export class PerformanceTracker {
  async getHistoricalScores(userId: string): Promise<ScoreCard[]> {
    return await prisma.scoreCard.findMany({
      where: { userId },
      orderBy: { timestamp: 'asc' }
    });
  }

  async saveMetrics(metrics: PerformanceMetrics): Promise<void> {
    await prisma.performanceMetrics.create({
      data: metrics
    });
  }

  async calculateAverage(scores: ScoreCard[]): Promise<number> {
    if (!scores.length) return 0;
    return scores.reduce((sum, score) => sum + score.percentage, 0) / scores.length;
  }

  async calculateImprovement(scores: ScoreCard[]): Promise<number> {
    if (scores.length < 2) return 0;
    const recent = scores[scores.length - 1].percentage;
    const previous = scores[scores.length - 2].percentage;
    return recent - previous;
  }

  async identifyStrengths(userId: string): Promise<string[]> {
    const results = await prisma.assessmentResult.findMany({
      where: { userId, correct: true },
      include: { question: true }
    });
    
    const topics = results.reduce((acc: Record<string, number>, result: { question: { topic: any; }; }) => {
      const topic = result.question?.topic;
      if (topic) acc[topic] = (acc[topic] || 0) + 1;
      return acc;
    }, {});
    
    return Object.entries(topics)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 3)
      .map(([topic]) => topic);
  }

  async identifyWeaknesses(userId: string): Promise<string[]> {
    const results = await prisma.assessmentResult.findMany({
      where: { userId, correct: false },
      include: { question: true }
    });
    const topics = results.reduce((acc: { [x: string]: any; }, result: { question: { topic: any; }; }) => {
      const topic = result.question?.topic;
      if (topic) acc[topic] = (acc[topic] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(topics)
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .slice(0, 3)
      .map(([topic]) => topic);
  }

  async generateRecommendations(userId: string): Promise<string[]> {
    const weaknesses = await this.identifyWeaknesses(userId);
    return weaknesses.map(topic => `Focus on improving your ${topic} skills`);
  }

  async trackPerformance(userId: string, results: AssessmentResult[]): Promise<void> {
    const totalPoints = results.reduce((acc: number, result: AssessmentResult) => acc + (result.score ?? 0), 0);
    const maxPoints = results.reduce((acc: number, result: AssessmentResult) => acc + (result.question?.points || 0), 0);
    
    const scoreCard: ScoreCard = {
      userId,
      totalQuestions: results.length,
      correctAnswers: results.filter(r => r.isCorrect).length,
      timeSpent: this.calculateTimeSpent(results),
      timestamp: new Date().toISOString(),
      totalPoints,
      maxPoints,
      percentage: (totalPoints / maxPoints) * 100
    };
    
    await this.saveScoreCard(scoreCard);
  }

  private calculateTimeSpent(results: AssessmentResult[]): number {
    return results.reduce((acc: number, result: AssessmentResult) => {
      return acc + (result.timeSpent || 0);
    }, 0);
  }

  private async saveScoreCard(scoreCard: ScoreCard): Promise<void> {
    await prisma.scoreCard.create({ data: scoreCard });
  }
} 