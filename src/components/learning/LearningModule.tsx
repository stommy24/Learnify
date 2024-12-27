import React, { useState, useEffect } from 'react';
import { Question } from '../../types/questions';
import { QuestionGenerator } from '../../services/questionGenerator';
import { useAppDispatch } from '../../app/hooks';
import { updateProgress } from '../../features/curriculum/curriculumSlice';

interface LearningModuleProps {
  subject: 'english' | 'mathematics';
  keyStage: number;
  yearGroup: number;
  topic: string;
}

export const LearningModule: React.FC<LearningModuleProps> = ({
  subject,
  keyStage,
  yearGroup,
  topic
}) => {
  const dispatch = useAppDispatch();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    loadQuestions();
  }, [subject, topic]);

  const loadQuestions = async () => {
    const newQuestions = await QuestionGenerator.generateQuestionSet({
      subject,
      keyStage,
      yearGroup,
      topic,
      count: 5
    });
    setQuestions(newQuestions);
  };

  const handleAnswerSubmit = () => {
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.content.correctAnswer;
    
    if (isCorrect) {
      setScore(score + 1);
    }
    
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer('');
      setShowExplanation(false);
    } else {
      // Module complete
      const progress = (score / questions.length) * 100;
      dispatch(updateProgress({
        subject,
        topic,
        progress
      }));
    }
  };

  const currentQuestion = questions[currentQuestionIndex];

  if (!currentQuestion) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">{topic}</h2>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-blue-600 h-2.5 rounded-full"
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-lg mb-4">{currentQuestion.content.questionText}</p>

        <div className="space-y-2">
          {currentQuestion.content.options?.map((option, index) => (
            <button
              key={index}
              onClick={() => setSelectedAnswer(option)}
              className={`w-full p-3 text-left rounded-lg border ${
                selectedAnswer === option
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        {!showExplanation && selectedAnswer && (
          <button
            onClick={handleAnswerSubmit}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Submit Answer
          </button>
        )}

        {showExplanation && (
          <div className="mt-4">
            <div className={`p-4 rounded-lg ${
              selectedAnswer === currentQuestion.content.correctAnswer
                ? 'bg-green-50 border border-green-200'
                : 'bg-red-50 border border-red-200'
            }`}>
              <p className="font-bold mb-2">
                {selectedAnswer === currentQuestion.content.correctAnswer
                  ? '✅ Correct!'
                  : '❌ Not quite right'}
              </p>
              <p>{currentQuestion.content.explanation}</p>
            </div>
            <button
              onClick={handleNext}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Complete'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}; 
