import React, { useState, useEffect } from 'react';
import { Question, QuestionType } from '../../features/assessments/assessmentSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { validateQuestion } from '../../utils/validation';

interface QuestionEditorProps {
  question: Question | null;
  onSave: (question: Question) => void;
  onCancel: () => void;
}

export const QuestionEditor: React.FC<QuestionEditorProps> = ({
  question,
  onSave,
  onCancel
}) => {
  const [formData, setFormData] = useState<Omit<Question, 'id'>>({
    type: 'multiple-choice',
    text: '',
    points: 1,
    options: ['', ''],
    correctAnswer: '',
    rubric: []
  });

  useEffect(() => {
    if (question) {
      const { id, ...rest } = question;
      setFormData(rest);
    }
  }, [question]);

  const handleAddOption = () => {
    setFormData({
      ...formData,
      options: [...(formData.options || []), '']
    });
  };

  const handleRemoveOption = (index: number) => {
    setFormData({
      ...formData,
      options: formData.options?.filter((_, i) => i !== index)
    });
  };

  const handleOptionChange = (index: number, value: string) => {
    setFormData({
      ...formData,
      options: formData.options?.map((opt, i) => i === index ? value : opt)
    });
  };

  const handleAddRubricCriteria = () => {
    setFormData({
      ...formData,
      rubric: [
        ...(formData.rubric || []),
        { criteria: '', points: 0, description: '' }
      ]
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: question?.id || 'temp-id', // Will be replaced with UUID in parent
      ...formData
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit} className="p-6">
          <h2 className="text-xl font-semibold mb-6">
            {question ? 'Edit Question' : 'Add Question'}
          </h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Question Type</label>
              <select
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.type}
                onChange={(e) => setFormData({
                  ...formData,
                  type: e.target.value as QuestionType,
                  options: e.target.value === 'multiple-choice' ? ['', ''] : undefined,
                  correctAnswer: e.target.value === 'true-false' ? 'true' : '',
                  rubric: e.target.value === 'essay' ? [{ criteria: '', points: 0, description: '' }] : undefined
                })}
              >
                <option value="multiple-choice">Multiple Choice</option>
                <option value="true-false">True/False</option>
                <option value="short-answer">Short Answer</option>
                <option value="essay">Essay</option>
                <option value="matching">Matching</option>
                <option value="fill-blank">Fill in the Blank</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Question Text</label>
              <textarea
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                rows={3}
                value={formData.text}
                onChange={(e) => setFormData({ ...formData, text: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Points</label>
              <input
                type="number"
                required
                min="1"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.points}
                onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) })}
              />
            </div>

            {/* Multiple Choice Options */}
            {formData.type === 'multiple-choice' && (
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">Options</label>
                {formData.options?.map((option, index) => (
                  <div key={index} className="flex gap-4 items-center">
                    <input
                      type="radio"
                      name="correctAnswer"
                      checked={formData.correctAnswer === option}
                      onChange={() => setFormData({ ...formData, correctAnswer: option })}
                    />
                    <input
                      type="text"
                      required
                      className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                    />
                    {formData.options!.length > 2 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveOption(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddOption}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Add Option
                </button>
              </div>
            )}

            {/* True/False */}
            {formData.type === 'true-false' && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Correct Answer</label>
                <select
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={formData.correctAnswer}
                  onChange={(e) => setFormData({ ...formData, correctAnswer: e.target.value })}
                >
                  <option value="true">True</option>
                  <option value="false">False</option>
                </select>
              </div>
            )}

            {/* Essay Rubric */}
            {formData.type === 'essay' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-medium text-gray-700">Rubric</label>
                  <button
                    type="button"
                    onClick={handleAddRubricCriteria}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Add Criteria
                  </button>
                </div>
                {formData.rubric?.map((criteria, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                      type="text"
                      required
                      className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      value={criteria.criteria}
                      onChange={(e) => {
                        const newRubric = [...(formData.rubric || [])];
                        newRubric[index] = { ...criteria, criteria: e.target.value };
                        setFormData({ ...formData, rubric: newRubric });
                      }}
                      placeholder="Criteria"
                    />
                    <input
                      type="number"
                      required
                      min="0"
                      className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      value={criteria.points}
                      onChange={(e) => {
                        const newRubric = [...(formData.rubric || [])];
                        newRubric[index] = { ...criteria, points: parseInt(e.target.value) };
                        setFormData({ ...formData, rubric: newRubric });
                      }}
                      placeholder="Points"
                    />
                    <input
                      type="text"
                      required
                      className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      value={criteria.description}
                      onChange={(e) => {
                        const newRubric = [...(formData.rubric || [])];
                        newRubric[index] = { ...criteria, description: e.target.value };
                        setFormData({ ...formData, rubric: newRubric });
                      }}
                      placeholder="Description"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-end gap-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Save Question
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}; 