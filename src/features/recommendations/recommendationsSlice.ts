import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LearningPath {
  id: string;
  subject: 'english' | 'mathematics';
  topics: {
    id: string;
    name: string;
    priority: 'high' | 'medium' | 'low';
    status: 'locked' | 'available' | 'completed';
    prerequisites: string[];
    estimatedTime: number;
    difficulty: 1 | 2 | 3;
  }[];
  currentTopic: string | null;
}

interface Recommendation {
  id: string;
  type: 'topic' | 'skill' | 'revision' | 'challenge';
  priority: 'high' | 'medium' | 'low';
  subject: 'english' | 'mathematics';
  title: string;
  description: string;
  reason: string;
  estimatedTime: number;
  difficulty: 1 | 2 | 3;
  topicId: string;
  expiresAt?: string;
}

interface RecommendationsState {
  learningPaths: {
    english: LearningPath;
    mathematics: LearningPath;
  };
  recommendations: Recommendation[];
  lastUpdated: string;
}

const initialState: RecommendationsState = {
  learningPaths: {
    english: {
      id: 'english-path',
      subject: 'english',
      topics: [],
      currentTopic: null
    },
    mathematics: {
      id: 'mathematics-path',
      subject: 'mathematics',
      topics: [],
      currentTopic: null
    }
  },
  recommendations: [],
  lastUpdated: new Date().toISOString()
};

const recommendationsSlice = createSlice({
  name: 'recommendations',
  initialState,
  reducers: {
    updateLearningPath: (state, action: PayloadAction<{
      subject: 'english' | 'mathematics';
      topics: LearningPath['topics'];
      currentTopic: string;
    }>) => {
      const { subject, topics, currentTopic } = action.payload;
      state.learningPaths[subject].topics = topics;
      state.learningPaths[subject].currentTopic = currentTopic;
    },
    
    setRecommendations: (state, action: PayloadAction<Recommendation[]>) => {
      state.recommendations = action.payload;
      state.lastUpdated = new Date().toISOString();
    },
    
    completeRecommendation: (state, action: PayloadAction<string>) => {
      state.recommendations = state.recommendations.filter(
        rec => rec.id !== action.payload
      );
    }
  }
});

export const {
  updateLearningPath,
  setRecommendations,
  completeRecommendation
} = recommendationsSlice.actions;
export default recommendationsSlice.reducer; 