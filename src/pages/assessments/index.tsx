import { MainLayout } from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';

export default function Assessments() {
  return (
    <MainLayout title="Assessments">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6 space-y-4">
          <h3 className="font-display font-semibold text-lg">Math Quiz</h3>
          <p className="text-neutral-text-secondary">Test your mathematics knowledge</p>
          <Button className="w-full">Start Assessment</Button>
        </Card>
        {/* Add more assessment cards */}
      </div>
    </MainLayout>
  );
} 


