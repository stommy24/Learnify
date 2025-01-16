import prisma from '@/lib/db';
import { logger } from '@/lib/monitoring';
import type { Question, Progress, Session } from '@prisma/client';

export interface PracticeQuestion {
  id: string;
  content: string;
  type: 'multiple-choice' | 'numeric' | 'text';
  options?: string[];
  correctAnswer: string;
  hint?: string;
  difficulty: number;
  topicId: string;
}

export interface PracticeSession {
  id: string;
  userId: string;
  topicId: string;
  questions: PracticeQuestion[];
  startTime: Date;
  endTime?: Date;
  results?: {
    correct: number;
    total: number;
    timeSpent: number;
  };
}

export class PracticeService {
  static async generatePracticeSession(
    userId: string,
    topicId: string,
    difficulty: number
  ): Promise<PracticeSession> {
    try {
      const questions = await PracticeService.getQuestions(topicId, difficulty);

      const assessment = await prisma.assessment.create({
        data: {
          userId,
          assessmentType: 'PRACTICE',
          status: 'IN_PROGRESS',
          questions: {
            create: questions.map((q, index) => ({
              content: q.content,
              correctAnswer: q.correctAnswer,
              difficulty: q.difficulty,
              skillId: q.topicId,
              points: 1,
              timeLimit: 300
            }))
          }
        },
        include: {
          questions: true
        }
      });

      return {
        id: assessment.id,
        userId,
        topicId,
        questions,
        startTime: assessment.createdAt
      };
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to generate practice session');
      logger.error(err, { userId, topicId, difficulty });
      throw err;
    }
  }

  static async submitPracticeResults(
    sessionId: string,
    results: {
      answers: { questionId: string; answer: string; timeSpent: number }[];
      totalTimeSpent: number;
    }
  ): Promise<void> {
    try {
      const assessment = await prisma.assessment.findUnique({
        where: { id: sessionId },
        include: { questions: true }
      });

      if (!assessment) {
        const err = new Error('Practice session not found');
        logger.error(err, { sessionId });
        throw err;
      }

      // Calculate results
      const correct = results.answers.filter(answer => {
        const question = assessment.questions.find(q => q.id === answer.questionId);
        return question?.correctAnswer === answer.answer;
      }).length;

      // Update assessment
      await prisma.assessment.update({
        where: { id: sessionId },
        data: {
          status: 'COMPLETED',
          score: correct,
          timeSpent: results.totalTimeSpent
        }
      });

      // Record individual answers
      await prisma.questionAnswer.createMany({
        data: results.answers.map(answer => ({
          studentId: assessment.userId,
          questionId: answer.questionId,
          answer: answer.answer,
          correct: assessment.questions.find(
            q => q.id === answer.questionId
          )?.correctAnswer === answer.answer
        }))
      });

      // Update progress
      await PracticeService.updateProgress(assessment.userId, assessment.id, {
        correct,
        total: assessment.questions.length,
        timeSpent: results.totalTimeSpent
      });
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to submit practice results');
      logger.error(err, { sessionId });
      throw err;
    }
  }

  private static async getQuestions(
    topicId: string,
    difficulty: number
  ): Promise<PracticeQuestion[]> {
    try {
      const questions = await prisma.question.findMany({
        where: {
          topic: topicId,
          difficulty: {
            gte: difficulty - 1,
            lte: difficulty + 1
          }
        },
        take: 10,
        orderBy: {
          difficulty: 'asc'
        }
      });

      return questions.map(q => ({
        id: q.id,
        content: q.text,
        type: q.type.toLowerCase() as 'multiple-choice' | 'numeric' | 'text',
        correctAnswer: q.correctAnswer,
        difficulty: q.difficulty,
        topicId: q.topic
      }));
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to get questions');
      logger.error(err, { topicId, difficulty });
      throw err;
    }
  }

  private static async updateProgress(
    userId: string,
    topicId: string,
    results: { correct: number; total: number; timeSpent: number }
  ): Promise<void> {
    try {
      await prisma.progress.upsert({
        where: {
          userId_subjectId: {
            userId,
            subjectId: topicId
          }
        },
        update: {
          currentLevel: {
            increment: results.correct > (results.total / 2) ? 1 : 0
          },
          metrics: {
            set: {
              totalAttempts: { increment: 1 },
              totalCorrect: { increment: results.correct },
              totalQuestions: { increment: results.total },
              totalTimeSpent: { increment: results.timeSpent }
            }
          }
        },
        create: {
          userId,
          subjectId: topicId,
          currentLevel: 1,
          metrics: {
            totalAttempts: 1,
            totalCorrect: results.correct,
            totalQuestions: results.total,
            totalTimeSpent: results.timeSpent
          }
        }
      });
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to update progress');
      logger.error(err, { userId, topicId, results });
      throw err;
    }
  }
} 