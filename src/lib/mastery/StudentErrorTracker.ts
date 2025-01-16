import { PrismaClient } from '@prisma/client';

interface ErrorData {
  userId: string;
  errors: string[];
  timeframe: 'daily' | 'weekly' | 'monthly';
}

export class StudentErrorTracker {
  constructor(private prisma: PrismaClient) {}

  async trackErrors(data: ErrorData) {
    await this.prisma.errorPattern.create({
      data: {
        userId: data.userId,
        errorList: data.errors,
        timeframe: data.timeframe,
        timestamp: new Date()
      }
    });
  }
} 