import type { ScoreCard, AssessmentResult } from '@/types/assessment';

export class ScoringService {
  calculateScore(results: AssessmentResult[], userId: string): ScoreCard {
    const totalPoints = results.reduce((acc, result) => acc + (result.score ?? 0), 0);
    const maxPoints = results.reduce((acc, result) => acc + (result.question?.points || 0), 0);
    
    return {
      userId,
      totalQuestions: results.length,
      correctAnswers: results.filter(r => r.isCorrect).length,
      timeSpent: this.calculateTimeSpent(results),
      totalPoints,
      maxPoints,
      percentage: (totalPoints / maxPoints) * 100,
      timestamp: new Date().toISOString()
    };
  }

  private calculateTimeSpent(results: AssessmentResult[]): number {
    return results.reduce((acc, result) => acc + (result.timeSpent || 0), 0);
  }
} 