import { readFileSync } from 'fs';
import path from 'path';
import { 
  Subject, 
  MathsTopic, 
  EnglishTopic, 
  ValidationResult 
} from '../types';

interface CurriculumData {
  version: string;
  lastUpdated: string;
  topics: {
    [key: string]: {
      yearGroups: {
        [key: string]: {
          terms: {
            [key: string]: {
              objectives: string[];
              keywords: string[];
              expectedOutcomes: string[];
            };
          };
        };
      };
    };
  };
}

export class CurriculumPromptManager {
  private static instance: CurriculumPromptManager;
  private mathsCurriculum: CurriculumData | null = null;
  private englishCurriculum: CurriculumData | null = null;
  private readonly curriculumPath: string;

  private constructor() {
    this.curriculumPath = path.join(process.cwd(), 'curriculum');
    this.loadCurriculum();
  }

  static getInstance(): CurriculumPromptManager {
    if (!CurriculumPromptManager.instance) {
      CurriculumPromptManager.instance = new CurriculumPromptManager();
    }
    return CurriculumPromptManager.instance;
  }

  private loadCurriculum(): void {
    try {
      const mathsPath = path.join(this.curriculumPath, 'maths.json');
      const englishPath = path.join(this.curriculumPath, 'english.json');

      this.mathsCurriculum = this.loadFile(mathsPath);
      this.englishCurriculum = this.loadFile(englishPath);
    } catch (error) {
      console.error('Failed to load curriculum:', error);
    }
  }

  getPrompt(
    subject: Subject,
    topic: MathsTopic | EnglishTopic,
    yearGroup: number,
    term: number
  ): ValidationResult & { prompt?: string } {
    try {
      const curriculum = subject === 'maths' ? 
        this.mathsCurriculum : 
        this.englishCurriculum;

      if (!curriculum) {
        return {
          isValid: false,
          errors: [`${subject} curriculum not loaded`],
          warnings: []
        };
      }

      const topicData = curriculum.topics[topic];
      if (!topicData) {
        return {
          isValid: false,
          errors: [`Topic ${topic} not found`],
          warnings: []
        };
      }

      const yearData = topicData.yearGroups[yearGroup];
      if (!yearData) {
        return {
          isValid: false,
          errors: [`Year ${yearGroup} not found for topic ${topic}`],
          warnings: []
        };
      }

      const termData = yearData.terms[term];
      if (!termData) {
        return {
          isValid: false,
          errors: [`Term ${term} not found for year ${yearGroup}`],
          warnings: []
        };
      }

      const prompt = this.constructPrompt(subject, topic, termData);

      return {
        isValid: true,
        errors: [],
        warnings: [],
        prompt
      };

    } catch (error) {
      return {
        isValid: false,
        errors: [`Failed to get prompt: ${error.message}`],
        warnings: []
      };
    }
  }

  private loadFile(filePath: string): CurriculumData {
    const content = readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  }

  private constructPrompt(
    subject: Subject,
    topic: MathsTopic | EnglishTopic,
    termData: {
      objectives: string[];
      keywords: string[];
      expectedOutcomes: string[];
    }
  ): string {
    return `
      Subject: ${subject}
      Topic: ${topic}
      Learning Objectives: ${termData.objectives.join(', ')}
      Key Vocabulary: ${termData.keywords.join(', ')}
      Expected Outcomes: ${termData.expectedOutcomes.join(', ')}
    `.trim();
  }
}

export const useCurriculumPrompts = () => {
  const manager = CurriculumPromptManager.getInstance();
  return {
    getPrompt: manager.getPrompt.bind(manager)
  };
}; 