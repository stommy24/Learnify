import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { 
  Assessment,
  Question,
  QuestionType,
  addAssessment,
  updateAssessment 
} from '../../features/assessments/assessmentSlice';
import { QuestionEditor } from './QuestionEditor';
import { v4 as uuidv4 } from 'uuid';
import { createAssessment } from '../../services/assessmentService';

interface AssessmentEditorProps {
  onSave: () => void;
}

export const AssessmentEditor: React.FC<AssessmentEditorProps> = ({ onSave }) => {
  const dispatch = useAppDispatch();
  const currentAssessmentId = useAppSelector(state => state.assessments.currentAssessment);
  const currentAssessment = useAppSelector(
    state => currentAssessmentId ? state.assessments.assessments[currentAssessmentId] : null
  );

  const [formData, setFormData] = useState<Omit<Assessment, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>>({
    title: '',
    description: '',
    subject: 'english',
    yearGroup: 7,
    duration: 60,
    totalPoints: 0,
    passingScore: 60,
    questions: [],
    status: 'draft',
    dueDate: undefined
  });

  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [showQuestionEditor, setShowQuestionEditor] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (currentAssessment) {
      const {
        id, createdAt, updatedAt, createdBy,
        ...rest
      } = currentAssessment;
      setFormData(rest);
    }
  }, [currentAssessment]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newAssessment = await createAssessment(formData);
      dispatch(addAssessment(newAssessment));
      onSave();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to create assessment');
    }
  };

  const handleQuestionSave = (question: Question) => {
    const updatedQuestions = currentQuestion
      ? formData.questions.map(q => q.id === question.id ? question : q)
      : [...formData.questions, { ...question, id: uuidv4() }];

    setFormData({
      ...formData,
      questions: updatedQuestions,
      totalPoints: updatedQuestions.reduce((sum, q) => sum + q.points, 0)
    });
    setCurrentQuestion(null);
    setShowQuestionEditor(false);
  };

  const handleQuestionDelete = (questionId: string) => {
    setFormData({
      ...formData,
      questions: formData.questions.filter(q => q.id !== questionId)
    });
  };

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Subject</label>
              <select
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              >
                <option value="english">English</option>
                <option value="mathematics">Mathematics</option>
                <option value="science">Science</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Year Group</label>
              <select
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.yearGroup}
                onChange={(e) => setFormData({ ...formData, yearGroup: parseInt(e.target.value) })}
              >
                {[7, 8, 9, 10, 11, 12, 13].map(year => (
                  <option key={year} value={year}>Year {year}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Duration (minutes)</label>
              <input
                type="number"
                min="1"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Passing Score (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.passingScore}
                onChange={(e) => setFormData({ ...formData, passingScore: parseInt(e.target.value) })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Due Date</label>
              <input
                type="datetime-local"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.dueDate || ''}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Questions</h3>
            <button
              type="button"
              onClick={() => {
                setCurrentQuestion(null);
                setShowQuestionEditor(true);
              }}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Add Question
            </button>
          </div>

          <div className="space-y-4">
            {formData.questions.map((question, index) => (
              <div
                key={question.id}
                className="border rounded-lg p-4 hover:bg-gray-50"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-sm text-gray-500">Question {index + 1}</span>
                    <h4 className="font-medium">{question.text}</h4>
                    <div className="mt-2 flex gap-4 text-sm text-gray-500">
                      <span>Type: {question.type}</span>
                      <span>Points: {question.points}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentQuestion(question);
                        setShowQuestionEditor(true);
                      }}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuestionDelete(question.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-4">
          <button
            type="button"
            onClick={() => onSave()}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            {currentAssessmentId ? 'Update' : 'Create'} Assessment
          </button>
        </div>
      </form>

      {showQuestionEditor && (
        <QuestionEditor
          question={currentQuestion}
          onSave={handleQuestionSave}
          onCancel={() => {
            setCurrentQuestion(null);
            setShowQuestionEditor(false);
          }}
        />
      )}
    </div>
  );
}; 