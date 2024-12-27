import { prisma } from '@/lib/prisma';
import type { AssessmentResult, ScoreCard, PerformanceMetrics } from '@/types/assessment';

export async function saveAssessmentResult(userId: string, result: AssessmentResult) {
  return prisma.assessmentResult.create({
    data: {
      userId,
      questionId: result.questionId,
      correct: result.isCorrect,
      score: result.score || 0,
      feedback: result.feedback,
      timestamp: result.timestamp ? new Date(result.timestamp) : new Date()
    }
  });
}

export async function saveScoreCard(userId: string, scoreCard: ScoreCard) {
  return prisma.scoreCard.create({
    data: {
      userId,
      totalQuestions: scoreCard.totalQuestions,
      correctAnswers: scoreCard.correctAnswers,
      totalPoints: scoreCard.totalPoints,
      maxPoints: scoreCard.maxPoints,
      percentage: scoreCard.percentage,
      timestamp: new Date(scoreCard.timestamp)
    }
  });
}

export async function getHistoricalScores(userId: string) {
  return prisma.scoreCard.findMany({
    where: { userId },
    orderBy: { timestamp: 'desc' },
    take: 10
  });
}

export async function savePerformanceMetrics(userId: string, metrics: PerformanceMetrics) {
  return prisma.performanceMetrics.create({
    data: {
      userId,
      averageScore: metrics.averageScore,
      improvement: metrics.improvement,
      strengths: metrics.strengths,
      weaknesses: metrics.weaknesses,
      recommendedFocus: metrics.recommendedFocus,
      timestamp: new Date()
    }
  });
} 