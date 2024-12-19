import { z } from 'zod';

const mathAnswerSchema = z.object({
  numericAnswer: z.number().or(z.string()),
  workingSteps: z.array(z.string()).optional(),
  timeSpent: z.number(),
  method: z.string().optional()
});

const englishAnswerSchema = z.object({
  writtenResponse: z.string(),
  wordCount: z.number(),
  keyPoints: z.array(z.string()).optional(),
  citations: z.array(z.string()).optional()
});

export class AnswerValidationSystem {
  private toleranceRange: number = 0.001; // For floating point math answers

  validateMathAnswer(
    submission: z.infer<typeof mathAnswerSchema>,
    correctAnswer: number | string,
    level: string
  ) {
    if (typeof submission.numericAnswer === 'number' && 
        typeof correctAnswer === 'number') {
      return Math.abs(submission.numericAnswer - correctAnswer) <= this.toleranceRange;
    }

    // Handle fraction/algebraic answers
    return this.compareAlgebraicAnswers(
      submission.numericAnswer.toString(),
      correctAnswer.toString()
    );
  }

  validateEnglishAnswer(
    submission: z.infer<typeof englishAnswerSchema>,
    criteria: {
      requiredKeywords: string[];
      minWordCount: number;
      grammarRules: string[];
    }
  ) {
    const results = {
      keywordMatch: this.checkKeywords(submission.writtenResponse, criteria.requiredKeywords),
      wordCountMet: submission.wordCount >= criteria.minWordCount,
      grammarValid: this.validateGrammar(submission.writtenResponse, criteria.grammarRules)
    };

    return {
      ...results,
      passed: Object.values(results).every(Boolean)
    };
  }

  private compareAlgebraicAnswers(submitted: string, correct: string): boolean {
    // Implementation for comparing algebraic expressions
    return true; // Placeholder
  }

  private checkKeywords(text: string, keywords: string[]): boolean {
    return keywords.every(keyword => 
      text.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  private validateGrammar(text: string, rules: string[]): boolean {
    // Implementation for grammar validation
    return true; // Placeholder
  }
} 