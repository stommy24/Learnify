import React from 'react';
import { useRouter } from 'next/router';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { QuestionSchema, type QuestionType } from '@/types/questions';
import { z } from 'zod';

interface FieldValues {
  content: string;
  type: "multipleChoice" | "fillInBlank" | "openEnded" | "mathematical";
  difficulty: "easy" | "medium" | "hard";
  answer: string;
  distractors?: string[];
  hints?: string[];
  explanation?: string;
}

export default function QuestionEditPage() {
  const router = useRouter();
  const { id } = router.query;
  const { toast } = useToast();

  const handleSubmit = async (data: z.infer<typeof QuestionSchema>) => {
    try {
      // API call to update question
      await fetch(`/api/questions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      toast({
        title: 'Success',
        description: 'Question updated successfully',
      });
      
      router.push('/questions');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update question',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Question</h1>
      <form onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData);
        handleSubmit(data as z.infer<typeof QuestionSchema>);
      }} className="space-y-4">
        <div>
          <label className="block mb-2">Content</label>
          <Textarea name="content" required />
        </div>
        
        <div>
          <label className="block mb-2">Type</label>
          <Select name="type" required>
            <option value="multipleChoice">Multiple Choice</option>
            <option value="fillInBlank">Fill in the Blank</option>
            <option value="openEnded">Open Ended</option>
            <option value="mathematical">Mathematical</option>
          </Select>
        </div>
        
        <div>
          <label className="block mb-2">Difficulty</label>
          <Select name="difficulty" required>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </Select>
        </div>
        
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Save Changes
        </button>
      </form>
    </div>
  );
} 