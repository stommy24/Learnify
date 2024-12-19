import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Activity {
  id: string;
  type: 'quiz' | 'assignment' | 'lesson' | 'practice';
  title: string;
  timestamp: string;
  score?: number;
  status: 'completed' | 'in-progress' | 'pending';
}

export interface StudentSummary {
  id: string;
  name: string;
  recentActivities: Activity[];
  totalActivities: number;
  completedActivities: number;
  averageScore: number;
}

interface ManagementState {
  students: StudentSummary[];
  loading: boolean;
  error: string | null;
}

const initialState: ManagementState = {
  students: [],
  loading: false,
  error: null,
};

export const managementSlice = createSlice({
  name: 'management',
  initialState,
  reducers: {
    // Your reducers here
  },
});

export default managementSlice.reducer; 