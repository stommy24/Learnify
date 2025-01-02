import { readabilityScores } from '@/lib/utils/readability';
import { vocabularyLevels } from '@/lib/data/vocabulary';
import { logger } from '@/lib/monitoring';

interface LanguageMetrics {
  readabilityScore: number;
  vocabularyLevel: number;
  sentenceComplexity: number;
  instructionClarity: number;
  clarity: number;
}

export class LanguageComplexityAnalyzer {
  private readonly AGE_VOCABULARY_MAPPING = {
    7: 'basic',
    8: 'elementary',
    9: 'intermediate',
    10: 'advanced-elementary',
    11: 'pre-intermediate',
    12: 'intermediate-plus'
  };

  async analyze(content: string, targetAge: number): Promise<LanguageMetrics> {
    try {
      const [
        readabilityScore,
        vocabularyLevel,
        sentenceComplexity,
        instructionClarity
      ] = await Promise.all([
        this.calculateReadabilityScore(content),
        this.analyzeVocabularyLevel(content, targetAge),
        this.analyzeSentenceComplexity(content),
        this.analyzeInstructionClarity(content)
      ]);

      const clarity = this.calculateOverallClarity({
        readabilityScore,
        vocabularyLevel,
        sentenceComplexity,
        instructionClarity
      });

      return {
        readabilityScore,
        vocabularyLevel,
        sentenceComplexity,
        instructionClarity,
        clarity
      };
    } catch (error) {
      logger.error('Language analysis failed', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }

  private async calculateReadabilityScore(content: string): Promise<number> {
    const {
      fleschKincaid,
      daleChall,
      automatedReadability
    } = readabilityScores(content);

    // Weighted average of different readability metrics
    return (
      fleschKincaid * 0.4 +
      daleChall * 0.4 +
      automatedReadability * 0.2
    );
  }

  private async analyzeVocabularyLevel(
    content: string,
    targetAge: number
  ): Promise<number> {
    const words = content.toLowerCase().split(/\s+/);
    const ageLevel = this.AGE_VOCABULARY_MAPPING[
      targetAge as keyof typeof this.AGE_VOCABULARY_MAPPING
    ] || 'intermediate';

    const appropriateVocabulary = vocabularyLevels[ageLevel];
    const complexWords = words.filter(
      word => !appropriateVocabulary.includes(word)
    );

    return 1 - (complexWords.length / words.length);
  }

  private analyzeSentenceComplexity(content: string): number {
    const sentences = content.split(/[.!?]+/);
    const complexityFactors = sentences.map(sentence => ({
      length: sentence.split(/\s+/).length,
      subordinateClauses: this.countSubordinateClauses(sentence),
      complexPhrases: this.countComplexPhrases(sentence)
    }));

    return this.calculateComplexityScore(complexityFactors);
  }

  private analyzeInstructionClarity(content: string): number {
    const factors = {
      hasActionVerbs: /\b(calculate|solve|find|explain|show|write)\b/i.test(content),
      hasStepIndicators: /\b(first|then|next|finally)\b/i.test(content),
      hasExamples: /\b(example|for instance|such as)\b/i.test(content),
      hasClearQuestion: /\?/.test(content),
      hasNumericalContext: /\d/.test(content)
    };

    return Object.values(factors).filter(Boolean).length / Object.keys(factors).length;
  }

  private countSubordinateClauses(sentence: string): number {
    const subordinateMarkers = [
      'because', 'although', 'if', 'unless', 'while',
      'when', 'where', 'that', 'which', 'who'
    ];
    return subordinateMarkers.reduce(
      (count, marker) => count + (sentence.toLowerCase().match(new RegExp(`\\b${marker}\\b`, 'g'))?.length || 0),
      0
    );
  }

  private countComplexPhrases(sentence: string): number {
    const complexPatterns = [
      /in order to/,
      /as well as/,
      /not only.*but also/,
      /on the other hand/,
      /in spite of/
    ];
    return complexPatterns.reduce(
      (count, pattern) => count + (sentence.match(pattern)?.length || 0),
      0
    );
  }

  private calculateComplexityScore(factors: any[]): number {
    const maxAcceptableLength = 15;
    const maxAcceptableClauses = 2;
    const maxAcceptablePhrases = 1;

    return factors.reduce((score, factor) => {
      const lengthScore = Math.min(1, maxAcceptableLength / factor.length);
      const clauseScore = Math.min(1, maxAcceptableClauses / factor.subordinateClauses);
      const phraseScore = Math.min(1, maxAcceptablePhrases / factor.complexPhrases);
      return score + (lengthScore + clauseScore + phraseScore) / 3;
    }, 0) / factors.length;
  }

  private calculateOverallClarity(metrics: Omit<LanguageMetrics, 'clarity'>): number {
    const weights = {
      readabilityScore: 0.3,
      vocabularyLevel: 0.3,
      sentenceComplexity: 0.2,
      instructionClarity: 0.2
    };

    return Object.entries(metrics).reduce(
      (score, [key, value]) => score + value * weights[key as keyof typeof weights],
      0
    );
  }
} 