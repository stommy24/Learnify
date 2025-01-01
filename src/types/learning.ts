export interface LearningProgress {
  id: string;
  userId: string;
  timestamp: Date;
  results: AssessmentResult[];
}

export interface AssessmentResult {
  topicId: string;
  score: number;
  timestamp: Date;
}
