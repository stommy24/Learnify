import { Topic } from '@/types/curriculum';
import { 
  CurriculumService, 
  ProgressTrackingService, 
  DifficultyProgressionService,
  AssessmentEngine,
  Lesson
} from '@/types/services';

export class LearningService {
  constructor(
    private curriculumService: CurriculumService,
    private progressService: ProgressTrackingService,
    private difficultyService: DifficultyProgressionService,
    private assessmentEngine: AssessmentEngine
  ) {}

  async generatePersonalizedLesson(userId: string, topicId: string): Promise<Lesson> {
    const topic = this.curriculumService.getTopicById(topicId);
    if (!topic) throw new Error('Topic not found');

    const prerequisiteReview = await this.getPrerequisiteReview(userId, topicId);
    const currentProgress = this.progressService.getProgress(userId, topicId);
    const duration = this.calculateDuration(topic, currentProgress);

    // Generate lesson content based on topic, progress, and prerequisites
    return {
      id: `lesson-${topicId}-${Date.now()}`,
      topicId,
      title: `${topic.name} - Lesson ${Math.floor(currentProgress * 100)}%`,
      content: prerequisiteReview ? `Review: ${prerequisiteReview}\n\n${topic.objectives.join('\n')}` : topic.objectives.join('\n'),
      duration,
      difficulty: topic.difficulty
    };
  }

  private async getPrerequisiteReview(userId: string, topicId: string): Promise<string | null> {
    const prerequisites = this.curriculumService.getPrerequisites(topicId);
    const incompletePrereqs = prerequisites.filter(prereq => 
      this.progressService.getProgress(userId, prereq.id) < 0.8
    );

    return incompletePrereqs.length > 0 
      ? `You may want to review: ${incompletePrereqs.map(p => p.name).join(', ')}`
      : null;
  }

  private calculateDuration(topic: Topic, progress: number): number {
    const baseDuration = 30; // 30 minutes base duration
    const progressFactor = 1 - (progress * 0.5); // Reduce duration as progress increases
    const difficultyFactor = 1 + (topic.difficulty * 0.1); // Increase duration for harder topics
    
    return Math.round(baseDuration * progressFactor * difficultyFactor);
  }
} 