export interface Assessment {
  id: string;
  title: string;
  description: string;
  subjectId: string;
  yearGroup: number;
  duration: number;
  totalPoints: number;
  passingScore: number;
  questions: Question[];
  status: 'draft' | 'published' | 'archived';
  dueDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface Question {
  id: string;
  text: string;
  type: 'multiple-choice' | 'short-answer' | 'essay';
  points: number;
  options?: string[];
  correctAnswer: string;
  explanation?: string;
}

export interface AssessmentSubmission {
  id: string;
  assessmentId: string;
  userId: string;
  answers: Record<string, string>;
  score?: number;
  submittedAt: string;
} 