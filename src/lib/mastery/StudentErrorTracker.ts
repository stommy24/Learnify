import { prisma } from '@/lib/prisma';
import { PrismaClient, Prisma } from '@prisma/client';

interface ErrorPattern {
  type: string;
  frequency: number;
  examples: string[];
  lastOccurrence: Date;
}

interface WrongAnswer {
  answer: string;
  created_at: Date;
  question_type: string;
  topic: string;
}

export class StudentErrorTracker {
  async trackErrors(studentId: string, timeframe: number = 7) {
    try {
      // 1. Get recent incorrect answers
      const wrongAnswers = await prisma.$queryRaw<WrongAnswer[]>`
        SELECT 
          qa.answer,
          qa.created_at,
          q.type as question_type,
          q.topic
        FROM "QuestionAnswer" qa
        JOIN "Question" q ON qa.question_id = q.id
        WHERE qa.student_id = ${studentId}
          AND qa.correct = false
          AND qa.created_at >= NOW() - INTERVAL '${timeframe} days'
        ORDER BY qa.created_at DESC
      `;

      if (!wrongAnswers.length) {
        return [];
      }

      // 2. Group and analyze errors
      const patterns = this.analyzeAnswers(wrongAnswers);

      // 3. Store results
      await this.savePatterns(studentId, patterns);

      return patterns;

    } catch (error) {
      throw new Error(`Error tracking student errors: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private analyzeAnswers(answers: WrongAnswer[]): ErrorPattern[] {
    const patterns: Map<string, ErrorPattern> = new Map();

    for (const answer of answers) {
      // Create a pattern key based on question type and topic
      const patternKey = `${answer.question_type}-${answer.topic}`;

      if (patterns.has(patternKey)) {
        const pattern = patterns.get(patternKey)!;
        pattern.frequency++;
        pattern.examples.push(answer.answer);
        pattern.lastOccurrence = answer.created_at;
      } else {
        patterns.set(patternKey, {
          type: `${answer.question_type} in ${answer.topic}`,
          frequency: 1,
          examples: [answer.answer],
          lastOccurrence: answer.created_at
        });
      }
    }

    return Array.from(patterns.values())
      .sort((a, b) => b.frequency - a.frequency);
  }

  private async savePatterns(studentId: string, patterns: ErrorPattern[]) {
    await prisma.$executeRaw`
      INSERT INTO "StudentErrorAnalysis" ("id", "studentId", "patterns", "analyzedAt")
      VALUES (
        gen_random_uuid(),
        ${studentId},
        ${JSON.stringify(patterns)}::jsonb,
        NOW()
      )
    `;
  }
} 