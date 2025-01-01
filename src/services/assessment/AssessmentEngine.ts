import { Question } from '@/lib/types/quiz';
import { AssessmentResult } from '@/lib/types/assessment';
import { AssessmentConfig } from '@/lib/types/assessment';

export class AssessmentEngine {
  evaluateAnswer(question: Question, answer: string): AssessmentResult {
    const isCorrect = answer === question.correctAnswer;
    
    return {
      id: crypto.randomUUID(),
      questionId: question.id,
      question,
      answer,
      isCorrect,
      score: isCorrect ? 1 : 0,
      totalQuestions: 1,
      correctAnswers: isCorrect ? 1 : 0,
      timeSpent: 0,
      startedAt: new Date(),
      timestamp: new Date(),
      feedback: [],
      config: this.createConfig(question),
      questions: [question],
      currentQuestion: 1,
      completed: false
    };
  }

  private createConfig(question: Question): AssessmentConfig {
    return {
      topics: [question.topic],
      yearGroup: 1,
      term: 1,
      difficulty: question.difficulty,
      subject: question.subject,
      questionCount: 1,
      allowNavigation: true,
      showFeedback: true,
      adaptiveDifficulty: false,
      questionTypes: [question.type]
    };
  }
} 