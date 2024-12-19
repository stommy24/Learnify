import { 
  Question,
  ValidationResult,
  Subject,
  MathsTopic,
  EnglishTopic,
  QuizConfig,
  GeneratedQuiz
} from '../types';
import { QuizGenerator } from '../ai/QuizGenerator';
import { AnswerValidator } from '../ai/AnswerValidator';

export interface AssessmentConfig extends QuizConfig {
  timeLimit?: number;
}

export interface Assessment {
  id: string;
  config: AssessmentConfig;
  questions: Question[];
  startedAt: Date;
  completedAt?: Date;
  answers: Map<string, string>;
  score?: number;
  status: 'in-progress' | 'completed' | 'expired';
}

export interface AssessmentResult {
  id: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  feedback: string[];
  topicPerformance: {
    topic: MathsTopic | EnglishTopic;
    score: number;
    questionsCount: number;
  }[];
}

export class AssessmentManager {
  private static instance: AssessmentManager;
  private assessments: Map<string, Assessment>;
  private quizGenerator: QuizGenerator;
  private answerValidator: AnswerValidator;

  private constructor() {
    this.assessments = new Map();
    this.quizGenerator = QuizGenerator.getInstance();
    this.answerValidator = AnswerValidator.getInstance();
  }

  static getInstance(): AssessmentManager {
    if (!AssessmentManager.instance) {
      AssessmentManager.instance = new AssessmentManager();
    }
    return AssessmentManager.instance;
  }

  async createAssessment(config: AssessmentConfig): Promise<ValidationResult & { assessmentId?: string }> {
    try {
      const quizResult = await this.quizGenerator.generateQuiz(config);

      if (!quizResult.isValid || !quizResult.quiz) {
        return {
          isValid: false,
          errors: quizResult.errors,
          warnings: quizResult.warnings
        };
      }

      const assessment: Assessment = {
        id: `assessment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        config,
        questions: quizResult.quiz.questions,
        startedAt: new Date(),
        answers: new Map(),
        status: 'in-progress'
      };

      this.assessments.set(assessment.id, assessment);

      // Start timer if timeLimit is set
      if (config.timeLimit) {
        setTimeout(() => {
          this.expireAssessment(assessment.id);
        }, config.timeLimit * 1000);
      }

      return {
        isValid: true,
        errors: [],
        warnings: quizResult.warnings,
        assessmentId: assessment.id
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        isValid: false,
        errors: [`Failed to create assessment: ${errorMessage}`],
        warnings: []
      };
    }
  }

  private expireAssessment(assessmentId: string): void {
    const assessment = this.assessments.get(assessmentId);
    if (assessment && assessment.status === 'in-progress') {
      assessment.status = 'expired';
      assessment.completedAt = new Date();
    }
  }

  async submitAnswer(
    assessmentId: string,
    questionId: string,
    answer: string
  ): Promise<ValidationResult> {
    try {
      const assessment = this.assessments.get(assessmentId);
      if (!assessment) {
        return {
          isValid: false,
          errors: ['Assessment not found'],
          warnings: []
        };
      }

      if (assessment.status !== 'in-progress') {
        return {
          isValid: false,
          errors: [`Assessment is ${assessment.status}`],
          warnings: []
        };
      }

      const question = assessment.questions.find(q => q.id === questionId);
      if (!question) {
        return {
          isValid: false,
          errors: ['Question not found'],
          warnings: []
        };
      }

      const validation = await this.answerValidator.validateAnswer(
        question.question,
        answer,
        question.correctAnswer,
        assessment.config.subject,
        question.topic
      );

      if (validation.isValid) {
        assessment.answers.set(questionId, answer);
      }

      return validation;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        isValid: false,
        errors: [`Failed to submit answer: ${errorMessage}`],
        warnings: []
      };
    }
  }

  completeAssessment(assessmentId: string): ValidationResult & { result?: AssessmentResult } {
    try {
      const assessment = this.assessments.get(assessmentId);
      if (!assessment) {
        return {
          isValid: false,
          errors: ['Assessment not found'],
          warnings: []
        };
      }

      if (assessment.status !== 'in-progress') {
        return {
          isValid: false,
          errors: [`Assessment is already ${assessment.status}`],
          warnings: []
        };
      }

      const topicPerformance = this.calculateTopicPerformance(assessment);
      const correctAnswers = topicPerformance.reduce(
        (sum, topic) => sum + (topic.score * topic.questionsCount), 
        0
      );

      assessment.completedAt = new Date();
      assessment.status = 'completed';
      
      const timeSpent = assessment.completedAt.getTime() - assessment.startedAt.getTime();
      const score = (correctAnswers / assessment.questions.length) * 100;

      const result: AssessmentResult = {
        id: assessmentId,
        score,
        totalQuestions: assessment.questions.length,
        correctAnswers: Math.round(correctAnswers),
        timeSpent,
        feedback: this.generateFeedback(score, timeSpent, assessment.config),
        topicPerformance
      };

      return {
        isValid: true,
        errors: [],
        warnings: [],
        result
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        isValid: false,
        errors: [`Failed to complete assessment: ${errorMessage}`],
        warnings: []
      };
    }
  }

  private calculateTopicPerformance(assessment: Assessment): AssessmentResult['topicPerformance'] {
    const topicResults = new Map<MathsTopic | EnglishTopic, { correct: number; total: number }>();

    assessment.questions.forEach(question => {
      const result = topicResults.get(question.topic) || { correct: 0, total: 0 };
      const answer = assessment.answers.get(question.id);
      
      result.total++;
      if (answer === question.correctAnswer) {
        result.correct++;
      }

      topicResults.set(question.topic, result);
    });

    return Array.from(topicResults.entries()).map(([topic, result]) => ({
      topic,
      score: result.correct / result.total,
      questionsCount: result.total
    }));
  }

  private generateFeedback(score: number, timeSpent: number, config: AssessmentConfig): string[] {
    const feedback: string[] = [];
    const timeSpentMinutes = timeSpent / (1000 * 60);

    if (score >= 80) {
      feedback.push('Excellent performance!');
    } else if (score >= 60) {
      feedback.push('Good effort, but there\'s room for improvement.');
    } else {
      feedback.push('More practice needed in this area.');
    }

    const averageTimePerQuestion = timeSpentMinutes / config.questionCount;
    if (config.timeLimit && timeSpentMinutes >= config.timeLimit / 60) {
      feedback.push('Try to manage your time better in future assessments.');
    } else if (averageTimePerQuestion > 2) {
      feedback.push('Work on improving your speed while maintaining accuracy.');
    }

    return feedback;
  }
}

export const useAssessmentManager = () => {
  const manager = AssessmentManager.getInstance();
  return {
    createAssessment: manager.createAssessment.bind(manager),
    submitAnswer: manager.submitAnswer.bind(manager),
    completeAssessment: manager.completeAssessment.bind(manager)
  };
}; 