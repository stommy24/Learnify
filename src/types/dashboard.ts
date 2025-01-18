export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: string;
  xpReward: number;
  earnedAt?: Date | null;
}

export interface DashboardMetrics {
  progress: {
    currentLevel: number;
    completedTopics: number;
    totalTopics: number;
    masteryPercentage: number;
  };
  achievements: {
    recent: Achievement[];
    total: number;
  };
  recentAnswers: any[];
  streak: {
    current: number;
    longest: number;
  };
}

export interface LearningModule {
  id: string;
  title: string;
  type: 'LESSON' | 'PRACTICE' | 'ASSESSMENT';
  status: 'LOCKED' | 'AVAILABLE' | 'IN_PROGRESS' | 'COMPLETED';
  prerequisites: string[];
  content: {
    explanation?: string;
    examples?: string[];
    demonstration?: string;
    practice?: string[];
  };
} 