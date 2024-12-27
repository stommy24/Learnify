import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { QuestionForm } from '@/components/questions/QuestionForm';
import { QuestionPreview } from '@/components/questions/QuestionPreview';
import { useQuestionGeneration } from '@/hooks/useQuestionGeneration';

export default function QuestionGenerator() {
  const [formData, setFormData] = useState({
    subject: '',
    keyStage: '',
    topic: '',
    difficulty: 1,
    learningStyle: 'visual'
  });

  const { generateQuestion, question, loading, error } = useQuestionGeneration();

  const handleSubmit = async (data: typeof formData) => {
    await generateQuestion(data);
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold mb-6">Question Generator</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <QuestionForm
            initialData={formData}
            onSubmit={handleSubmit}
            loading={loading}
          />
          
          <QuestionPreview
            question={question}
            loading={loading}
            error={error}
          />
        </div>
      </div>
    </DashboardLayout>
  );
} 
