export interface DashboardMetrics {
  progress: {
    currentLevel: number;
    completedTopics: number;
    totalTopics: number;
    masteryPercentage: number;
  };
  performance: {
    accuracy: number;
    averageSpeed: number;
    streak: number;
    lastActive: Date;
  };
  currentTopic: {
    id: string;
    name: string;
    progress: number;
    nextMilestone: string;
  };
  achievements: {
    recent: Achievement[];
    total: number;
  };
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  earnedAt: Date;
  type: 'MASTERY' | 'STREAK' | 'SPEED' | 'MILESTONE';
  icon: string;
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