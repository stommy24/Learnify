import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ProgressionState {
  levels: {
    current: number;
    experience: number;
    nextLevelThreshold: number;
    bonusMultiplier: number;
  };
  streaks: {
    current: number;
    best: number;
    multiplier: number;
    lastLoginDate: string | null;
  };
}

const initialState: ProgressionState = {
  levels: {
    current: 1,
    experience: 0,
    nextLevelThreshold: 100,
    bonusMultiplier: 1.0
  },
  streaks: {
    current: 0,
    best: 0,
    multiplier: 1.0,
    lastLoginDate: null
  }
};

const progressionSlice = createSlice({
  name: 'progression',
  initialState,
  reducers: {
    addExperience: (state, action: PayloadAction<number>) => {
      state.levels.experience += action.payload * state.levels.bonusMultiplier;
      
      // Check for level up
      while (state.levels.experience >= state.levels.nextLevelThreshold) {
        state.levels.current += 1;
        state.levels.experience -= state.levels.nextLevelThreshold;
        state.levels.nextLevelThreshold = calculateNextThreshold(state.levels.current);
      }
    },
    
    updateStreak: (state, action: PayloadAction<string>) => {
      const currentDate = new Date(action.payload);
      const lastLogin = state.streaks.lastLoginDate ? 
        new Date(state.streaks.lastLoginDate) : null;
      
      if (!lastLogin) {
        state.streaks.current = 1;
      } else {
        const dayDifference = getDayDifference(currentDate, lastLogin);
        
        if (dayDifference === 1) {
          state.streaks.current += 1;
          state.streaks.best = Math.max(state.streaks.current, state.streaks.best);
          state.streaks.multiplier = calculateStreakMultiplier(state.streaks.current);
        } else if (dayDifference > 1) {
          state.streaks.current = 1;
          state.streaks.multiplier = 1.0;
        }
      }
      
      state.streaks.lastLoginDate = action.payload;
    }
  }
});

// Helper functions
const calculateNextThreshold = (level: number): number => {
  return Math.floor(100 * Math.pow(1.5, level - 1));
};

const getDayDifference = (date1: Date, date2: Date): number => {
  const diff = date1.getTime() - date2.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
};

const calculateStreakMultiplier = (streak: number): number => {
  return Math.min(1 + (streak * 0.1), 2.0); // Cap at 2x multiplier
};

export const { addExperience, updateStreak } = progressionSlice.actions;
export default progressionSlice.reducer; 