export interface VocabularyLevel {
  level: number;
  words: Set<string>;
}

export const vocabularyLevels: VocabularyLevel[] = [
  {
    level: 1,
    words: new Set([
      // Basic vocabulary words
    ])
  },
  {
    level: 2,
    words: new Set([
      // Intermediate vocabulary words
    ])
  },
  {
    level: 3,
    words: new Set([
      // Advanced vocabulary words
    ])
  }
];

export function getVocabularyLevel(word: string): number {
  for (const level of vocabularyLevels) {
    if (level.words.has(word.toLowerCase())) {
      return level.level;
    }
  }
  return 1; // Default to basic level if word not found
} 