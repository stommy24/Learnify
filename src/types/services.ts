import { Topic } from './curriculum';

export interface CurriculumService {
  getTopics(): Topic[];
  getTopicById(id: string): Topic | undefined;
  getPrerequisites(topicId: string): Topic[];
}

export interface ProgressTrackingService {
  getProgress(userId: string, topicId: string): number;
  updateProgress(userId: string, topicId: string, progress: number): void;
  getCompletedTopics(userId: string): string[];
}

export interface DifficultyProgressionService {
  calculateNextDifficulty(currentProgress: number, assessmentScore: number): number;
  suggestNextTopic(userId: string, currentTopicId: string): string;
}

export interface AssessmentEngine {
  generateAssessment(topicId: string): Assessment;
  evaluateAssessment(assessment: Assessment, answers: any[]): number;
}

export interface Lesson {
  id: string;
  topicId: string;
  title: string;
  content: string;
  duration: number;
  difficulty: number;
}

export interface Assessment {
  id: string;
  topicId: string;
  questions: Question[];
}

export interface Question {
  id: string;
  text: string;
  options?: string[];
  correctAnswer: string | number;
  type: 'multiple-choice' | 'text' | 'number';
} 