import { 
  Subject, 
  ValidationResult, 
  MathsTopic, 
  EnglishTopic 
} from '../types';

export class AnswerValidator {
  private static instance: AnswerValidator;

  private constructor() {}

  static getInstance(): AnswerValidator {
    if (!AnswerValidator.instance) {
      AnswerValidator.instance = new AnswerValidator();
    }
    return AnswerValidator.instance;
  }

  async validateAnswer(
    question: string,
    providedAnswer: string | string[],
    correctAnswer: string | string[],
    subject: Subject,
    topic: MathsTopic | EnglishTopic
  ): Promise<ValidationResult> {
    try {
      if (subject === 'maths') {
        return this.validateMathsAnswer(providedAnswer, correctAnswer, topic as MathsTopic);
      } else {
        return this.validateEnglishAnswer(providedAnswer, correctAnswer, topic as EnglishTopic);
      }
    } catch (error) {
      return {
        isValid: false,
        errors: [`Answer validation failed: ${error.message}`],
        warnings: []
      };
    }
  }

  private validateMathsAnswer(
    provided: string | string[],
    correct: string | string[],
    topic: MathsTopic
  ): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      if (Array.isArray(provided) !== Array.isArray(correct)) {
        errors.push('Answer format mismatch');
        return { isValid: false, errors, warnings };
      }

      if (Array.isArray(provided) && Array.isArray(correct)) {
        return this.compareArrayAnswers(provided, correct);
      }

      if (typeof provided === 'string' && typeof correct === 'string') {
        return this.compareStringAnswers(provided, correct, topic);
      }

      errors.push('Invalid answer format');
      return { isValid: false, errors, warnings };

    } catch (error) {
      errors.push(`Validation error: ${error.message}`);
      return { isValid: false, errors, warnings };
    }
  }

  private validateEnglishAnswer(
    provided: string | string[],
    correct: string | string[],
    topic: EnglishTopic
  ): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      if (Array.isArray(provided) !== Array.isArray(correct)) {
        errors.push('Answer format mismatch');
        return { isValid: false, errors, warnings };
      }

      if (Array.isArray(provided) && Array.isArray(correct)) {
        return this.compareArrayAnswers(provided, correct);
      }

      if (typeof provided === 'string' && typeof correct === 'string') {
        return this.compareStringAnswers(provided, correct, topic);
      }

      errors.push('Invalid answer format');
      return { isValid: false, errors, warnings };

    } catch (error) {
      errors.push(`Validation error: ${error.message}`);
      return { isValid: false, errors, warnings };
    }
  }

  private compareArrayAnswers(provided: string[], correct: string[]): ValidationResult {
    if (provided.length !== correct.length) {
      return {
        isValid: false,
        errors: ['Number of answers does not match'],
        warnings: []
      };
    }

    const isValid = provided.every((answer, index) => 
      this.compareStringAnswers(answer, correct[index]).isValid
    );

    return {
      isValid,
      errors: isValid ? [] : ['Answers do not match'],
      warnings: []
    };
  }

  private compareStringAnswers(
    provided: string, 
    correct: string, 
    topic?: MathsTopic | EnglishTopic
  ): ValidationResult {
    const normalizedProvided = provided.toLowerCase().trim();
    const normalizedCorrect = correct.toLowerCase().trim();

    const isValid = normalizedProvided === normalizedCorrect;
    const warnings: string[] = [];

    if (!isValid && this.isCloseMatch(normalizedProvided, normalizedCorrect)) {
      warnings.push('Answer is close but not exact');
    }

    return {
      isValid,
      errors: isValid ? [] : ['Answer is incorrect'],
      warnings
    };
  }

  private isCloseMatch(provided: string, correct: string): boolean {
    // Simple Levenshtein distance check for close matches
    const distance = this.levenshteinDistance(provided, correct);
    return distance <= 2; // Allow up to 2 character differences
  }

  private levenshteinDistance(a: string, b: string): number {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;

    const matrix = Array(b.length + 1).fill(null).map(() => 
      Array(a.length + 1).fill(null)
    );

    for (let i = 0; i <= a.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= b.length; j++) matrix[j][0] = j;

    for (let j = 1; j <= b.length; j++) {
      for (let i = 1; i <= a.length; i++) {
        const substitutionCost = a[i - 1] === b[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + substitutionCost
        );
      }
    }

    return matrix[b.length][a.length];
  }
}

export const useAnswerValidator = () => {
  const validator = AnswerValidator.getInstance();
  return {
    validateAnswer: validator.validateAnswer.bind(validator)
  };
}; 