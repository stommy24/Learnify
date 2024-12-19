import { QuestionGenerator } from './questionGenerator';
import { logger } from '@/lib/logger';

interface Topic {
  id: string;
  name: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

class MathsTopic implements Topic {
  id = 'math';
  name = 'Mathematics';
  difficulty = 'medium' as const;
}

class EnglishTopic implements Topic {
  id = 'english';
  name = 'English';
  difficulty = 'medium' as const;
}

export class QuizGenerator {
  private questionGenerator: QuestionGenerator;
  private topics: Topic[];

  constructor() {
    this.questionGenerator = new QuestionGenerator();
    this.topics = [new MathsTopic(), new EnglishTopic()];
  }

  async generateQuiz(topicId: string, questionCount: number) {
    try {
      const topic = this.topics.find(t => t.id === topicId);
      if (!topic) {
        throw new Error('Invalid topic');
      }

      return await this.questionGenerator.generateQuiz({
        topic: topic.name,
        difficulty: topic.difficulty,
        questionCount
      });
    } catch (error) {
      logger.error('Quiz generation failed:', error);
      throw new Error('Failed to generate quiz');
    }
  }
} 