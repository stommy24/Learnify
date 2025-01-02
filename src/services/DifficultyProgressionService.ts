interface KumonLevel {
  level: string; // A, B, C, etc.
  subLevel: number; // 1-6
  description: string;
  requiredMastery: number;
  speedTarget: number; // questions per minute
}

export class DifficultyProgressionService {
  private readonly MASTERY_THRESHOLD = 90;
  private readonly SPEED_IMPROVEMENT_TARGET = 1.2; // 20% faster

  async determineNextDifficulty(
    studentId: string,
    currentTopic: CurriculumTopic,
    performance: AssessmentResult
  ): Promise<CurriculumTopic> {
    const progress = await this.progressService.getStudentProgress(studentId);
    
    // Check mastery criteria
    if (this.hasMasteredTopic(performance, progress)) {
      return this.getNextTopic(currentTopic);
    }

    // If not mastered, generate similar difficulty
    return this.getReinforcementTopic(currentTopic);
  }

  private hasMasteredTopic(
    performance: AssessmentResult,
    progress: StudentProgress
  ): boolean {
    return (
      performance.accuracy >= this.MASTERY_THRESHOLD &&
      performance.speed >= progress.currentLevel.speedTarget &&
      performance.consecutiveSuccess >= 3
    );
  }

  async generateWorksheet(
    studentId: string,
    topic: CurriculumTopic
  ): Promise<Worksheet> {
    const progress = await this.progressService.getStudentProgress(studentId);
    
    return {
      questions: this.generateQuestions(topic, progress.currentKumonLevel),
      timeLimit: this.calculateTimeLimit(topic, progress),
      requiredAccuracy: this.MASTERY_THRESHOLD,
      difficulty: progress.currentKumonLevel
    };
  }
} 