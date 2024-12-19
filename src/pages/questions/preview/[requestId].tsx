import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Question } from '@/services/question-generation/types';
import { 
  Card,
  CardHeader,
  CardContent,
  CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronLeft, 
  ChevronRight,
  Save,
  Edit2,
  Trash2,
  Download
} from 'lucide-react';

export default function QuestionPreviewPage() {
  const router = useRouter();
  const { requestId } = router.query;
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      if (!requestId) return;

      try {
        const response = await fetch(`/api/questions/status/${requestId}`);
        if (!response.ok) throw new Error('Failed to fetch questions');
        
        const data = await response.json();
        if (data.status === 'completed' && data.result) {
          setQuestions(data.result);
        } else {
          throw new Error('Questions not available');
        }
      } catch (err) {
        setError('Failed to load questions');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [requestId]);

  const currentQuestion = questions[currentIndex];

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSave = async () => {
    try {
      await fetch('/api/questions/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(questions)
      });
      // Handle success
    } catch (error) {
      // Handle error
    }
  };

  const handleEdit = (questionId: string) => {
    router.push(`/questions/edit/${questionId}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Question Preview</h1>
            <p className="text-muted-foreground">
              Generated Questions ({currentIndex + 1} of {questions.length})
            </p>
          </div>
          <div className="space-x-2">
            <Button variant="outline" onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Save All
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {currentQuestion && (
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Badge>{currentQuestion.type}</Badge>
                <Badge variant="outline">
                  {currentQuestion.metadata.difficulty}
                </Badge>
              </div>

              <Tabs defaultValue="question">
                <TabsList>
                  <TabsTrigger value="question">Question</TabsTrigger>
                  <TabsTrigger value="answer">Answer</TabsTrigger>
                  {currentQuestion.hints && (
                    <TabsTrigger value="hints">Hints</TabsTrigger>
                  )}
                  {currentQuestion.explanation && (
                    <TabsTrigger value="explanation">Explanation</TabsTrigger>
                  )}
                </TabsList>

                <TabsContent value="question" className="mt-4">
                  <div className="prose max-w-none">
                    {currentQuestion.content}
                  </div>
                </TabsContent>

                <TabsContent value="answer" className="mt-4">
                  <div className="prose max-w-none">
                    {currentQuestion.answer}
                  </div>
                </TabsContent>

                {currentQuestion.hints && (
                  <TabsContent value="hints" className="mt-4">
                    <ul className="list-disc pl-4 space-y-2">
                      {currentQuestion.hints.map((hint, index) => (
                        <li key={index}>{hint}</li>
                      ))}
                    </ul>
                  </TabsContent>
                )}

                {currentQuestion.explanation && (
                  <TabsContent value="explanation" className="mt-4">
                    <div className="prose max-w-none">
                      {currentQuestion.explanation}
                    </div>
                  </TabsContent>
                )}
              </Tabs>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <div className="space-x-2">
            <Button
              variant="outline"
              onClick={() => handleEdit(currentQuestion.id)}
            >
              <Edit2 className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button variant="destructive">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>

          <Button
            variant="outline"
            onClick={handleNext}
            disabled={currentIndex === questions.length - 1}
          >
            Next
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
} 