import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: 'bronze' | 'silver' | 'gold' | 'platinum';
  progress: {
    current: number;
    target: number;
  };
  rewards: {
    experience: number;
    currency?: {
      stars?: number;
      gems?: number;
    };
    items?: string[];
  };
  completed: boolean;
  dateCompleted?: string;
}

interface AchievementsState {
  achievements: Record<string, Achievement>;
  recentlyUnlocked: string[];
}

const initialState: AchievementsState = {
  achievements: {
    first_perfect_score: {
      id: 'first_perfect_score',
      title: 'Perfect Start!',
      description: 'Get your first 100% on a quiz',
      icon: '🌟',
      type: 'bronze',
      progress: { current: 0, target: 1 },
      rewards: {
        experience: 100,
        currency: { stars: 50 }
      },
      completed: false
    },
    // Add more achievements...
  },
  recentlyUnlocked: []
};

const achievementsSlice = createSlice({
  name: 'achievements',
  initialState,
  reducers: {
    updateProgress: (state, action: PayloadAction<{
      achievementId: string;
      progress: number;
    }>) => {
      const achievement = state.achievements[action.payload.achievementId];
      if (achievement && !achievement.completed) {
        achievement.progress.current += action.payload.progress;
        
        if (achievement.progress.current >= achievement.progress.target) {
          achievement.completed = true;
          achievement.dateCompleted = new Date().toISOString();
          state.recentlyUnlocked.push(achievement.id);
        }
      }
    },
    clearRecentlyUnlocked: (state) => {
      state.recentlyUnlocked = [];
    }
  }
});

export const { updateProgress, clearRecentlyUnlocked } = achievementsSlice.actions;
export default achievementsSlice.reducer; 