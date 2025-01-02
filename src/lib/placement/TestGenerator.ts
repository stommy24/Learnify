import { PrismaClient } from '@prisma/client';
import { QuestionType, PlacementQuestion, DifficultyLevel } from '@/types/placement';
import { DifficultyManager } from './DifficultyManager';
import { CurriculumManager } from '@/lib/curriculum/CurriculumManager';
import { logger } from '@/lib/monitoring';

export class TestGenerator {
  private prisma: PrismaClient;
  private difficultyManager: DifficultyManager;
  private curriculumManager: CurriculumManager;

  constructor(
    prisma: PrismaClient = new PrismaClient(),
    difficultyManager = new DifficultyManager(),
    curriculumManager = new CurriculumManager()
  ) {
    this.prisma = prisma;
    this.difficultyManager = difficultyManager;
    this.curriculumManager = curriculumManager;
  }

  async generateDailyTest(studentId: string): Promise<void> {
    try {
      // Get student's current level and progress
      const studentProgress = await this.prisma.$queryRaw<{
        currentLevel: number;
        masteredConcepts: string[];
        recentPerformance: {
          accuracy: number;
          speed: number;
          consistency: number;
        };
      }>`
        SELECT 
          sp."currentLevel",
          sp."masteredConcepts",
          sp."recentPerformance"
        FROM "StudentProgress" sp
        WHERE sp."studentId" = ${studentId}
        LIMIT 1
      `;

      if (!studentProgress) {
        throw new Error('Student progress not found');
      }

      // Get curriculum concepts for current level
      const currentConcepts = await this.curriculumManager.getConceptsForLevel(
        studentProgress.currentLevel
      );

      // Calculate appropriate difficulty based on recent performance
      const targetDifficulty = this.difficultyManager.calculateTargetDifficulty({
        currentLevel: studentProgress.currentLevel,
        accuracy: studentProgress.recentPerformance.accuracy,
        speed: studentProgress.recentPerformance.speed,
        consistency: studentProgress.recentPerformance.consistency
      });

      // Generate test structure
      const testStructure = {
        // Core concepts from current level (60%)
        coreConcepts: this.selectConcepts(currentConcepts, 0.6),
        
        // Review concepts from previous level (30%)
        reviewConcepts: this.selectConcepts(
          await this.curriculumManager.getConceptsForLevel(studentProgress.currentLevel - 1),
          0.3
        ),
        
        // Preview concepts from next level (10%)
        previewConcepts: this.selectConcepts(
          await this.curriculumManager.getConceptsForLevel(studentProgress.currentLevel + 1),
          0.1
        )
      };

      // Create the test
      const test = await this.prisma.$queryRaw`
        INSERT INTO "PlacementTest" (
          "studentId",
          "type",
          "status",
          "level",
          "targetDifficulty",
          "conceptDistribution"
        )
        VALUES (
          ${studentId},
          'DAILY',
          'PENDING',
          ${studentProgress.currentLevel},
          ${targetDifficulty},
          ${JSON.stringify(testStructure)}
        )
        RETURNING id
      `;

      // Generate questions based on test structure
      await this.generateQuestions(test.id, testStructure, targetDifficulty);

      logger.info('Daily test generated successfully', {
        studentId,
        level: studentProgress.currentLevel,
        difficulty: targetDifficulty,
        concepts: testStructure
      });
    } catch (error) {
      logger.error('Failed to generate daily test', {
        studentId,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }

  private selectConcepts(concepts: string[], proportion: number): string[] {
    const count = Math.ceil(concepts.length * proportion);
    return concepts
      .sort(() => Math.random() - 0.5)
      .slice(0, count);
  }

  private async generateQuestions(
    testId: string,
    structure: any,
    targetDifficulty: number
  ): Promise<void> {
    const questions = [];

    // Generate questions for each concept type
    for (const [conceptType, concepts] of Object.entries(structure)) {
      for (const concept of concepts as string[]) {
        const questionTemplate = await this.curriculumManager.getQuestionTemplate(concept);
        
        // Apply difficulty adjustments
        const adjustedQuestion = this.difficultyManager.adjustQuestionDifficulty(
          questionTemplate,
          targetDifficulty
        );

        questions.push({
          testId,
          concept,
          type: adjustedQuestion.type,
          content: adjustedQuestion.content,
          difficulty: targetDifficulty,
          conceptType
        });
      }
    }

    // Batch insert questions
    await this.prisma.$queryRaw`
      INSERT INTO "PlacementQuestion" (
        "testId",
        "concept",
        "type",
        "content",
        "difficulty",
        "conceptType"
      )
      SELECT * FROM ${JSON.stringify(questions)}
    `;
  }
}