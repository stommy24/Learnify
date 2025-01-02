import prisma from '@/lib/db';
import { CustomError } from '@/lib/utils/CustomError';
import { ErrorAnalyzer } from '@/lib/mastery/ErrorAnalyzer';
import { PrismaTransaction } from '@/types/prisma';

export class ErrorPatternHandler {
  constructor(private errorAnalyzer: ErrorAnalyzer) {}

  async analyzeErrors(userId: string, tx: PrismaTransaction) {
    try {
      const patterns = await this.errorAnalyzer.analyzeUserErrors(userId);
      await this.savePatterns(patterns, tx);
      return patterns;
    } catch (error) {
      throw new CustomError('ERROR_ANALYSIS', 'Failed to analyze errors');
    }
  }

  private async savePatterns(patterns: any[], tx: PrismaTransaction) {
    await tx.errorPattern.createMany({
      data: patterns.map(p => ({
        userId: p.userId,
        patternType: p.type,
        frequency: p.frequency,
        lastOccurrence: p.lastOccurrence
      }))
    });
  }
} 