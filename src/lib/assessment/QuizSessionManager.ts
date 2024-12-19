interface QuizSession {
  id: string;
  userId: string;
  quizId: string;
  startTime: Date;
  endTime?: Date;
  timeLimit: number; // in minutes
  currentQuestionIndex: number;
  answers: Record<string, {
    answer: string | string[];
    timeSpent: number;
    timestamp: Date;
  }>;
  status: 'in-progress' | 'completed' | 'timed-out';
}

export class QuizSessionManager {
  private static instance: QuizSessionManager;
  private sessions: Map<string, QuizSession> = new Map();
  private timers: Map<string, NodeJS.Timeout> = new Map();

  private constructor() {}

  static getInstance(): QuizSessionManager {
    if (!QuizSessionManager.instance) {
      QuizSessionManager.instance = new QuizSessionManager();
    }
    return QuizSessionManager.instance;
  }

  async startSession(
    userId: string,
    quizId: string,
    timeLimit: number = 12 // default 12 minutes
  ): Promise<QuizSession> {
    const session: QuizSession = {
      id: `session_${Date.now()}`,
      userId,
      quizId,
      startTime: new Date(),
      timeLimit,
      currentQuestionIndex: 0,
      answers: {},
      status: 'in-progress'
    };

    this.sessions.set(session.id, session);
    
    // Set timer for session
    const timer = setTimeout(() => {
      this.endSession(session.id, 'timed-out');
    }, timeLimit * 60 * 1000);
    
    this.timers.set(session.id, timer);

    await this.persistSession(session);
    return session;
  }

  async submitAnswer(
    sessionId: string,
    questionId: string,
    answer: string | string[],
    timeSpent: number
  ): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (!session) throw new Error('Session not found');

    session.answers[questionId] = {
      answer,
      timeSpent,
      timestamp: new Date()
    };

    session.currentQuestionIndex++;
    await this.persistSession(session);
  }

  async endSession(
    sessionId: string,
    status: 'completed' | 'timed-out' = 'completed'
  ): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (!session) throw new Error('Session not found');

    session.endTime = new Date();
    session.status = status;

    // Clear timer
    const timer = this.timers.get(sessionId);
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(sessionId);
    }

    await this.persistSession(session);
  }

  getTimeRemaining(sessionId: string): number {
    const session = this.sessions.get(sessionId);
    if (!session) throw new Error('Session not found');

    const elapsed = (Date.now() - session.startTime.getTime()) / 1000 / 60;
    return Math.max(0, session.timeLimit - elapsed);
  }

  private async persistSession(session: QuizSession): Promise<void> {
    // Implement database persistence
  }
}

export const useQuizSession = () => {
  const manager = QuizSessionManager.getInstance();
  return {
    startSession: manager.startSession.bind(manager),
    submitAnswer: manager.submitAnswer.bind(manager),
    endSession: manager.endSession.bind(manager),
    getTimeRemaining: manager.getTimeRemaining.bind(manager)
  };
}; 