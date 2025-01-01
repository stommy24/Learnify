import { AssessmentConfig } from '@/lib/types/assessment';
import { Question } from '@/lib/types/quiz';

export class AssessmentEngine {
  private questions: Map<string, Question> = new Map();

  constructor(private config: AssessmentConfig) {}

  getConfig() {
    return this.config;
  }

  addQuestion(question: Question) {
    this.questions.set(question.id, question);
  }

  submitAnswer(id: string, answer: string) {
    const question = this.questions.get(id);
    return { correct: question?.correctAnswer === answer };
  }
} 