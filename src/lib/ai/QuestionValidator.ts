import { 
  Question, 
  ValidationResult, 
  AIQuestionResponse,
  AIQuestionRequest 
} from '../types';

export class QuestionValidator {
  private static instance: QuestionValidator;

  private constructor() {}

  static getInstance(): QuestionValidator {
    if (!QuestionValidator.instance) {
      QuestionValidator.instance = new QuestionValidator();
    }
    return QuestionValidator.instance;
  }

  async validateQuestion(
    question: AIQuestionResponse,
    params: AIQuestionRequest
  ): Promise<ValidationResult> {
    try {
      const errors: string[] = [];
      const warnings: string[] = [];

      // Validate basic structure
      if (!question.question || question.question.trim().length === 0) {
        errors.push('Question text is required');
      }

      if (!question.correctAnswer) {
        errors.push('Correct answer is required');
      }

      // Validate metadata
      if (question.metadata.difficulty !== params.difficulty) {
        warnings.push('Question difficulty does not match requested difficulty');
      }

      if (question.metadata.yearGroup !== params.yearGroup) {
        warnings.push('Question year group does not match requested year group');
      }

      // Validate content length
      if (question.question.length > 500) {
        warnings.push('Question text may be too long');
      }

      // Validate options if present
      if (question.options) {
        if (question.options.length < 2) {
          errors.push('Multiple choice questions must have at least 2 options');
        }
        if (question.options.length > 5) {
          warnings.push('Too many options may confuse students');
        }
      }

      return {
        isValid: errors.length === 0,
        errors,
        warnings
      };

    } catch (error) {
      return {
        isValid: false,
        errors: [`Question validation failed: ${error.message}`],
        warnings: []
      };
    }
  }

  private validateQuestionStructure(question: Question): string[] {
    const errors: string[] = [];

    if (!question.id) {
      errors.push('Question ID is required');
    }

    if (!question.type) {
      errors.push('Question type is required');
    }

    if (!question.topic) {
      errors.push('Question topic is required');
    }

    return errors;
  }

  private validateMetadata(question: Question): string[] {
    const warnings: string[] = [];

    if (question.metadata.difficulty < 1 || question.metadata.difficulty > 5) {
      warnings.push('Question difficulty should be between 1 and 5');
    }

    if (question.metadata.yearGroup < 1 || question.metadata.yearGroup > 6) {
      warnings.push('Year group should be between 1 and 6');
    }

    if (question.metadata.term < 1 || question.metadata.term > 3) {
      warnings.push('Term should be between 1 and 3');
    }

    return warnings;
  }
}

export const useQuestionValidator = () => {
  const validator = QuestionValidator.getInstance();
  return {
    validateQuestion: validator.validateQuestion.bind(validator)
  };
}; 