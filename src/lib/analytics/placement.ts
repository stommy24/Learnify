import { monitor } from '@/lib/monitoring';

export const placementAnalytics = {
  trackTestStart(studentId: string, initialLevel: number) {
    monitor.increment('placement_test.started');
    monitor.gauge('placement_test.initial_level', initialLevel);
  },

  trackQuestionAnswer(
    testId: string, 
    questionId: string, 
    isCorrect: boolean, 
    timeSpent: number
  ) {
    monitor.increment(`placement_test.question.${isCorrect ? 'correct' : 'incorrect'}`);
    monitor.timing('placement_test.question.time', timeSpent);
  },

  trackTestCompletion(testId: string, finalLevel: number, totalTime: number) {
    monitor.increment('placement_test.completed');
    monitor.gauge('placement_test.final_level', finalLevel);
    monitor.timing('placement_test.total_time', totalTime);
  }
}; 