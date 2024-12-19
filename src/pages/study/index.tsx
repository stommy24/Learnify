import { MainLayout } from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';

export default function Study() {
  return (
    <MainLayout title="Study Session">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="aspect-video bg-neutral-background rounded-lg mb-6">
              {/* Video or interactive content */}
            </div>
            
            <h2 className="font-display text-2xl font-semibold mb-4">
              Introduction to Algebra
            </h2>
            
            <div className="prose max-w-none text-neutral-text-secondary">
              <p>
                Learn the fundamentals of algebra through interactive examples...
              </p>
            </div>

            <div className="mt-6 flex gap-4">
              <Button>Previous</Button>
              <Button variant="primary">Next Lesson</Button>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="font-display text-lg font-semibold mb-4">Your Progress</h3>
            <ProgressBar value={45} />
            <p className="mt-2 text-sm text-neutral-text-secondary">
              45% Complete
            </p>
          </Card>

          <Card className="p-6">
            <h3 className="font-display text-lg font-semibold mb-4">Course Contents</h3>
            <div className="space-y-2">
              {/* Course sections */}
              <div className="p-2 bg-primary-light/10 rounded-lg text-primary-dark">
                Current: Variables and Constants
              </div>
              <div className="p-2 hover:bg-neutral-background rounded-lg cursor-pointer">
                Next: Basic Operations
              </div>
              {/* Add more sections */}
            </div>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
} 