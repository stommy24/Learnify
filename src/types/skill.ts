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