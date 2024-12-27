import { MainLayout } from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/card';
import { ProgressBar } from '@/components/ui/ProgressBar';

export default function LearningPath() {
  return (
    <MainLayout title="Your Learning Path">
      <div className="space-y-8">
        <Card className="p-6">
          <h2 className="font-display text-xl font-semibold mb-4">Current Progress</h2>
          <ProgressBar value={65} />
          <p className="mt-2 text-neutral-text-secondary">You're making great progress!</p>
        </Card>

        <div className="space-y-4">
          {/* Learning path milestones */}
          <div className="relative pl-8 border-l-2 border-primary-light">
            {/* Add milestone components */}
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 


