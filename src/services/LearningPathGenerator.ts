import { prisma } from '@/lib/db';
import { logger } from '@/lib/monitoring';

interface LearningPath {
  recommendedLevel: number;
  concepts: {
    id: string;
    name: string;
    priority: number;
    estimatedTime: number;
    prerequisites: string[];
  }[];
  milestones: {
    level: number;
    concepts: string[];
    assessment: string;
  }[];
  estimatedCompletion: number; // in days
}

export class LearningPathGenerator {
  async generatePath(params: {
    userId: string;
    assessmentResults: any;
    currentLevel: number;
  }): Promise<LearningPath> {
    try {
      const {
        conceptSequence,
        recommendedLevel
      } = await this.planConceptSequence(params);

      const milestones = this.createMilestones(
        conceptSequence,
        recommendedLevel
      );

      const estimatedCompletion = this.calculateEstimatedCompletion(
        conceptSequence,
        params.assessmentResults
      );

      await this.saveLearningPath(params.userId, {
        recommendedLevel,
        concepts: conceptSequence,
        milestones,
        estimatedCompletion
      });

      return {
        recommendedLevel,
        concepts: conceptSequence,
        milestones,
        estimatedCompletion
      };
    } catch (error) {
      logger.error('Failed to generate learning path', {
        userId: params.userId,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }

  private async planConceptSequence(params: {
    assessmentResults: any;
    currentLevel: number;
  }) {
    const weakConcepts = params.assessmentResults.weaknessAreas;
    const strongConcepts = params.assessmentResults.strengthAreas;
    
    // Get all relevant concepts
    const concepts = await prisma.concept.findMany({
      where: {
        OR: [
          { id: { in: weakConcepts } },
          { 
            level: {
              gte: params.currentLevel,
              lte: params.currentLevel + 2
            }
          }
        ]
      },
      include: {
        prerequisites: true
      }
    });

    // Sort concepts by priority and prerequisites
    const sortedConcepts = this.topologicalSort(concepts);
    
    // Calculate recommended level
    const recommendedLevel = this.calculateRecommendedLevel(
      params.assessmentResults,
      params.currentLevel
    );

    // Assign priorities and estimated times
    const conceptSequence = sortedConcepts.map(concept => ({
      id: concept.id,
      name: concept.name,
      priority: this.calculatePriority(
        concept,
        weakConcepts,
        strongConcepts
      ),
      estimatedTime: this.calculateEstimatedTime(
        concept,
        params.assessmentResults
      ),
      prerequisites: concept.prerequisites.map(p => p.id)
    }));

    return { conceptSequence, recommendedLevel };
  }

  private topologicalSort(concepts: any[]): any[] {
    const visited = new Set();
    const temp = new Set();
    const order: any[] = [];

    const visit = (concept: any) => {
      if (temp.has(concept.id)) {
        throw new Error('Cyclic prerequisite dependency detected');
      }
      if (visited.has(concept.id)) return;

      temp.add(concept.id);

      for (const prerequisite of concept.prerequisites) {
        const prereqConcept = concepts.find(c => c.id === prerequisite.id);
        if (prereqConcept) {
          visit(prereqConcept);
        }
      }

      temp.delete(concept.id);
      visited.add(concept.id);
      order.unshift(concept);
    };

    concepts.forEach(concept => {
      if (!visited.has(concept.id)) {
        visit(concept);
      }
    });

    return order;
  }

  private calculatePriority(
    concept: any,
    weakConcepts: string[],
    strongConcepts: string[]
  ): number {
    let priority = concept.baseImportance || 1;

    if (weakConcepts.includes(concept.id)) {
      priority *= 1.5;
    }
    if (strongConcepts.includes(concept.id)) {
      priority *= 0.8;
    }

    return priority;
  }

  private calculateEstimatedTime(
    concept: any,
    assessmentResults: any
  ): number {
    const baseTime = concept.estimatedTime || 30; // minutes
    const masteryLevel = assessmentResults.conceptMastery[concept.id] || 0;
    
    return Math.round(baseTime * (1 + (1 - masteryLevel)));
  }

  private calculateRecommendedLevel(
    assessmentResults: any,
    currentLevel: number
  ): number {
    const score = assessmentResults.score;
    
    if (score >= 0.9) return currentLevel + 1;
    if (score <= 0.3) return Math.max(1, currentLevel - 1);
    return currentLevel;
  }

  private createMilestones(
    concepts: any[],
    recommendedLevel: number
  ) {
    const milestones = [];
    let currentConcepts: string[] = [];
    let currentLevel = recommendedLevel;

    concepts.forEach((concept, index) => {
      currentConcepts.push(concept.id);

      if (
        currentConcepts.length >= 5 ||
        index === concepts.length - 1
      ) {
        milestones.push({
          level: currentLevel,
          concepts: [...currentConcepts],
          assessment: `milestone-${milestones.length + 1}`
        });
        currentConcepts = [];
        if (milestones.length % 3 === 0) currentLevel++;
      }
    });

    return milestones;
  }

  private calculateEstimatedCompletion(
    concepts: any[],
    assessmentResults: any
  ): number {
    const totalMinutes = concepts.reduce(
      (sum, concept) => sum + concept.estimatedTime,
      0
    );
    
    const minutesPerDay = 30; // Assumed average study time
    return Math.ceil(totalMinutes / minutesPerDay);
  }

  private async saveLearningPath(
    userId: string,
    path: LearningPath
  ): Promise<void> {
    await prisma.learningPath.create({
      data: {
        userId,
        recommendedLevel: path.recommendedLevel,
        concepts: path.concepts,
        milestones: path.milestones,
        estimatedCompletion: path.estimatedCompletion,
        createdAt: new Date()
      }
    });
  }
} 