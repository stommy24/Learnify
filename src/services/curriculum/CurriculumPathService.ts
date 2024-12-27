import { prisma } from '@/lib/prisma';
import { ProgressionService } from '../progression/ProgressionService';
import type { LearningProgress } from '@/types/progress';
import type { CurriculumStandard, CurriculumTopic, SubjectArea, KeyStage } from '@/types/curriculum';

export class CurriculumPathService {
  private progressionService: ProgressionService;

  constructor() {
    this.progressionService = new ProgressionService();
  }

  async getCurrentPath(userId: string): Promise<{
    subject: SubjectArea;
    keyStage: KeyStage;
    currentTopic: CurriculumTopic;
    progress: number;
  }> {
    const path = await prisma.curriculumPath.findUnique({
      where: { userId },
      include: {
        currentTopic: true
      }
    });

    const progress = await this.getCurrentProgress(userId, path.currentTopic.id);

    return {
      subject: path.subject,
      keyStage: path.keyStage,
      currentTopic: path.currentTopic,
      progress: this.calculateTopicProgress(progress)
    };
  }

  async getNextTopic(
    userId: string,
    currentTopicId: string,
    curriculum: CurriculumStandard
  ): Promise<CurriculumTopic | null> {
    const currentTopic = curriculum.topics.find(t => t.id === currentTopicId);
    const progress = await this.getCurrentProgress(userId, currentTopicId);

    const eligibleTopics = curriculum.topics.filter(topic => 
      topic.prerequisites.includes(currentTopicId) &&
      topic.prerequisites.every(preReqId => 
        progress.objectiveIds.includes(preReqId)
      )
    );

    return eligibleTopics.sort((a, b) => a.difficulty - b.difficulty)[0] || null;
  }

  private calculateTopicProgress(progress: LearningProgress): number {
    const totalObjectives = Object.keys(progress.masteryLevel).length;
    const masteredObjectives = Object.values(progress.masteryLevel)
      .filter(level => level >= 85)
      .length;

    return Math.round((masteredObjectives / totalObjectives) * 100);
  }

  private createEmptyProgress(userId: string): LearningProgress {
    return {
      id: userId,
      userId,
      timestamp: new Date(),
      results: [],
      adaptations: [],
      assessmentHistory: [],
      objectiveIds: [],
      masteryLevel: {}
    };
  }

  async getCurrentProgress(userId: string, topicId: string): Promise<LearningProgress> {
    return this.createEmptyProgress(userId);
  }

  getProgress(userId: string): LearningProgress {
    return this.createEmptyProgress(userId);
  }
} 