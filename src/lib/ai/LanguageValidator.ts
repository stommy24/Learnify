import { Subject, ValidationResult } from '../types';

export class LanguageValidator {
  private static instance: LanguageValidator;

  private readonly readabilityThresholds = {
    1: { maxWordLength: 4, maxSentenceLength: 8 },
    2: { maxWordLength: 5, maxSentenceLength: 10 },
    3: { maxWordLength: 6, maxSentenceLength: 12 },
    4: { maxWordLength: 7, maxSentenceLength: 15 },
    5: { maxWordLength: 8, maxSentenceLength: 18 },
    6: { maxWordLength: 9, maxSentenceLength: 20 }
  };

  private constructor() {}

  static getInstance(): LanguageValidator {
    if (!LanguageValidator.instance) {
      LanguageValidator.instance = new LanguageValidator();
    }
    return LanguageValidator.instance;
  }

  validateLanguage(
    text: string,
    subject: Subject,
    yearGroup: number
  ): ValidationResult {
    try {
      const words = this.getWords(text);
      const sentences = this.getSentences(text);
      const threshold = this.readabilityThresholds[yearGroup] || this.readabilityThresholds[1];

      const errors: string[] = [];
      const warnings: string[] = [];

      // Check word length
      if (this.hasLongWords(words, threshold.maxWordLength)) {
        warnings.push('Contains words that may be too complex for this year group');
      }

      // Check sentence length
      if (this.hasLongSentences(sentences, threshold.maxSentenceLength)) {
        warnings.push('Contains sentences that may be too long for this year group');
      }

      return {
        isValid: errors.length === 0,
        errors,
        warnings
      };
    } catch (error) {
      return {
        isValid: false,
        errors: [`Language validation failed: ${error.message}`],
        warnings: []
      };
    }
  }

  private getWords(text: string): string[] {
    return text.toLowerCase().match(/\b[\w']+\b/g) || [];
  }

  private getSentences(text: string): string[] {
    return text.match(/[^.!?]+[.!?]+/g) || [];
  }

  private hasLongWords(words: string[], maxLength: number): boolean {
    return words.some(word => word.length > maxLength);
  }

  private hasLongSentences(sentences: string[], maxWords: number): boolean {
    return sentences.some(sentence => this.getWords(sentence).length > maxWords);
  }
}

export const useLanguageValidator = () => {
  const validator = LanguageValidator.getInstance();
  return {
    validateLanguage: validator.validateLanguage.bind(validator)
  };
}; 