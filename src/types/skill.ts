import { AssessmentQuestion } from './assessment';
import { MasteryAttempt, MasteryProgress } from './mastery';

export interface Skill {
  id: string;
  name: string;
  description: string;
  prerequisites: string[];
  nextSkills: string[];
  minimumLevel: string;
  createdAt: Date;
  updatedAt: Date;
  questions?: AssessmentQuestion[];
  attempts?: MasteryAttempt[];
  progress?: MasteryProgress[];
}

export enum SkillLevel {
  NOVICE = 'NOVICE',
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
  EXPERT = 'EXPERT'
} 