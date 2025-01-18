import { PrismaClient } from '@prisma/client';

export interface ErrorData {
  userId: string;
  errors: string[];
  timestamp: Date;
}

export class StudentErrorTracker {
  constructor(private readonly prisma: PrismaClient) {}

  async trackErrors(data: ErrorData) {
    return await this.prisma.errorPattern.create({
      data: {
        userId: data.userId,
        errorList: data.errors,
        timestamp: data.timestamp
      }
    });
  }
} 