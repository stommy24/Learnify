import { QuestionTemplate, DifficultyLevel, CurriculumTopic } from './types';
import { generateQuestionText, generateDistractors } from './nlpUtils';

interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: string;
  topic: CurriculumTopic;
  difficulty: DifficultyLevel;
}

class QuestionGenerator {
  private templates: QuestionTemplate[];

  constructor(templates: QuestionTemplate[]) {
    this.templates = templates;
  }

  generateQuestion(topic: CurriculumTopic, difficulty: DifficultyLevel): Question {
    const template = this.selectTemplate(topic, difficulty);
    const text = generateQuestionText(template, topic);
    const correctAnswer = this.generateCorrectAnswer(template, topic);
    const distractors = generateDistractors(template, topic, correctAnswer);

    return {
      id: this.generateId(),
      text,
      options: [correctAnswer, ...distractors],
      correctAnswer,
      topic,
      difficulty,
    };
  }

  private selectTemplate(topic: CurriculumTopic, difficulty: DifficultyLevel): QuestionTemplate {
    // Logic to select appropriate template based on topic and difficulty
    return this.templates.find(t => t.topic === topic && t.difficulty === difficulty)!;
  }

  private generateCorrectAnswer(template: QuestionTemplate, topic: CurriculumTopic): string {
    // Logic to generate the correct answer based on the template and topic
    return 'Correct Answer';
  }

  private generateId(): string {
    // Logic to generate a unique question ID
    return `Q-${Math.random().toString(36).substr(2, 9)}`;
  }
}

export const questionGenerator = new QuestionGenerator([
  // Initialize with predefined templates
]);