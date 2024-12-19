export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'achievement';
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  requirements: string[];
  progress: number;
  completed: boolean;
  userId: string;
  createdAt: string;
  expiresAt?: string;
}

export interface ChallengeProgress {
  challengeId: string;
  userId: string;
  progress: number;
  completed: boolean;
  completedAt?: string;
} 