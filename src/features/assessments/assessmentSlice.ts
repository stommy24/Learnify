import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type QuestionType = 
  | 'multiple-choice'
  | 'true-false'
  | 'short-answer'
  | 'essay'
  | 'matching'
  | 'fill-blank';

interface Question {
  id: string;
  type: QuestionType;
  text: string;
  points: number;
  options?: string[];
  correctAnswer?: string | string[];
  rubric?: {
    criteria: string;
    points: number;
    description: string;
  }[];
}

interface Assessment {
  id: string;
  title: string;
  description: string;
  subject: string;
  yearGroup: number;
  duration: number; // in minutes
  totalPoints: number;
  passingScore: number;
  questions: Question[];
  status: 'draft' | 'published' | 'archived';
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

interface StudentSubmission {
  id: string;
  studentId: string;
  assessmentId: string;
  answers: {
    questionId: string;
    answer: string | string[];
  }[];
  score?: number;
  feedback?: string;
  submittedAt: string;
  gradedAt?: string;
  gradedBy?: string;
  status: 'submitted' | 'grading' | 'graded';
}

interface AssessmentState {
  assessments: Record<string, Assessment>;
  submissions: Record<string, StudentSubmission>;
  currentAssessment: string | null;
  filters: {
    subject?: string;
    yearGroup?: number;
    status?: Assessment['status'];
    dateRange?: [string, string];
  };
  isLoading: boolean;
  error: string | null;
}

const initialState: AssessmentState = {
  assessments: {},
  submissions: {},
  currentAssessment: null,
  filters: {},
  isLoading: false,
  error: null
};

const assessmentSlice = createSlice({
  name: 'assessments',
  initialState,
  reducers: {
    setAssessments: (state, action: PayloadAction<Assessment[]>) => {
      state.assessments = action.payload.reduce((acc, assessment) => {
        acc[assessment.id] = assessment;
        return acc;
      }, {} as Record<string, Assessment>);
    },
    addAssessment: (state, action: PayloadAction<Assessment>) => {
      state.assessments[action.payload.id] = action.payload;
    },
    updateAssessment: (state, action: PayloadAction<{
      id: string;
      updates: Partial<Assessment>;
    }>) => {
      if (state.assessments[action.payload.id]) {
        state.assessments[action.payload.id] = {
          ...state.assessments[action.payload.id],
          ...action.payload.updates,
          updatedAt: new Date().toISOString()
        };
      }
    },
    deleteAssessment: (state, action: PayloadAction<string>) => {
      delete state.assessments[action.payload];
    },
    setSubmissions: (state, action: PayloadAction<StudentSubmission[]>) => {
      state.submissions = action.payload.reduce((acc, submission) => {
        acc[submission.id] = submission;
        return acc;
      }, {} as Record<string, StudentSubmission>);
    },
    addSubmission: (state, action: PayloadAction<StudentSubmission>) => {
      state.submissions[action.payload.id] = action.payload;
    },
    updateSubmission: (state, action: PayloadAction<{
      id: string;
      updates: Partial<StudentSubmission>;
    }>) => {
      if (state.submissions[action.payload.id]) {
        state.submissions[action.payload.id] = {
          ...state.submissions[action.payload.id],
          ...action.payload.updates
        };
      }
    },
    setCurrentAssessment: (state, action: PayloadAction<string | null>) => {
      state.currentAssessment = action.payload;
    },
    setFilters: (state, action: PayloadAction<AssessmentState['filters']>) => {
      state.filters = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    }
  }
});

export const {
  setAssessments,
  addAssessment,
  updateAssessment,
  deleteAssessment,
  setSubmissions,
  addSubmission,
  updateSubmission,
  setCurrentAssessment,
  setFilters,
  setLoading,
  setError
} = assessmentSlice.actions;

export default assessmentSlice.reducer; 