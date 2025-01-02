interface TopicProgress {
  topicId: string;
  masteryLevel: number; // 0-100
  attempts: number;
  completedObjectives: string[];
  averageAccuracy: number;
  averageSpeed: number;
  lastAttemptDate: Date;
  nextReviewDate: Date;
}

interface StudentProgress {
  studentId: string;
  currentKumonLevel: string;
  topicsProgress: Map<string, TopicProgress>;
  strengths: string[];
  areasForImprovement: string[];
  recommendedTopics: string[];
}

export class ProgressTrackingService {
  async updateProgress(
    studentId: string, 
    topicId: string, 
    assessmentResult: AssessmentResult
  ): Promise<void> {
    const progress = await this.getStudentProgress(studentId);
    const topicProgress = this.calculateTopicProgress(assessmentResult);
    
    // Update mastery level
    if (topicProgress.masteryLevel >= 90) {
      await this.unlockNextLevel(studentId, topicId);
    }

    // Schedule next review based on mastery level
    const nextReview = this.calculateNextReview(topicProgress);
    
    await this.saveProgress(studentId, topicId, {
      ...topicProgress,
      nextReviewDate: nextReview
    });
  }

  private calculateNextReview(progress: TopicProgress): Date {
    // Kumon-style spacing:
    // < 60% mastery: next day
    // 60-80% mastery: 3 days
    // 80-90% mastery: 1 week
    // >= 90% mastery: 2 weeks
    const today = new Date();
    if (progress.masteryLevel < 60) return addDays(today, 1);
    if (progress.masteryLevel < 80) return addDays(today, 3);
    if (progress.masteryLevel < 90) return addDays(today, 7);
    return addDays(today, 14);
  }
} 