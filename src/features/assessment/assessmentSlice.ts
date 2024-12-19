import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Assessment {
  id: string;
  type: 'diagnostic' | 'topic' | 'unit' | 'termly';
  subject: 'english' | 'mathematics';
  topics: string[];
  questions: string[];
  timeLimit?: number;
  completed: boolean;
  results?: {
    score: number;
    timeSpent: number;
    strengths: string[];
    areasForImprovement: string[];
    recommendations: string[];
  };
  scheduledFor?: string;
}

interface AssessmentState {
  assessments: Record<string, Assessment>;
  currentAssessment: string | null;
  assessmentHistory: {
    id: string;
    date: string;
    type: string;
    score: number;
  }[];
}

const initialState: AssessmentState = {
  assessments: {},
  currentAssessment: null,
  assessmentHistory: []
};

const assessmentSlice = createSlice({
  name: 'assessment',
  initialState,
  reducers: {
    scheduleAssessment: (state, action: PayloadAction<Assessment>) => {
      state.assessments[action.payload.id] = action.payload;
    },
    startAssessment: (state, action: PayloadAction<string>) => {
      state.currentAssessment = action.payload;
    },
    completeAssessment: (state, action: PayloadAction<{
      id: string;
      results: Assessment['results'];
    }>) => {
      const assessment = state.assessments[action.payload.id];
      if (assessment) {
        assessment.completed = true;
        assessment.results = action.payload.results;
        state.assessmentHistory.unshift({
          id: action.payload.id,
          date: new Date().toISOString(),
          type: assessment.type,
          score: action.payload.results.score
        });
      }
      state.currentAssessment = null;
    }
  }
});

export const {
  scheduleAssessment,
  startAssessment,
  completeAssessment
} = assessmentSlice.actions;
export default assessmentSlice.reducer; 