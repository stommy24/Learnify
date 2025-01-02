import { prisma } from '@/lib/db';
import { Assessment, AssessmentQuestion } from '@/types/assessment';
import { logger } from '@/lib/monitoring';

interface AnswerAnalysis {
  score: number;
  timePerQuestion: number[];
  conceptMastery: Record<string, number>;
  strengthAreas: string[];
  weaknessAreas: string[];
  recommendations: string[];
  confidence: number;
}

interface QuestionAnalysis {
  correct: boolean;
  timeTaken: number;
  confidence: number;
  conceptId: string;
  difficulty: number;
}

export class AnswerAnalysisService {
  async analyzeAnswers(
    assessment: Assessment,
    answers: Record<string, any>,
    timeData: Record<string, number>
  ): Promise<AnswerAnalysis> {
    try {
      const questionAnalyses = await this.analyzeQuestions(
        assessment.questions,
        answers,
        timeData
      );

      const conceptMastery = this.calculateConceptMastery(questionAnalyses);
      const score = this.calculateOverallScore(questionAnalyses);
      
      return {
        score,
        timePerQuestion: questionAnalyses.map(qa => qa.timeTaken),
        conceptMastery,
        strengthAreas: this.identifyStrengths(conceptMastery),
        weaknessAreas: this.identifyWeaknesses(conceptMastery),
        recommendations: await this.generateRecommendations(
          conceptMastery,
          score,
          assessment.type
        ),
        confidence: this.calculateConfidence(questionAnalyses)
      };
    } catch (error) {
      logger.error('Failed to analyze answers', {
        assessmentId: assessment.id,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }

  private async analyzeQuestions(
    questions: AssessmentQuestion[],
    answers: Record<string, any>,
    timeData: Record<string, number>
  ): Promise<QuestionAnalysis[]> {
    return Promise.all(
      questions.map(async question => {
        const answer = answers[question.id];
        const timeTaken = timeData[question.id] || 0;
        
        return {
          correct: await this.checkAnswer(question, answer),
          timeTaken,
          confidence: this.calculateAnswerConfidence(question, answer, timeTaken),
          conceptId: question.conceptId,
          difficulty: question.difficulty
        };
      })
    );
  }

  private async checkAnswer(
    question: AssessmentQuestion,
    answer: any
  ): Promise<boolean> {
    switch (question.format) {
      case 'MULTIPLE_CHOICE':
        return this.checkMultipleChoice(question, answer);
      case 'TEXT_INPUT':
        return this.checkTextInput(question, answer);
      case 'EQUATION_BUILDER':
        return this.checkEquation(question, answer);
      case 'DRAWING':
        return this.checkDrawing(question, answer);
      default:
        return false;
    }
  }

  private calculateConceptMastery(
    analyses: QuestionAnalysis[]
  ): Record<string, number> {
    const conceptScores: Record<string, { total: number; count: number }> = {};
    
    analyses.forEach(analysis => {
      if (!conceptScores[analysis.conceptId]) {
        conceptScores[analysis.conceptId] = { total: 0, count: 0 };
      }
      
      const score = analysis.correct ? 1 : 0;
      const weight = 1 + (analysis.difficulty * 0.5);
      
      conceptScores[analysis.conceptId].total += score * weight;
      conceptScores[analysis.conceptId].count += weight;
    });

    return Object.entries(conceptScores).reduce(
      (mastery, [conceptId, { total, count }]) => ({
        ...mastery,
        [conceptId]: total / count
      }),
      {}
    );
  }

  private calculateOverallScore(analyses: QuestionAnalysis[]): number {
    const totalPoints = analyses.reduce(
      (sum, analysis) => sum + (1 + analysis.difficulty),
      0
    );
    
    const earnedPoints = analyses.reduce(
      (sum, analysis) => sum + (analysis.correct ? (1 + analysis.difficulty) : 0),
      0
    );

    return earnedPoints / totalPoints;
  }

  private calculateAnswerConfidence(
    question: AssessmentQuestion,
    answer: any,
    timeTaken: number
  ): number {
    const timeConfidence = this.calculateTimeConfidence(
      timeTaken,
      question.timeEstimate
    );
    const answerConfidence = this.calculateAnswerPatternConfidence(
      question,
      answer
    );
    
    return (timeConfidence + answerConfidence) / 2;
  }

  private calculateTimeConfidence(actual: number, expected: number): number {
    const ratio = actual / expected;
    if (ratio < 0.5 || ratio > 2) return 0.5;
    return 1 - Math.abs(1 - ratio);
  }

  private calculateAnswerPatternConfidence(
    question: AssessmentQuestion,
    answer: any
  ): number {
    // Implementation of answer pattern confidence calculation
    return 1;
  }

  private identifyStrengths(
    conceptMastery: Record<string, number>
  ): string[] {
    return Object.entries(conceptMastery)
      .filter(([_, score]) => score >= 0.8)
      .map(([conceptId]) => conceptId);
  }

  private identifyWeaknesses(
    conceptMastery: Record<string, number>
  ): string[] {
    return Object.entries(conceptMastery)
      .filter(([_, score]) => score < 0.6)
      .map(([conceptId]) => conceptId);
  }

  private async generateRecommendations(
    conceptMastery: Record<string, number>,
    overallScore: number,
    assessmentType: string
  ): Promise<string[]> {
    const recommendations: string[] = [];

    if (overallScore < 0.6) {
      recommendations.push('Review fundamental concepts before proceeding');
    }

    const weakConcepts = this.identifyWeaknesses(conceptMastery);
    if (weakConcepts.length > 0) {
      const concepts = await prisma.concept.findMany({
        where: { id: { in: weakConcepts } }
      });
      
      concepts.forEach(concept => {
        recommendations.push(
          `Practice more with ${concept.name} - try interactive exercises`
        );
      });
    }

    return recommendations;
  }

  private calculateConfidence(analyses: QuestionAnalysis[]): number {
    return analyses.reduce(
      (sum, analysis) => sum + analysis.confidence,
      0
    ) / analyses.length;
  }
} 