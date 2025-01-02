import { Skill } from './skill';

export type MasteryLevel = 'NOVICE' | 'PRACTICING' | 'COMPETENT' | 'PROFICIENT' | 'EXPERT';

export interface MasteryAttempt {
  id: string;
  studentId: string;
  skillId: string;
  score: number;
  timeSpent: number;
  errors: string[];
  completedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  skill?: Skill;
}

export interface MasteryProgress {
  id: string;
  studentId: string;
  skillId: string;
  currentLevel: MasteryLevel;
  consecutiveSuccesses: number;
  createdAt: Date;
  updatedAt: Date;
  skill?: Skill;
  attempts?: MasteryAttempt[];
}

export interface MasteryProgressWithAttempts extends MasteryProgress {
  attempts: MasteryAttempt[];
} 