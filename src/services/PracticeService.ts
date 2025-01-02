import { prisma } from '@/lib/db';
import { logger } from '@/lib/monitoring';

interface PracticeQuestion {
  id: string;
  content: string;
  type: 'multiple-choice' | 'numeric' | 'text';
  options?: string[];
  correctAnswer: string;
  hint?: string;
  difficulty: number;
  conceptId: string;
}

interface PracticeSession {
  id: string;
  userId: string;
  topicId: string;
  questions: PracticeQuestion[];
  startedAt: Date;
  completedAt?: Date;
  results?: {
    correct: number;
    total: number;
    timeSpent: number;
  };
}

export class PracticeService {
  async generatePracticeSession(
    userId: string,
    topicId: string,
    difficulty: number
  ): Promise<PracticeSession> {
    try {
      // Get appropriate questions based on topic and difficulty
      const questions = await this.getQuestions(topicId, difficulty);

      // Create practice session
      const session = await prisma.practiceSession.create({
        data: {
          userId,
          topicId,
          questions,
          startedAt: new Date(),
          status: 'IN_PROGRESS'
        }
      });

      return {
        id: session.id,
        userId,
        topicId,
        questions,
        startedAt: session.startedAt
      };
    } catch (error) {
      logger.error('Failed to generate practice session', {
        userId,
        topicId,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }

  async submitPracticeResults(
    sessionId: string,
    results: {
      answers: { questionId: string; answer: string; timeSpent: number }[];
      totalTimeSpent: number;
    }
  ): Promise<void> {
    try {
      const session = await prisma.practiceSession.findUnique({
        where: { id: sessionId },
        include: { questions: true }
      });

      if (!session) {
        throw new Error('Practice session not found');
      }

      // Calculate results
      const correct = results.answers.filter(answer => {
        const question = session.questions.find(q => q.id === answer.questionId);
        return question?.correctAnswer === answer.answer;
      }).length;

      // Update session
      await prisma.practiceSession.update({
        where: { id: sessionId },
        data: {
          completedAt: new Date(),
          status: 'COMPLETED',
          results: {
            correct,
            total: session.questions.length,
            timeSpent: results.totalTimeSpent
          }
        }
      });

      // Record individual answers
      await prisma.practiceAnswer.createMany({
        data: results.answers.map(answer => ({
          sessionId,
          questionId: answer.questionId,
          answer: answer.answer,
          timeSpent: answer.timeSpent,
          isCorrect: session.questions.find(
            q => q.id === answer.questionId
          )?.correctAnswer === answer.answer
        }))
      });

      // Update user progress
      await this.updateUserProgress(session.userId, session.topicId, {
        correct,
        total: session.questions.length,
        timeSpent: results.totalTimeSpent
      });
    } catch (error) {
      logger.error('Failed to submit practice results', {
        sessionId,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }

  private async getQuestions(
    topicId: string,
    difficulty: number
  ): Promise<PracticeQuestion[]> {
    // Get questions from database based on topic and difficulty
    const questions = await prisma.question.findMany({
      where: {
        topicId,
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
      content: q.content,
      type: q.type as 'multiple-choice' | 'numeric' | 'text',
      options: q.options as string[],
      correctAnswer: q.correctAnswer,
      hint: q.hint,
      difficulty: q.difficulty,
      conceptId: q.conceptId
    }));
  }

  private async updateUserProgress(
    userId: string,
    topicId: string,
    results: { correct: number; total: number; timeSpent: number }
  ): Promise<void> {
    const progress = await prisma.userProgress.upsert({
      where: {
        userId_topicId: {
          userId,
          topicId
        }
      },
      update: {
        totalAttempts: { increment: 1 },
        totalCorrect: { increment: results.correct },
        totalQuestions: { increment: results.total },
        totalTimeSpent: { increment: results.timeSpent },
        lastAttemptAt: new Date()
      },
      create: {
        userId,
        topicId,
        totalAttempts: 1,
        totalCorrect: results.correct,
        totalQuestions: results.total,
        totalTimeSpent: results.timeSpent,
        lastAttemptAt: new Date()
      }
    });
  }
} 