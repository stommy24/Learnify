import { QuestionFormat } from '@/types/assessment';

interface QuestionTemplate {
  content: string;
  format: QuestionFormat;
  difficulty: number;
  variables?: Record<string, any>;
  generateAnswer: () => string;
}

export const mathsTemplates: QuestionTemplate[] = [
  {
    content: "What is {x} + {y}?",
    format: QuestionFormat.NUMERIC,
    difficulty: 1,
    variables: {
      x: () => Math.floor(Math.random() * 10),
      y: () => Math.floor(Math.random() * 10)
    },
    generateAnswer: function() {
      const x = this.variables?.x();
      const y = this.variables?.y();
      return String(x + y);
    }
  },
  // ... other templates
]; 