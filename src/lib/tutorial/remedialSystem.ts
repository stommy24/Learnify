import { prisma } from '@/lib/prisma';
import { 
  RemedialContent, 
  WeakPoint, 
  PrerequisiteNode,
  Example,
  Exercise,
  Resource 
} from '@/types/remedial';
import { CustomError } from '@/lib/errors';

export class RemedialSystem {
  async generateRemedialPlan(
    studentId: string,
    assessmentResults: {
      answers: Array<{
        questionId: string;
        isCorrect: boolean;
        timeSpent: number;
        attempts: number;
      }>;
      overallScore: number;
      completionTime: number;
    }
  ): Promise<RemedialContent[]> {
    try {
      const weakPoints = await this.analyzeWeakPoints(studentId, assessmentResults);
      const prerequisites = await this.identifyPrerequisites(weakPoints);
      return this.createCustomizedContent(studentId, weakPoints, prerequisites);
    } catch (error) {
      throw new CustomError(
        'REMEDIAL_PLAN_ERROR',
        'Failed to generate remedial plan',
        { cause: error }
      );
    }
  }

  private async analyzeWeakPoints(
    studentId: string,
    results: any
  ): Promise<WeakPoint[]> {
    try {
      // Get questions details for analysis
      const questions = await prisma.question.findMany({
        where: {
          id: {
            in: results.answers.map(a => a.questionId)
          }
        },
        include: {
          topics: true,
          concepts: true
        }
      });

      // Analyze incorrect answers
      const weakPoints: WeakPoint[] = [];
      const incorrectAnswers = results.answers.filter(a => !a.isCorrect);

      for (const answer of incorrectAnswers) {
        const question = questions.find(q => q.id === answer.questionId);
        if (!question) continue;

        // Group by topics and analyze patterns
        question.topics.forEach(topic => {
          const existingWeakPoint = weakPoints.find(wp => wp.topic === topic.name);
          if (existingWeakPoint) {
            existingWeakPoint.mistakePatterns.push(...this.analyzeMistakePatterns(answer));
          } else {
            weakPoints.push({
              topic: topic.name,
              conceptGaps: question.concepts.map(c => c.name),
              mistakePatterns: this.analyzeMistakePatterns(answer),
              confidenceLevel: this.calculateConfidenceLevel(answer)
            });
          }
        });
      }

      return weakPoints;
    } catch (error) {
      throw new CustomError('ANALYSIS_ERROR', 'Failed to analyze weak points');
    }
  }

  private async identifyPrerequisites(
    weakPoints: WeakPoint[]
  ): Promise<PrerequisiteNode[]> {
    try {
      // Get prerequisite tree for weak topics
      const prerequisites = await prisma.prerequisite.findMany({
        where: {
          topic: {
            in: weakPoints.map(wp => wp.topic)
          }
        },
        include: {
          dependencies: true
        }
      });

      // Build prerequisite nodes
      return prerequisites.map(prereq => ({
        id: prereq.id,
        topic: prereq.topic,
        requiredMastery: prereq.requiredMastery,
        dependencies: prereq.dependencies.map(d => d.topic)
      }));
    } catch (error) {
      throw new CustomError('PREREQUISITE_ERROR', 'Failed to identify prerequisites');
    }
  }

  private async createCustomizedContent(
    studentId: string,
    weakPoints: WeakPoint[],
    prerequisites: PrerequisiteNode[]
  ): Promise<RemedialContent[]> {
    try {
      const remedialContent: RemedialContent[] = [];
      const studentLevel = await this.getStudentLevel(studentId);

      // Create content for prerequisites first
      for (const prereq of prerequisites) {
        const content = await this.generateContent(
          prereq.topic,
          'basic',
          studentLevel
        );
        remedialContent.push(content);
      }

      // Create content for weak points
      for (const weakPoint of weakPoints) {
        const content = await this.generateContent(
          weakPoint.topic,
          this.determineDifficulty(weakPoint),
          studentLevel
        );
        remedialContent.push(content);
      }

      // Sort by difficulty and prerequisites
      return this.sortRemedialContent(remedialContent);
    } catch (error) {
      throw new CustomError('CONTENT_GENERATION_ERROR', 'Failed to create customized content');
    }
  }

  private analyzeMistakePatterns(answer: any): string[] {
    const patterns: string[] = [];
    
    // Time-based patterns
    if (answer.timeSpent > answer.expectedTime * 1.5) {
      patterns.push('TIME_MANAGEMENT');
    }

    // Attempt-based patterns
    if (answer.attempts > 2) {
      patterns.push('MULTIPLE_ATTEMPTS');
    }

    // Answer pattern analysis
    if (answer.submittedAnswer) {
      if (this.isNumericallyClose(answer.submittedAnswer, answer.correctAnswer)) {
        patterns.push('CALCULATION_ERROR');
      }
      if (this.hasConceptualMisunderstanding(answer.submittedAnswer, answer.correctAnswer)) {
        patterns.push('CONCEPTUAL_ERROR');
      }
      if (this.isCommonMistake(answer.submittedAnswer, answer.questionType)) {
        patterns.push('COMMON_MISTAKE');
      }
    }

    return patterns;
  }

  private calculateConfidenceLevel(answer: any): number {
    return Math.max(0, 1 - (answer.attempts * 0.2));
  }

  private async getStudentLevel(studentId: string): Promise<string> {
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      select: { currentLevel: true }
    });
    return student?.currentLevel || 'beginner';
  }

  private determineDifficulty(
    weakPoint: WeakPoint
  ): 'basic' | 'intermediate' | 'advanced' {
    if (weakPoint.confidenceLevel < 0.3) return 'basic';
    if (weakPoint.confidenceLevel < 0.7) return 'intermediate';
    return 'advanced';
  }

  private async generateContent(
    topic: string,
    difficulty: 'basic' | 'intermediate' | 'advanced',
    studentLevel: string
  ): Promise<RemedialContent> {
    try {
      // Fetch topic content from database
      const topicContent = await prisma.topic.findUnique({
        where: { name: topic },
        include: {
          exercises: {
            where: { difficulty: this.difficultyToNumber(difficulty) }
          },
          concepts: true,
          mistakes: true
        }
      });

      if (!topicContent) {
        throw new CustomError('CONTENT_NOT_FOUND', `No content found for topic: ${topic}`);
      }

      // Generate examples based on difficulty
      const examples = await this.generateExamples(topic, difficulty);
      
      // Generate exercises
      const exercises = await this.generateExercises(topicContent.exercises, difficulty);
      
      // Fetch relevant resources
      const resources = await this.fetchResources(topic, studentLevel);

      return {
        id: `${topic}-${difficulty}-${Date.now()}`,
        type: this.determineContentType(difficulty),
        difficulty,
        content: {
          explanation: await this.generateExplanation(topic, difficulty),
          examples,
          exercises,
          resources
        },
        prerequisites: await this.getTopicPrerequisites(topic),
        estimatedTime: this.calculateEstimatedTime(exercises.length, difficulty),
        order: this.calculateContentOrder(topic, difficulty)
      };
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw new CustomError('CONTENT_GENERATION_ERROR', 'Failed to generate content');
    }
  }

  private async generateExamples(
    topic: string,
    difficulty: 'basic' | 'intermediate' | 'advanced'
  ): Promise<Example[]> {
    try {
      const examples = await prisma.example.findMany({
        where: {
          topic,
          difficulty: this.difficultyToNumber(difficulty)
        },
        include: {
          animation: true
        }
      });

      return examples.map(example => ({
        id: example.id,
        content: example.content,
        steps: example.steps,
        animation: example.animation?.steps
      }));
    } catch (error) {
      throw new CustomError('EXAMPLE_GENERATION_ERROR', 'Failed to generate examples');
    }
  }

  private async generateExercises(
    baseExercises: any[],
    difficulty: 'basic' | 'intermediate' | 'advanced'
  ): Promise<Exercise[]> {
    try {
      return baseExercises.map(exercise => ({
        id: exercise.id,
        question: exercise.content.question,
        type: exercise.type as 'practice' | 'reinforcement',
        difficulty: exercise.difficulty,
        solution: {
          answer: exercise.content.answer,
          explanation: exercise.content.explanation,
          steps: exercise.content.steps
        }
      }));
    } catch (error) {
      throw new CustomError('EXERCISE_GENERATION_ERROR', 'Failed to generate exercises');
    }
  }

  private async fetchResources(
    topic: string,
    studentLevel: string
  ): Promise<Resource[]> {
    try {
      return await prisma.resource.findMany({
        where: {
          topic,
          minLevel: {
            lte: studentLevel
          }
        },
        select: {
          id: true,
          type: true,
          url: true,
          title: true,
          description: true
        }
      });
    } catch (error) {
      throw new CustomError('RESOURCE_FETCH_ERROR', 'Failed to fetch resources');
    }
  }

  private async generateExplanation(
    topic: string,
    difficulty: 'basic' | 'intermediate' | 'advanced'
  ): Promise<string> {
    try {
      const explanation = await prisma.explanation.findFirst({
        where: {
          topic,
          difficulty: this.difficultyToNumber(difficulty)
        }
      });

      return explanation?.content || 
        `Default explanation for ${topic} at ${difficulty} level`;
    } catch (error) {
      throw new CustomError('EXPLANATION_GENERATION_ERROR', 'Failed to generate explanation');
    }
  }

  private difficultyToNumber(
    difficulty: 'basic' | 'intermediate' | 'advanced'
  ): number {
    const difficultyMap = {
      basic: 1,
      intermediate: 2,
      advanced: 3
    };
    return difficultyMap[difficulty];
  }

  private determineContentType(
    difficulty: 'basic' | 'intermediate' | 'advanced'
  ): 'concept' | 'practice' | 'review' {
    if (difficulty === 'basic') return 'concept';
    if (difficulty === 'intermediate') return 'practice';
    return 'review';
  }

  private calculateEstimatedTime(
    exerciseCount: number,
    difficulty: 'basic' | 'intermediate' | 'advanced'
  ): number {
    const baseTime = 15; // minutes
    const difficultyMultiplier = {
      basic: 1,
      intermediate: 1.5,
      advanced: 2
    };
    return Math.ceil(baseTime * exerciseCount * difficultyMultiplier[difficulty]);
  }

  private calculateContentOrder(
    topic: string,
    difficulty: 'basic' | 'intermediate' | 'advanced'
  ): number {
    const difficultyOrder = {
      basic: 0,
      intermediate: 100,
      advanced: 200
    };
    return difficultyOrder[difficulty] + topic.charCodeAt(0);
  }

  private isNumericallyClose(submitted: any, correct: any): boolean {
    if (typeof submitted !== 'number' || typeof correct !== 'number') {
      return false;
    }
    return Math.abs(submitted - correct) < 0.1;
  }

  private hasConceptualMisunderstanding(submitted: any, correct: any): boolean {
    // Implementation for conceptual error detection
    return false;
  }

  private isCommonMistake(submitted: any, questionType: string): boolean {
    // Implementation for common mistake detection
    return false;
  }

  private sortRemedialContent(
    content: RemedialContent[]
  ): RemedialContent[] {
    return content.sort((a, b) => a.order - b.order);
  }
} 