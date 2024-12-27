import type { AssessmentResult } from '@/types/assessment';
import type { LearningStyleMapping } from '@/types/curriculum';
import { prisma } from '@/lib/prisma';

export class LearningStyleAnalytics {
  async analyzeEffectiveness(userId: string): Promise<{
    preferredStyle: keyof LearningStyleMapping;
    styleEffectiveness: Record<keyof LearningStyleMapping, number>;
    recommendations: string[];
  }> {
    const recentResults = await prisma.assessmentResult.findMany({
      where: { userId },
      orderBy: { timestamp: 'desc' },
      take: 50,
      include: {
        question: true
      }
    });

    const stylePerformance = this.calculateStylePerformance(recentResults);
    const preferredStyle = this.determinePreferredStyle(stylePerformance);
    const recommendations = this.generateRecommendations(stylePerformance);

    return {
      preferredStyle,
      styleEffectiveness: stylePerformance,
      recommendations
    };
  }

  private calculateStylePerformance(results: AssessmentResult[]): Record<keyof LearningStyleMapping, number> {
    const performance: Record<keyof LearningStyleMapping, { total: number; correct: number }> = {
      visual: { total: 0, correct: 0 },
      auditory: { total: 0, correct: 0 },
      kinesthetic: { total: 0, correct: 0 },
      readingWriting: { total: 0, correct: 0 }
    };

    results.forEach(result => {
      const style = this.detectQuestionStyle(result);
      if (style) {
        performance[style].total++;
        if (result.isCorrect) {
          performance[style].correct++;
        }
      }
    });

    return Object.entries(performance).reduce((acc, [style, data]) => ({
      ...acc,
      [style]: data.total > 0 ? (data.correct / data.total) * 100 : 0
    }), {} as Record<keyof LearningStyleMapping, number>);
  }

  private detectQuestionStyle(result: AssessmentResult): keyof LearningStyleMapping | null {
    // This would need to be customized based on your question metadata
    if (result.question?.type?.includes('visual')) return 'visual';
    if (result.question?.type?.includes('audio')) return 'auditory';
    if (result.question?.type?.includes('interactive')) return 'kinesthetic';
    if (result.question?.type?.includes('text')) return 'readingWriting';
    return null;
  }

  private determinePreferredStyle(
    performance: Record<keyof LearningStyleMapping, number>
  ): keyof LearningStyleMapping {
    return Object.entries(performance).reduce(
      (best, [style, score]) => 
        score > performance[best] ? style as keyof LearningStyleMapping : best,
      'visual' as keyof LearningStyleMapping
    );
  }

  private generateRecommendations(
    performance: Record<keyof LearningStyleMapping, number>
  ): string[] {
    const recommendations: string[] = [];
    const styles = Object.entries(performance);
    
    // Sort styles by effectiveness
    styles.sort(([, a], [, b]) => b - a);
    
    const [bestStyle] = styles[0];
    const [worstStyle] = styles[styles.length - 1];

    recommendations.push(
      `Your strongest learning style is ${bestStyle}. Focus on ${bestStyle} learning materials.`
    );

    if (performance[worstStyle as keyof LearningStyleMapping] < 60) {
      recommendations.push(
        `Consider additional practice with ${worstStyle} materials to improve comprehension.`
      );
    }

    return recommendations;
  }
} 