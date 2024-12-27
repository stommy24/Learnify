import { AssessmentState, AssessmentConfig, AssessmentProgress } from './types';
import { Question } from '@/lib/types/quiz';

export const validateAssessmentState = (state: AssessmentState): boolean => {
  if (!state.answers || !Array.isArray(state.answers)) return false;
  if (typeof state.currentIndex !== 'number') return false;
  if (!(state.startTime instanceof Date)) return false;
  if (typeof state.timeSpent !== 'number') return false;
  return true;
};

export const validateConfig = (config: AssessmentConfig): boolean => {
  if (typeof config.allowNavigation !== 'boolean') return false;
  if (typeof config.showFeedback !== 'boolean') return false;
  if (typeof config.adaptiveDifficulty !== 'boolean') return false;
  if (!Array.isArray(config.questionTypes)) return false;
  if (config.timeLimit && typeof config.timeLimit !== 'number') return false;
  return true;
};

export const validateQuestions = (questions: Question[]): boolean => {
  return questions.every(question => 
    question.id &&
    question.text &&
    Array.isArray(question.options) &&
    question.options.length > 0 &&
    typeof question.correctAnswer === 'string'
  );
};

export const isAssessmentComplete = (progress: AssessmentProgress): boolean => {
  return progress.answers.length === progress.totalQuestions &&
    progress.answers.every(answer => answer !== '');
}; 