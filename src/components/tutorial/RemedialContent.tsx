import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AnimationComponent } from './AnimationComponent';
import { RemedialSystem } from '@/lib/tutorial/remedialSystem';

export function RemedialContent({
  studentId,
  assessmentResults,
  onComplete
}: {
  studentId: string;
  assessmentResults: any;
  onComplete: () => void;
}) {
  const [content, setContent] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const remedialSystem = new RemedialSystem();

  useEffect(() => {
    const loadContent = async () => {
      const plan = await remedialSystem.generateRemedialPlan(
        studentId,
        assessmentResults
      );
      setContent(plan);
    };
    loadContent();
  }, [studentId, assessmentResults]);

  const handleNext = () => {
    if (currentIndex < content.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  if (!content.length) return <div>Loading...</div>;

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <div className="space-y-6">
        <h3 className="text-lg font-semibold">
          Additional Practice - {content[currentIndex].type}
        </h3>

        <div className="prose dark:prose-invert">
          <p>{content[currentIndex].content.explanation}</p>
        </div>

        {content[currentIndex].content.animation && (
          <AnimationComponent
            steps={content[currentIndex].content.animation}
          />
        )}

        <div className="flex justify-end space-x-4">
          <Button
            variant="outline"
            onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
            disabled={currentIndex === 0}
          >
            Previous
          </Button>
          <Button onClick={handleNext}>
            {currentIndex === content.length - 1 ? 'Complete' : 'Next'}
          </Button>
        </div>
      </div>
    </Card>
  );
} 