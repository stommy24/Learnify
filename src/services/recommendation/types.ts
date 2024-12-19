export interface LearningRecommendation {
  id: string;
  userId: string;
  type: 'topic' | 'resource' | 'practice';
  subject: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  reason: string;
  resourceUrl?: string;
  createdAt: string;
  expiresAt?: string;
}

export interface UserProgress {
  userId: string;
  subjectId: string;
  topicId: string;
  score: number;
  completedAt: string;
  strengths: string[];
  weaknesses: string[];
} 