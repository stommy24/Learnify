import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PerformanceData {
  subject: string;
  score: number;
  date: string;
}

interface StudentAnalytics {
  id: string;
  name: string;
  yearGroup: number;
  performanceHistory: PerformanceData[];
  averageScore: number;
  attendance: number;
  completionRate: number;
  strengths: string[];
  weaknesses: string[];
  improvement: number;
}

interface ClassAnalytics {
  averageScore: number;
  attendanceRate: number;
  completionRate: number;
  subjectPerformance: {
    [subject: string]: {
      average: number;
      improvement: number;
      topPerformers: string[];
      needsSupport: string[];
    };
  };
  performanceTrends: {
    date: string;
    average: number;
  }[];
}

interface AnalyticsState {
  studentAnalytics: Record<string, StudentAnalytics>;
  classAnalytics: ClassAnalytics;
  selectedTimeRange: 'week' | 'month' | 'term' | 'year';
  selectedSubjects: string[];
  isLoading: boolean;
  error: string | null;
}

const initialState: AnalyticsState = {
  studentAnalytics: {},
  classAnalytics: {
    averageScore: 0,
    attendanceRate: 0,
    completionRate: 0,
    subjectPerformance: {},
    performanceTrends: []
  },
  selectedTimeRange: 'month',
  selectedSubjects: ['english', 'mathematics'],
  isLoading: false,
  error: null
};

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    setStudentAnalytics: (state, action: PayloadAction<StudentAnalytics[]>) => {
      state.studentAnalytics = action.payload.reduce((acc, student) => {
        acc[student.id] = student;
        return acc;
      }, {} as Record<string, StudentAnalytics>);
    },
    setClassAnalytics: (state, action: PayloadAction<ClassAnalytics>) => {
      state.classAnalytics = action.payload;
    },
    setTimeRange: (state, action: PayloadAction<AnalyticsState['selectedTimeRange']>) => {
      state.selectedTimeRange = action.payload;
    },
    setSelectedSubjects: (state, action: PayloadAction<string[]>) => {
      state.selectedSubjects = action.payload;
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
  setStudentAnalytics,
  setClassAnalytics,
  setTimeRange,
  setSelectedSubjects,
  setLoading,
  setError
} = analyticsSlice.actions;
export default analyticsSlice.reducer; 