import React, { useState } from 'react';
import { Assessment, StudentSubmission } from '../../features/assessments/assessmentSlice';
import { format } from 'date-fns';

interface SubmissionDetailProps {
  submission: StudentSubmission;
  assessment: Assessment;
  onGrade: (submissionId: string, score: number, feedback: string) => void;
}

export const SubmissionDetail: React.FC<SubmissionDetailProps> = ({
  submission,
  assessment,
  onGrade
}) => {
  const [editMode, setEditMode] = useState(submission.status !== 'graded');
  const [scores, setScores] = useState<Record<string, number>>(() => {
    const initialScores: Record<string, number> = {};
    submission.answers.forEach(answer => {
      const question = assessment.questions.find(q => q.id === answer.questionId);
      if (question) {
        initialScores[answer.questionId] = 0;
      }
    });
    return initialScores;
  });
  const [feedback, setFeedback] = useState(submission.feedback || '');

  const calculateTotalScore = () => {
    const totalPoints = assessment.questions.reduce((sum, q) => sum + q.points, 0);
    const earnedPoints = Object.values(scores).reduce((sum, score) => sum + score, 0);
    return Math.round((earnedPoints / totalPoints) * 100);
  };

  const handleScoreChange = (questionId: string, score: number, maxPoints: number) => {
    if (score >= 0 && score <= maxPoints) {
      setScores(prev => ({
        ...prev,
        [questionId]: score
      }));
    }
  };

  const handleSubmitGrade = () => {
    onGrade(submission.id, calculateTotalScore(), feedback);
    setEditMode(false);
  };

  return (
    <div className="space-y-6">
      {/* Submission Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div>
          <span className="text-gray-500">Submitted:</span>
          <span className="ml-2">
            {format(new Date(submission.submittedAt), 'MMM d, yyyy HH:mm')}
          </span>
        </div>
        {submission.gradedAt && (
          <div>
            <span className="text-gray-500">Graded:</span>
            <span className="ml-2">
              {format(new Date(submission.gradedAt), 'MMM d, yyyy HH:mm')}
            </span>
          </div>
        )}
        {submission.gradedBy && (
          <div>
            <span className="text-gray-500">Graded by:</span>
            <span className="ml-2">{submission.gradedBy}</span>
          </div>
        )}
      </div>

      {/* Answers and Grading */}
      <div className="space-y-6">
        {submission.answers.map((answer, index) => {
          const question = assessment.questions.find(q => q.id === answer.questionId);
          if (!question) return null;

          return (
            <div key={answer.questionId} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="text-sm text-gray-500">Question {index + 1}</span>
                  <h4 className="font-medium">{question.text}</h4>
                </div>
                <div className="text-sm text-gray-500">
                  {question.points} points
                </div>
              </div>

              {/* Answer Display */}
              <div className="mt-2 mb-4">
                <h5 className="text-sm font-medium text-gray-700 mb-1">Student's Answer:</h5>
                <div className="bg-gray-50 p-3 rounded">
                  {Array.isArray(answer.answer) ? (
                    <ul className="list-disc list-inside">
                      {answer.answer.map((ans, i) => (
                        <li key={i}>{ans}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>{answer.answer}</p>
                  )}
                </div>
              </div>

              {/* Correct Answer Display */}
              {question.correctAnswer && (
                <div className="mt-2 mb-4">
                  <h5 className="text-sm font-medium text-gray-700 mb-1">Correct Answer:</h5>
                  <div className="bg-green-50 p-3 rounded">
                    {Array.isArray(question.correctAnswer) ? (
                      <ul className="list-disc list-inside">
                        {question.correctAnswer.map((ans, i) => (
                          <li key={i}>{ans}</li>
                        ))}
                      </ul>
                    ) : (
                      <p>{question.correctAnswer}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Rubric Display for Essay Questions */}
              {question.type === 'essay' && question.rubric && (
                <div className="mt-4">
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Grading Rubric:</h5>
                  <div className="space-y-2">
                    {question.rubric.map((criteria, i) => (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <span>{criteria.criteria}</span>
                        <span className="text-gray-500">{criteria.points} points</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Scoring */}
              {editMode ? (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">Score:</label>
                  <div className="mt-1 flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      max={question.points}
                      value={scores[answer.questionId] || 0}
                      onChange={(e) => handleScoreChange(
                        answer.questionId,
                        parseInt(e.target.value),
                        question.points
                      )}
                      className="block w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-500">/ {question.points}</span>
                  </div>
                </div>
              ) : (
                <div className="mt-4">
                  <span className="text-sm font-medium text-gray-700">Score: </span>
                  <span className="text-sm">
                    {scores[answer.questionId] || 0} / {question.points}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Feedback and Total Score */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Overall Feedback:
          </label>
          {editMode ? (
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={3}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          ) : (
            <div className="bg-gray-50 p-3 rounded">
              {feedback || 'No feedback provided.'}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-medium">Total Score: </span>
            <span className={`text-lg font-bold ${
              calculateTotalScore() >= assessment.passingScore
                ? 'text-green-600'
                : 'text-red-600'
            }`}>
              {calculateTotalScore()}%
            </span>
          </div>

          {editMode && (
            <button
              onClick={handleSubmitGrade}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Submit Grade
            </button>
          )}
        </div>
      </div>
    </div>
  );
}; 