import { OpenAI } from 'openai';
import { prisma } from '@/lib/db';
import { Assessment, AssessmentQuestion, QuestionFormat } from '@/types/assessment';
import { QuestionGenerationService } from './QuestionGenerationService';
import { logger } from '@/lib/monitoring';

interface ConceptDifficulty {
  conceptId: string;
  difficulty: number;
  weight: number;
}

export class AdaptiveAssessmentGenerator {
  private openai: OpenAI;
  private questionService: QuestionGenerationService;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    this.questionService = new QuestionGenerationService();
  }

  async generateAssessment(params: {
    type: 'PLACEMENT' | 'LEVEL_END';
    level: number;
    masteredConcepts: string[];
    userId: string;
  }): Promise<Assessment> {
    try {
      const conceptMap = await this.selectConcepts(params);
      const questions = await this.generateQuestions(conceptMap, params.level);
      
      return {
        id: `assessment-${Date.now()}`,
        type: params.type,
        title: this.generateTitle(params.type, params.level),
        description: this.generateDescription(params.type, params.level),
        questions,
        adaptiveLevel: true,
        requiredScore: this.calculateRequiredScore(params.type, params.level),
        metadata: {
          targetAge: this.calculateTargetAge(params.level),
          difficulty: params.level,
          subject: 'mathematics',
          topics: conceptMap.map(c => c.conceptId)
        }
      };
    } catch (error) {
      logger.error('Failed to generate adaptive assessment', {
        params,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }

  private async selectConcepts(params: {
    type: string;
    level: number;
    masteredConcepts: string[];
  }): Promise<ConceptDifficulty[]> {
    const concepts = await prisma.concept.findMany({
      where: {
        level: {
          lte: params.level + 1,
          gte: params.level - 1
        },
        NOT: {
          id: {
            in: params.masteredConcepts
          }
        }
      }
    });

    return concepts.map(concept => ({
      conceptId: concept.id,
      difficulty: this.calculateConceptDifficulty(concept, params.level),
      weight: this.calculateConceptWeight(concept, params.type)
    }));
  }

  private async generateQuestions(
    concepts: ConceptDifficulty[],
    level: number
  ): Promise<AssessmentQuestion[]> {
    const questions: AssessmentQuestion[] = [];
    
    for (const concept of concepts) {
      const questionCount = this.calculateQuestionCount(concept.weight);
      
      for (let i = 0; i < questionCount; i++) {
        const format = this.selectQuestionFormat(concept, level);
        const question = await this.questionService.getQuestion({
          topicId: concept.conceptId,
          difficulty: concept.difficulty,
          format
        });
        
        questions.push(this.adaptQuestionForAssessment(question, concept));
      }
    }

    return this.orderQuestions(questions);
  }

  private calculateConceptDifficulty(concept: any, targetLevel: number): number {
    const baseDifficulty = concept.level / targetLevel;
    const complexityFactor = concept.complexity || 1;
    return Math.min(1, baseDifficulty * complexityFactor);
  }

  private calculateConceptWeight(concept: any, assessmentType: string): number {
    if (assessmentType === 'PLACEMENT') {
      return concept.importance || 1;
    }
    return concept.mastery_requirement || 1;
  }

  private selectQuestionFormat(
    concept: ConceptDifficulty,
    level: number
  ): QuestionFormat {
    const formats: QuestionFormat[] = [
      'MULTIPLE_CHOICE',
      'DRAG_DROP',
      'TEXT_INPUT',
      'DRAWING',
      'EQUATION_BUILDER'
    ];

    // Select format based on concept type and difficulty
    if (concept.difficulty > 0.8) {
      return 'EQUATION_BUILDER';
    } else if (concept.difficulty > 0.6) {
      return 'TEXT_INPUT';
    }
    return 'MULTIPLE_CHOICE';
  }

  private adaptQuestionForAssessment(
    question: any,
    concept: ConceptDifficulty
  ): AssessmentQuestion {
    return {
      ...question,
      points: this.calculatePoints(concept.difficulty, concept.weight),
      timeEstimate: this.calculateTimeEstimate(question.type, concept.difficulty),
      hints: this.generateHints(question, concept.difficulty)
    };
  }

  private orderQuestions(questions: AssessmentQuestion[]): AssessmentQuestion[] {
    return questions.sort((a, b) => {
      // Sort by difficulty, then by type
      if (a.difficulty !== b.difficulty) {
        return a.difficulty - b.difficulty;
      }
      return this.getTypeWeight(a.format) - this.getTypeWeight(b.format);
    });
  }

  private getTypeWeight(format: QuestionFormat): number {
    const weights: Record<QuestionFormat, number> = {
      'MULTIPLE_CHOICE': 1,
      'DRAG_DROP': 2,
      'TEXT_INPUT': 3,
      'DRAWING': 4,
      'EQUATION_BUILDER': 5
    };
    return weights[format];
  }

  private calculatePoints(difficulty: number, weight: number): number {
    return Math.round((difficulty * 10) * weight);
  }

  private calculateTimeEstimate(type: string, difficulty: number): number {
    const baseTime = {
      'MULTIPLE_CHOICE': 30,
      'DRAG_DROP': 45,
      'TEXT_INPUT': 60,
      'DRAWING': 90,
      'EQUATION_BUILDER': 120
    }[type] || 60;

    return Math.round(baseTime * (1 + difficulty));
  }

  private generateHints(question: any, difficulty: number): string[] {
    // Generate progressive hints based on difficulty
    const hintCount = Math.floor(3 * (1 - difficulty));
    return Array(hintCount).fill('').map((_, i) => 
      `Hint ${i + 1}: ${this.generateHintContent(question, i)}`
    );
  }

  private generateHintContent(question: any, hintLevel: number): string {
    // Implementation of hint generation
    return '';
  }

  private generateTitle(type: string, level: number): string {
    return type === 'PLACEMENT' 
      ? 'Mathematics Placement Assessment'
      : `Level ${level} Mathematics Assessment`;
  }

  private generateDescription(type: string, level: number): string {
    return type === 'PLACEMENT'
      ? 'This assessment will help us understand your current mathematics knowledge and create a personalized learning path.'
      : `Show what you've learned in Level ${level}. Complete this assessment to advance to the next level.`;
  }

  private calculateRequiredScore(type: string, level: number): number {
    return type === 'PLACEMENT' ? 0 : 0.75;
  }

  private calculateTargetAge(level: number): number {
    return Math.max(7, Math.min(12, 6 + level));
  }
} 