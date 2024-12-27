import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';
import type { GenerationRequest, GenerationStatus } from '@/types/generation';

const generationSchema = z.object({
  curriculum: z.object({
    subject: z.enum(['mathematics', 'english']),
    keyStage: z.number().min(1).max(4),
    year: z.number().min(1).max(6),
    term: z.number().min(1).max(3),
    topic: z.string().min(1),
    unit: z.string().min(1),
    learningObjectives: z.array(z.string())
  }),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  count: z.number().min(1).max(10),
  preferences: z.object({
    includeHints: z.boolean(),
    includeExplanations: z.boolean()
  })
});

type GenerationFormData = z.infer<typeof generationSchema>;

export default function GenerateQuestionsPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [requestId, setRequestId] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<GenerationFormData>({
    resolver: zodResolver(generationSchema),
    defaultValues: {
      curriculum: {
        subject: 'mathematics',
        keyStage: 1,
        year: 1,
        term: 1,
        topic: '',
        unit: '',
        learningObjectives: []
      },
      difficulty: 'medium',
      count: 5,
      preferences: {
        includeHints: true,
        includeExplanations: true
      }
    }
  });

  const onSubmit = async (data: GenerationFormData) => {
    try {
      setIsGenerating(true);
      const response = await fetch('/api/questions/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!response.ok) throw new Error('Failed to generate questions');

      const result = await response.json();
      setRequestId(result.requestId);
      toast({
        title: 'Generation Started',
        description: 'Your questions are being generated...',
        duration: 5000
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to start question generation',
        duration: 5000
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-bold">Generate Questions</h1>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Select
              label="Subject"
              options={[
                { value: 'mathematics', label: 'Mathematics' },
                { value: 'english', label: 'English' }
              ]}
              {...form.register('curriculum.subject')}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate Questions'
              )}
            </Button>
          </form>
        </CardContent>

        {requestId && (
          <CardFooter>
            <GenerationStatus requestId={requestId} />
          </CardFooter>
        )}
      </Card>
    </div>
  );
}

function GenerationStatus({ requestId }: { requestId: string }) {
  const [status, setStatus] = useState<GenerationStatus | null>(null);

  // Add status polling logic here
  
  return (
    <div className="w-full">
      {/* Add status display UI */}
    </div>
  );
} 


