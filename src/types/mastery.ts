import { Skill } from './skill';

export type MasteryLevel = 'NOVICE' | 'PRACTICING' | 'COMPETENT' | 'PROFICIENT' | 'EXPERT';

export interface MasteryAttempt {
  topicId: string;
  correct: boolean;
  timestamp: Date;
}

export interface MasteryProgress {
  id: string;
  studentId: string;
  skillId: string;
  consecutiveSuccesses: number;
  currentLevel: 'NOVICE' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  createdAt: Date;
  updatedAt: Date;
}

export interface MasteryProgressWithAttempts extends MasteryProgress {
  attempts: MasteryAttempt[];
} 