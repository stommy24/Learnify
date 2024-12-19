import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { completeAssessment } from '../../features/assessment/assessmentSlice';
import { QuestionGenerator } from '../../services/questionGenerator';
import { Question } from '../../types/questions';

interface AssessmentModuleProps {
  assessmentId: string;
}

export const AssessmentModule: React.FC<AssessmentModuleProps> = ({ 
  assessmentId 
}) => {
  const dispatch = useAppDispatch();
  const assessment = useAppSelector(
    state => state.assessment.assessments[assessmentId]
  );
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeRemaining, setTimeRemaining] = useState(assessment?.timeLimit || 0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    loadQuestions();
    if (assessment?.timeLimit) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleComplete();
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, []);

  const loadQuestions = async () => {
    if (!assessment) return;
    
    const generatedQuestions = await Promise.all(
      assessment.topics.map(topic => 
        QuestionGenerator.generateQuestion({
          subject: assessment.subject,
          keyStage: 2, // This should come from user context
          yearGroup: 4, // This should come from user context
          topic,
          difficulty: 3,
          learningStyle: 'visual'
        })
      )
    );
    setQuestions(generatedQuestions);
  };

  const handleAnswerSelect = (answer: string) => {
    setAnswers({
      ...answers,
      [questions[currentQuestionIndex].id]: answer
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    if (isComplete) return;
    setIsComplete(true);

    const results = calculateResults();
    dispatch(completeAssessment({
      id: assessmentId,
      results
    }));
  };

  const calculateResults = () => {
    const correctAnswers = questions.filter(
      q => answers[q.id] === q.content.correctAnswer
    ).length;
    
    const score = (correctAnswers / questions.length) * 100;

    // Analyze strengths and weaknesses
    const topicResults = questions.reduce((acc, q) => {
      const isCorrect = answers[q.id] === q.content.correctAnswer;
      if (!acc[q.curriculumReference.topic]) {
        acc[q.curriculumReference.topic] = { correct: 0, total: 0 };
      }
      acc[q.curriculumReference.topic].total++;
      if (isCorrect) acc[q.curriculumReference.topic].correct++;
      return acc;
    }, {} as Record<string, { correct: number; total: number; }>);

    const strengths = Object.entries(topicResults)
      .filter(([_, stats]) => (stats.correct / stats.total) >= 0.8)
      .map(([topic]) => topic);

    const areasForImprovement = Object.entries(topicResults)
      .filter(([_, stats]) => (stats.correct / stats.total) < 0.6)
      .map(([topic]) => topic);

    return {
      score,
      timeSpent: assessment!.timeLimit ? 
        assessment!.timeLimit - timeRemaining : 0,
      strengths,
      areasForImprovement,
      recommendations: generateRecommendations(areasForImprovement)
    };
  };

  const generateRecommendations = (weakAreas: string[]) => {
    return weakAreas.map(topic => 
      `Practice more ${topic} exercises to improve understanding`
    );
  };

  if (!assessment || !questions.length) {
    return <div>Loading assessment...</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Assessment Header */}
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          {assessment.type.charAt(0).toUpperCase() + assessment.type.slice(1)} Assessment
        </h2>
        {assessment.timeLimit && (
          <div className="text-lg font-semibold">
            Time: {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60)
              .toString()
              .padStart(2, '0')}
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full transition-all"
            style={{
              width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`
            }}
          />
        </div>
        <p className="text-sm text-gray-600 mt-1">
          Question {currentQuestionIndex + 1} of {questions.length}
        </p>
      </div>

      {/* Question */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-lg mb-4">{currentQuestion.content.questionText}</p>

        {/* Answer Options */}
        <div className="space-y-2">
          {currentQuestion.content.options?.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(option)}
              className={`w-full p-3 text-left rounded-lg border ${
                answers[currentQuestion.id] === option
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        {/* Navigation */}
        <div className="mt-6 flex justify-between">
          <button
            onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
            disabled={currentQuestionIndex === 0}
            className="px-4 py-2 text-blue-600 disabled:text-gray-400"
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            disabled={!answers[currentQuestion.id]}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                     disabled:bg-gray-400"
          >
            {currentQuestionIndex === questions.length - 1 ? 'Complete' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}; 