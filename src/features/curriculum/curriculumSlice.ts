import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CurriculumStructure } from '../../types/curriculum';

interface CurriculumState {
  currentKeyStage: 1 | 2 | 3;
  yearGroup: 1 | 2 | 3 | 4 | 5 | 6;
  subjects: {
    english: {
      currentTopic: string;
      progress: Record<string, number>;
      completedTopics: string[];
    };
    mathematics: {
      currentTopic: string;
      progress: Record<string, number>;
      completedTopics: string[];
    };
  };
  structure: CurriculumStructure;
}

const initialState: CurriculumState = {
  currentKeyStage: 1,
  yearGroup: 1,
  subjects: {
    english: {
      currentTopic: '',
      progress: {},
      completedTopics: []
    },
    mathematics: {
      currentTopic: '',
      progress: {},
      completedTopics: []
    }
  },
  structure: {
    keyStage: 1,
    subject: 'english',
    yearGroup: 1,
    englishAreas: {
      spokenLanguage: true,
      reading: {
        wordReading: true,
        comprehension: true
      },
      writing: {
        transcription: true,
        composition: true,
        vocabulary: true,
        grammar: true
      }
    },
    mathematicsAreas: {
      number: {
        placeValue: true,
        operations: true,
        fractions: true
      },
      measurement: true,
      geometry: {
        shapes: true,
        position: true
      }
    }
  }
};

const curriculumSlice = createSlice({
  name: 'curriculum',
  initialState,
  reducers: {
    setYearGroup: (state, action: PayloadAction<number>) => {
      state.yearGroup = action.payload as 1 | 2 | 3 | 4 | 5 | 6;
      state.currentKeyStage = action.payload <= 2 ? 1 : 
                             action.payload <= 6 ? 2 : 3;
    },
    updateProgress: (state, action: PayloadAction<{
      subject: 'english' | 'mathematics';
      topic: string;
      progress: number;
    }>) => {
      const { subject, topic, progress } = action.payload;
      state.subjects[subject].progress[topic] = progress;
      
      if (progress >= 100 && 
          !state.subjects[subject].completedTopics.includes(topic)) {
        state.subjects[subject].completedTopics.push(topic);
      }
    },
    setCurrentTopic: (state, action: PayloadAction<{
      subject: 'english' | 'mathematics';
      topic: string;
    }>) => {
      const { subject, topic } = action.payload;
      state.subjects[subject].currentTopic = topic;
    }
  }
});

export const { 
  setYearGroup, 
  updateProgress, 
  setCurrentTopic 
} = curriculumSlice.actions;
export default curriculumSlice.reducer; 