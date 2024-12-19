import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Card,
  CardHeader,
  CardContent,
  CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import { GenerationRequest } from '@/services/question-generation/types';

const generationSchema = z.object({
  curriculum: z.object({
    subject: z.enum(['mathematics', 'english']),
    keyStage: z.number().min(1).max(2),
    year: z.number().min(1).max(6),
    term: z.number().min(1).max(3),
    topic: z.string().min(1),
    learningObjectives: z.array(z.string())
  }),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  count: z.number().min(1).max(10),
  preferences: z.object({
    includeHints: z.boolean(),
    includeExplanations: z.boolean()
  })
});

export default function GenerateQuestionsPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [requestId, setRequestId] = useState<string | null>(null);
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof generationSchema>>({
    resolver: zodResolver(generationSchema),
    defaultValues: {
      curriculum: {
        subject: 'mathematics',
        keyStage: 1,
        year: 1,
        term: 1,
        topic: '',
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

  const onSubmit = async (data: z.infer<typeof generationSchema>) => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/questions/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!response.ok) throw new Error('Generation failed');

      const result = await response.json();
      setRequestId(result.requestId);
      toast({
        title: 'Generation Started',
        description: 'Your questions are being generated. You can track the progress.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to start question generation',
        variant: 'destructive'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <h1 className="text-2xl font-bold">Generate Questions</h1>
          <p className="text-muted-foreground">
            Configure your question generation settings
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <Select
                label="Subject"
                {...form.register('curriculum.subject')}
                options={[
                  { value: 'mathematics', label: 'Mathematics' },
                  { value: 'english', label: 'English' }
                ]}
              />

              <div className="grid grid-cols-3 gap-4">
                <Select
                  label="Key Stage"
                  {...form.register('curriculum.keyStage')}
                  options={[
                    { value: 1, label: 'KS1' },
                    { value: 2, label: 'KS2' }
                  ]}
                />

                <Select
                  label="Year"
                  {...form.register('curriculum.year')}
                  options={[1,2,3,4,5,6].map(year => ({
                    value: year,
                    label: `Year ${year}`
                  }))}
                />

                <Select
                  label="Term"
                  {...form.register('curriculum.term')}
                  options={[1,2,3].map(term => ({
                    value: term,
                    label: `Term ${term}`
                  }))}
                />
              </div>

              <Input
                label="Topic"
                {...form.register('curriculum.topic')}
                placeholder="Enter topic name"
              />

              <Select
                label="Difficulty"
                {...form.register('difficulty')}
                options={[
                  { value: 'easy', label: 'Easy' },
                  { value: 'medium', label: 'Medium' },
                  { value: 'hard', label: 'Hard' }
                ]}
              />

              <Input
                type="number"
                label="Number of Questions"
                {...form.register('count')}
                min={1}
                max={10}
              />

              <div className="space-y-2">
                <Checkbox
                  label="Include Hints"
                  {...form.register('preferences.includeHints')}
                />
                <Checkbox
                  label="Include Explanations"
                  {...form.register('preferences.includeExplanations')}
                />
              </div>
            </div>

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