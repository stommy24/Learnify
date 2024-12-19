import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'special';
  difficulty: 'easy' | 'medium' | 'hard';
  subject?: 'mathematics' | 'english' | 'general';
  requirements: {
    target: number;
    current: number;
  };
  rewards: {
    stars: number;
    gems?: number;
    experience: number;
    powerUp?: string;
  };
  expiresAt: string;
  completed: boolean;
}

interface ChallengesState {
  dailyChallenges: Challenge[];
  weeklyChallenges: Challenge[];
  specialChallenges: Challenge[];
  lastRefresh: {
    daily: string | null;
    weekly: string | null;
  };
}

const initialState: ChallengesState = {
  dailyChallenges: [],
  weeklyChallenges: [],
  specialChallenges: [],
  lastRefresh: {
    daily: null,
    weekly: null
  }
};

const challengesSlice = createSlice({
  name: 'challenges',
  initialState,
  reducers: {
    setDailyChallenges: (state, action: PayloadAction<Challenge[]>) => {
      state.dailyChallenges = action.payload;
      state.lastRefresh.daily = new Date().toISOString();
    },
    setWeeklyChallenges: (state, action: PayloadAction<Challenge[]>) => {
      state.weeklyChallenges = action.payload;
      state.lastRefresh.weekly = new Date().toISOString();
    },
    updateChallengeProgress: (state, action: PayloadAction<{
      challengeId: string;
      progress: number;
    }>) => {
      const updateChallenge = (challenge: Challenge) => {
        if (challenge.id === action.payload.challengeId && !challenge.completed) {
          challenge.requirements.current += action.payload.progress;
          if (challenge.requirements.current >= challenge.requirements.target) {
            challenge.completed = true;
          }
        }
      };

      state.dailyChallenges.forEach(updateChallenge);
      state.weeklyChallenges.forEach(updateChallenge);
      state.specialChallenges.forEach(updateChallenge);
    }
  }
});

export const {
  setDailyChallenges,
  setWeeklyChallenges,
  updateChallengeProgress
} = challengesSlice.actions;
export default challengesSlice.reducer; 