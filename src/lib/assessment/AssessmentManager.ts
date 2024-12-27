import { AssessmentResult, TopicPerformance, AssessmentConfig } from '@/lib/types/assessment';
import { Question } from '@/lib/types/quiz';
import { AssessmentException, AssessmentError } from './types';
import { validateQuestions } from '@/components/assessment/validation';

export class AssessmentManager {
  private difficultyLevels = [1, 2, 3, 4, 5];
  private performanceThreshold = 0.7;
  private consecutiveCorrect = 0;
  private consecutiveIncorrect = 0;

  createAssessmentResult(question: Question, answer: string): AssessmentResult {
    try {
      this.validateQuestion(question);
      this.validateAnswer(answer, question);

      const isCorrect = this.evaluateAnswer(question, answer);
      const score = this.calculateScore(isCorrect, question.difficulty);
      
      return {
        id: crypto.randomUUID(),
        questionId: question.id,
        question,
        answer,
        isCorrect,
        score,
        totalQuestions: 1,
        correctAnswers: isCorrect ? 1 : 0,
        timeSpent: 0,
        timestamp: new Date(),
        feedback: this.generateDetailedFeedback(question, answer, isCorrect),
        config: this.getDefaultConfig(),
        questions: [question],
        startedAt: new Date()
      };
    } catch (error) {
      if (error instanceof AssessmentException) {
        throw error;
      }
      throw new AssessmentException(
        'SYSTEM_ERROR',
        'Failed to create assessment result',
        { question, answer, error }
      );
    }
  }

  createFinalResult(
    questions: Question[],
    answers: string[],
    timeSpent: number
  ): AssessmentResult {
    try {
      this.validateAssessment(questions, answers);

      const results = questions.map((question, index) => 
        this.createAssessmentResult(question, answers[index])
      );

      const totalScore = this.calculateTotalScore(results);
      const correctAnswers = results.filter(r => r.isCorrect).length;

      return {
        id: crypto.randomUUID(),
        score: totalScore / questions.length,
        timeSpent,
        timestamp: new Date(),
        questionId: questions[0].id,
        question: questions[0],
        answer: answers[0],
        isCorrect: (totalScore / questions.length) >= 0.7,
        totalQuestions: questions.length,
        correctAnswers,
        feedback: this.aggregateFeedback(results),
        config: this.getAssessmentConfig(questions),
        questions,
        startedAt: new Date(Date.now() - timeSpent * 1000)
      };
    } catch (error) {
      if (error instanceof AssessmentException) {
        throw error;
      }
      throw new AssessmentException(
        'SYSTEM_ERROR',
        'Failed to create final result',
        { questions, answers, timeSpent, error }
      );
    }
  }

  private validateQuestion(question: Question): void {
    if (!question.id || !question.text || !question.correctAnswer) {
      throw new AssessmentException(
        'INVALID_QUESTION',
        'Question is missing required fields',
        { question }
      );
    }
  }

  private validateAnswer(answer: string, question: Question): void {
    if (!answer) {
      throw new AssessmentException(
        'INVALID_ANSWER',
        'Answer cannot be empty',
        { questionId: question.id }
      );
    }
  }

  private validateAssessment(questions: Question[], answers: string[]): void {
    if (!validateQuestions(questions)) {
      throw new AssessmentException(
        'VALIDATION_ERROR',
        'Invalid questions format'
      );
    }

    if (questions.length !== answers.length) {
      throw new AssessmentException(
        'VALIDATION_ERROR',
        'Number of answers does not match number of questions',
        { questionCount: questions.length, answerCount: answers.length }
      );
    }
  }

  private evaluateAnswer(question: Question, answer: string): boolean {
    return question.correctAnswer === answer;
  }

  private calculateScore(isCorrect: boolean, difficulty: number = 1): number {
    return isCorrect ? 100 * difficulty : 0;
  }

  private calculateTotalScore(results: AssessmentResult[]): number {
    return results.reduce((sum, result) => sum + (result.score || 0), 0);
  }

  private generateDetailedFeedback(question: Question, answer: string, isCorrect: boolean): string[] {
    const feedback: string[] = [];

    if (!isCorrect) {
      feedback.push(`The correct answer was: ${question.correctAnswer}`);
      if (question.explanation) {
        feedback.push(question.explanation);
      }

      // Add topic-specific hints
      const hints = this.getTopicHints(question.topic);
      if (hints.length > 0) {
        feedback.push('Helpful tips:', ...hints);
      }

      // Add common misconception warnings
      const misconceptions = this.checkForMisconceptions(question, answer);
      if (misconceptions.length > 0) {
        feedback.push('Watch out for:', ...misconceptions);
      }
    } else {
      feedback.push('Well done! Here are some additional insights:');
      const insights = this.getTopicInsights(question.topic);
      feedback.push(...insights);
    }

    return feedback;
  }

  private getTopicHints(topic: string): string[] {
    // Add your topic-specific hints here
    const hintMap: Record<string, string[]> = {
      'math': [
        'Remember to check your units',
        'Try breaking the problem into smaller steps',
        'Look for patterns in the numbers'
      ],
      // Add more topics as needed
    };
    return hintMap[topic] || [];
  }

  private getTopicInsights(topic: string): string[] {
    // Add your topic-specific insights here
    const insightMap: Record<string, string[]> = {
      'math': [
        'This concept is fundamental to algebra',
        'You can apply this to real-world problems',
        'This connects with other mathematical principles'
      ],
      // Add more topics as needed
    };
    return insightMap[topic] || [];
  }

  private checkForMisconceptions(question: Question, answer: string): string[] {
    // Add your misconception detection logic here
    const misconceptions: string[] = [];
    if (question.type === 'multiple-choice') {
      // Example misconception check
      if (answer === question.options?.[0] && answer !== question.correctAnswer) {
        misconceptions.push('Be careful not to choose the first option by default');
      }
    }
    return misconceptions;
  }

  private aggregateFeedback(results: AssessmentResult[]): string[] {
    return results.flatMap(r => r.feedback || []);
  }

  private getDefaultConfig(): AssessmentConfig {
    return {
      topics: [],
      yearGroup: 1,
      term: 1,
      difficulty: 1,
      subject: 'test',
      questionCount: 1,
      timeLimit: undefined,
      allowNavigation: true,
      showFeedback: true,
      adaptiveDifficulty: false,
      questionTypes: ['multiple-choice']
    };
  }

  private getAssessmentConfig(questions: Question[]): AssessmentConfig {
    return {
      topics: Array.from(new Set(questions.map(q => q.topic))),
      yearGroup: 1,
      term: 1,
      difficulty: Math.round(questions.reduce((sum, q) => sum + q.difficulty, 0) / questions.length),
      subject: questions[0]?.subject || 'test',
      questionCount: questions.length,
      timeLimit: undefined,
      allowNavigation: true,
      showFeedback: true,
      adaptiveDifficulty: false,
      questionTypes: Array.from(new Set(questions.map(q => q.type)))
    };
  }

  adjustDifficulty(currentDifficulty: number, isCorrect: boolean): number {
    if (isCorrect) {
      this.consecutiveCorrect++;
      this.consecutiveIncorrect = 0;
      if (this.consecutiveCorrect >= 2) {
        return Math.min(currentDifficulty + 1, Math.max(...this.difficultyLevels));
      }
    } else {
      this.consecutiveIncorrect++;
      this.consecutiveCorrect = 0;
      if (this.consecutiveIncorrect >= 2) {
        return Math.max(currentDifficulty - 1, Math.min(...this.difficultyLevels));
      }
    }
    return currentDifficulty;
  }
} 