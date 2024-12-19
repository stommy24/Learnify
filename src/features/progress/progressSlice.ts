import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SkillProgress {
  level: number;
  confidence: number;
  lastPracticed: string;
  totalQuestions: number;
  correctAnswers: number;
}

interface TopicProgress {
  mastery: number;
  questionsAttempted: number;
  questionsCorrect: number;
  timeSpent: number;
  lastAccessed: string;
  skills: Record<string, SkillProgress>;
}

interface ProgressState {
  subjects: {
    english: Record<string, TopicProgress>;
    mathematics: Record<string, TopicProgress>;
  };
  recentActivity: {
    timestamp: string;
    type: 'lesson' | 'assessment' | 'practice';
    subject: 'english' | 'mathematics';
    topic: string;
    score: number;
    timeSpent: number;
  }[];
  learningStrengths: {
    visualScore: number;
    auditoryScore: number;
    kinestheticScore: number;
    readingWritingScore: number;
  };
}

const initialState: ProgressState = {
  subjects: {
    english: {},
    mathematics: {}
  },
  recentActivity: [],
  learningStrengths: {
    visualScore: 0,
    auditoryScore: 0,
    kinestheticScore: 0,
    readingWritingScore: 0
  }
};

const progressSlice = createSlice({
  name: 'progress',
  initialState,
  reducers: {
    updateTopicProgress: (state, action: PayloadAction<{
      subject: 'english' | 'mathematics';
      topic: string;
      results: {
        correct: number;
        total: number;
        timeSpent: number;
        skills: Record<string, {
          correct: number;
          total: number;
        }>;
      };
    }>) => {
      const { subject, topic, results } = action.payload;
      const topicProgress = state.subjects[subject][topic] || {
        mastery: 0,
        questionsAttempted: 0,
        questionsCorrect: 0,
        timeSpent: 0,
        lastAccessed: new Date().toISOString(),
        skills: {}
      };

      // Update topic progress
      topicProgress.questionsAttempted += results.total;
      topicProgress.questionsCorrect += results.correct;
      topicProgress.timeSpent += results.timeSpent;
      topicProgress.mastery = (topicProgress.questionsCorrect / topicProgress.questionsAttempted) * 100;
      topicProgress.lastAccessed = new Date().toISOString();

      // Update skills progress
      Object.entries(results.skills).forEach(([skill, skillResults]) => {
        const skillProgress = topicProgress.skills[skill] || {
          level: 1,
          confidence: 0,
          lastPracticed: new Date().toISOString(),
          totalQuestions: 0,
          correctAnswers: 0
        };

        skillProgress.totalQuestions += skillResults.total;
        skillProgress.correctAnswers += skillResults.correct;
        skillProgress.confidence = (skillProgress.correctAnswers / skillProgress.totalQuestions) * 100;
        skillProgress.lastPracticed = new Date().toISOString();

        // Update skill level based on confidence
        if (skillProgress.confidence >= 90) skillProgress.level = 3;
        else if (skillProgress.confidence >= 70) skillProgress.level = 2;
        else skillProgress.level = 1;

        topicProgress.skills[skill] = skillProgress;
      });

      state.subjects[subject][topic] = topicProgress;
    },

    addActivity: (state, action: PayloadAction<{
      type: 'lesson' | 'assessment' | 'practice';
      subject: 'english' | 'mathematics';
      topic: string;
      score: number;
      timeSpent: number;
    }>) => {
      state.recentActivity.unshift({
        ...action.payload,
        timestamp: new Date().toISOString()
      });
      state.recentActivity = state.recentActivity.slice(0, 10); // Keep last 10 activities
    },

    updateLearningStrengths: (state, action: PayloadAction<{
      type: 'visual' | 'auditory' | 'kinesthetic' | 'readingWriting';
      score: number;
    }>) => {
      const { type, score } = action.payload;
      state.learningStrengths[`${type}Score`] = score;
    }
  }
});

export const {
  updateTopicProgress,
  addActivity,
  updateLearningStrengths
} = progressSlice.actions;
export default progressSlice.reducer; 