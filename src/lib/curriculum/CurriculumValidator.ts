import { readFileSync } from 'fs';
import path from 'path';
import { 
  Subject, 
  MathsTopic, 
  EnglishTopic,
  ValidationResult 
} from '../types';

interface CurriculumContent {
  version: string;
  lastUpdated: string;
  subject: Subject;
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

export class CurriculumValidator {
  private static instance: CurriculumValidator;
  private mathsCurriculum: CurriculumContent | null = null;
  private englishCurriculum: CurriculumContent | null = null;
  private readonly curriculumPath: string;

  private constructor() {
    this.curriculumPath = path.join(process.cwd(), 'src', 'lib', 'curriculum', 'data');
    this.loadCurriculum();
  }

  static getInstance(): CurriculumValidator {
    if (!CurriculumValidator.instance) {
      CurriculumValidator.instance = new CurriculumValidator();
    }
    return CurriculumValidator.instance;
  }

  private loadCurriculum(): void {
    try {
      const mathsPath = path.join(this.curriculumPath, 'maths.json');
      const englishPath = path.join(this.curriculumPath, 'english.json');

      this.mathsCurriculum = JSON.parse(readFileSync(mathsPath, 'utf-8'));
      this.englishCurriculum = JSON.parse(readFileSync(englishPath, 'utf-8'));
    } catch (error) {
      console.error('Failed to load curriculum:', error);
    }
  }

  validateAlignment(
    subject: Subject,
    topic: MathsTopic | EnglishTopic,
    yearGroup: number,
    term: number,
    content: string
  ): ValidationResult {
    try {
      const curriculum = subject === 'maths' ? this.mathsCurriculum : this.englishCurriculum;
      
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
          errors: [`Topic ${topic} not found in curriculum`],
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

      return this.validateContent(content, termData);
    } catch (error) {
      return {
        isValid: false,
        errors: [`Curriculum validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`],
        warnings: []
      };
    }
  }

  private validateContent(
    content: string, 
    termData: { 
      objectives: string[]; 
      keywords: string[]; 
      expectedOutcomes: string[]; 
    }
  ): ValidationResult {
    const warnings: string[] = [];
    const keywordCount = this.countKeywords(content, termData.keywords);
    
    if (keywordCount === 0) {
      warnings.push('Content does not contain any curriculum keywords');
    } else if (keywordCount < 2) {
      warnings.push('Content contains very few curriculum keywords');
    }

    const objectiveAlignment = this.checkObjectiveAlignment(content, termData.objectives);
    if (objectiveAlignment < 0.5) {
      warnings.push('Content may not align well with learning objectives');
    }

    return {
      isValid: true,
      errors: [],
      warnings
    };
  }

  private countKeywords(content: string, keywords: string[]): number {
    const normalizedContent = content.toLowerCase();
    return keywords.reduce((count, keyword) => 
      count + (normalizedContent.includes(keyword.toLowerCase()) ? 1 : 0), 0
    );
  }

  private checkObjectiveAlignment(content: string, objectives: string[]): number {
    const normalizedContent = content.toLowerCase();
    const matchingObjectives = objectives.filter(objective => 
      objective.toLowerCase().split(' ').some(word => 
        normalizedContent.includes(word)
      )
    );
    return matchingObjectives.length / objectives.length;
  }
}

export const useCurriculumValidator = () => {
  const validator = CurriculumValidator.getInstance();
  return {
    validateAlignment: validator.validateAlignment.bind(validator)
  };
}; 