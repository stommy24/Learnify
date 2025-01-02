import { prisma } from '@/lib/db';
import { logger } from '@/lib/monitoring';

interface ErrorPattern {
  type: string;
  frequency: number;
  conceptIds: string[];
  examples: Array<{
    questionId: string;
    answer: string;
    correctAnswer: string;
  }>;
}

export class ErrorAnalyzer {
  async analyzeErrors(studentId: string, timeframe: number = 7): Promise<ErrorPattern[]> {
    try {
      // Get recent incorrect answers
      const recentErrors = await prisma.questionAnswer.findMany({
        where: {
          studentId,
          correct: false,
          createdAt: {
            gte: new Date(Date.now() - timeframe * 24 * 60 * 60 * 1000)
          }
        },
        include: {
          question: {
            include: {
              concept: true
            }
          }
        }
      });

      // Group errors by pattern
      const patterns = this.identifyPatterns(recentErrors);

      // Store analysis results
      await prisma.errorAnalysis.create({
        data: {
          studentId,
          patterns,
          analyzedAt: new Date()
        }
      });

      return patterns;
    } catch (error) {
      logger.error('Error analysis failed', {
        studentId,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }

  private identifyPatterns(errors: any[]): ErrorPattern[] {
    const patterns: Map<string, ErrorPattern> = new Map();

    for (const error of errors) {
      const patternType = this.categorizeError(error);
      
      if (!patterns.has(patternType)) {
        patterns.set(patternType, {
          type: patternType,
          frequency: 0,
          conceptIds: [],
          examples: []
        });
      }

      const pattern = patterns.get(patternType)!;
      pattern.frequency++;
      
      if (!pattern.conceptIds.includes(error.question.conceptId)) {
        pattern.conceptIds.push(error.question.conceptId);
      }

      if (pattern.examples.length < 3) {
        pattern.examples.push({
          questionId: error.questionId,
          answer: error.answer,
          correctAnswer: error.question.correctAnswer
        });
      }
    }

    return Array.from(patterns.values())
      .sort((a, b) => b.frequency - a.frequency);
  }

  private categorizeError(error: any): string {
    // Add sophisticated error categorization logic here
    // For example: calculation errors, concept misunderstanding, etc.
    return 'basic-error';
  }
} 