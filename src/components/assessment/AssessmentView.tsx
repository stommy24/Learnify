import React, { useState, useEffect } from 'react';
import { Question } from '@/lib/types/quiz';
import { AssessmentResult, AssessmentConfig } from '@/lib/types/assessment';
import { AssessmentManager } from '@/lib/assessment/AssessmentManager';
import { 
  AssessmentViewProps, 
  AssessmentState, 
  AssessmentProgress,
  AssessmentStatus 
} from './types';
import { AssessmentException } from '@/lib/assessment/types';

const defaultConfig: AssessmentConfig = {
  topics: [],
  yearGroup: 1,
  term: 1,
  difficulty: 1,
  subject: 'test',
  questionCount: 1,
  timeLimit: undefined,
  allowNavigation: true,
  showFeedback: true,
  adaptiveDifficulty: false,
  questionTypes: ['multiple-choice']
};

interface Props extends AssessmentViewProps {
  questions: Question[];
  onComplete: (result: AssessmentResult) => void;
  onProgress?: (progress: AssessmentProgress) => void;
  onError?: (error: AssessmentException) => void;
  initialState?: AssessmentState;
  config?: AssessmentConfig;
}

export const AssessmentView: React.FC<Props> = ({ 
  questions, 
  onComplete, 
  onProgress,
  onError,
  initialState,
  config = defaultConfig
}) => {
  const [state, setState] = useState<AssessmentState>(() => initialState ?? {
    answers: new Array(questions.length).fill(''),
    currentIndex: 0,
    startTime: new Date(),
    timeSpent: 0,
    feedback: []
  });

  const [status, setStatus] = useState<AssessmentStatus>('not_started');
  const [error, setError] = useState<AssessmentException | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      if (status === 'in_progress') {
        setState(prev => ({
          ...prev,
          timeSpent: Math.floor((new Date().getTime() - prev.startTime.getTime()) / 1000)
        }));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [status]);

  useEffect(() => {
    if (config.timeLimit && state.timeSpent >= config.timeLimit) {
      handleTimeout();
    }
  }, [state.timeSpent, config.timeLimit]);

  const handleAnswer = (answer: string) => {
    if (status === 'not_started') {
      setStatus('in_progress');
    }

    setState(prev => {
      const newAnswers = [...prev.answers];
      newAnswers[prev.currentIndex] = answer;
      return { ...prev, answers: newAnswers };
    });

    updateProgress();

    if (config.allowNavigation && state.currentIndex < questions.length - 1) {
      handleNavigation(state.currentIndex + 1);
    } else if (!config.allowNavigation) {
      handleSubmitAnswer(answer);
    }
  };

  const handleNavigation = (index: number) => {
    if (!config.allowNavigation || index < 0 || index >= questions.length) return;
    setState(prev => ({ ...prev, currentIndex: index }));
    updateProgress();
  };

  const handleSubmitAnswer = (answer: string) => {
    try {
      const assessmentManager = new AssessmentManager();
      const result = assessmentManager.createAssessmentResult(
        questions[state.currentIndex],
        answer
      );

      if (config.showFeedback) {
        setState(prev => ({
          ...prev,
          feedback: [...(prev.feedback ?? []), {
            questionId: questions[state.currentIndex].id,
            isCorrect: result.isCorrect,
            message: result.feedback?.[0] ?? '',
            suggestedTopics: []
          }]
        }));
      }

      if (state.currentIndex === questions.length - 1) {
        handleComplete();
      } else {
        handleNavigation(state.currentIndex + 1);
      }
    } catch (e) {
      if (e instanceof AssessmentException) {
        handleError(e);
      } else {
        handleError(new AssessmentException(
          'SYSTEM_ERROR',
          'An unexpected error occurred',
          { error: e }
        ));
      }
    }
  };

  const handleTimeout = () => {
    setStatus('timed_out');
    handleComplete();
  };

  const handleComplete = () => {
    setStatus('completed');
    const assessmentManager = new AssessmentManager();
    const finalResult = assessmentManager.createFinalResult(
      questions,
      state.answers,
      state.timeSpent
    );
    onComplete(finalResult);
  };

  const updateProgress = () => {
    if (onProgress) {
      const progress: AssessmentProgress = {
        currentQuestionIndex: state.currentIndex,
        totalQuestions: questions.length,
        timeSpent: state.timeSpent,
        answers: state.answers,
        isComplete: status === 'completed'
      };
      onProgress(progress);
    }
  };

  const handleError = (error: AssessmentException) => {
    setError(error);
    onError?.(error);
  };

  return (
    <div className="space-y-6 p-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md mb-4">
          {error.message}
        </div>
      )}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          Question {state.currentIndex + 1} of {questions.length}
        </h2>
        <div className="text-sm text-gray-500">
          Time: {formatTime(state.timeSpent)}
          {config.timeLimit && ` / ${formatTime(config.timeLimit)}`}
        </div>
      </div>

      {status !== 'timed_out' && (
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-lg mb-4">{questions[state.currentIndex].text}</p>
          
          <div className="space-y-3">
            {questions[state.currentIndex].options?.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(option)}
                className={`w-full text-left p-3 rounded-md border ${
                  state.answers[state.currentIndex] === option
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          {config.showFeedback && state.feedback?.[state.currentIndex] && (
            <div className={`mt-4 p-3 rounded-md ${
              state.feedback[state.currentIndex].isCorrect 
                ? 'bg-green-50 text-green-700'
                : 'bg-red-50 text-red-700'
            }`}>
              {state.feedback[state.currentIndex].message}
            </div>
          )}
        </div>
      )}

      {config.allowNavigation && (
        <div className="flex justify-between">
          <button
            onClick={() => handleNavigation(state.currentIndex - 1)}
            disabled={state.currentIndex === 0}
            className="px-4 py-2 rounded-md bg-gray-100 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => handleNavigation(state.currentIndex + 1)}
            disabled={
              !state.answers[state.currentIndex] || 
              state.currentIndex === questions.length - 1
            }
            className="px-4 py-2 rounded-md bg-blue-500 text-white disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}; 