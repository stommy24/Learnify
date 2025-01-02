export interface ReadabilityMetrics {
  fleschKincaid: number;
  averageWordLength: number;
  complexWordCount: number;
}

export class ReadabilityAnalyzer {
  public analyze(text: string): ReadabilityMetrics {
    const words = this.getWords(text);
    const sentences = this.getSentences(text);
    const syllables = this.countSyllables(text);

    return {
      fleschKincaid: this.calculateFleschKincaid(words.length, sentences.length, syllables),
      averageWordLength: this.calculateAverageWordLength(words),
      complexWordCount: this.countComplexWords(words)
    };
  }

  private getWords(text: string): string[] {
    return text.toLowerCase().match(/\b[\w']+\b/g) || [];
  }

  private getSentences(text: string): string[] {
    return text.split(/[.!?]+/).filter(Boolean);
  }

  private countSyllables(text: string): number {
    // Simplified syllable counting logic
    return text.split(/[aeiou]/i).length - 1;
  }

  private calculateFleschKincaid(words: number, sentences: number, syllables: number): number {
    return 206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words);
  }

  private calculateAverageWordLength(words: string[]): number {
    return words.reduce((sum, word) => sum + word.length, 0) / words.length;
  }

  private countComplexWords(words: string[]): number {
    return words.filter(word => this.countSyllables(word) > 2).length;
  }
}

export default new ReadabilityAnalyzer(); 