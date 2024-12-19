import { MainLayout } from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Button } from '@/components/ui/Button';
import { 
  AcademicCapIcon, 
  ClockIcon, 
  FireIcon 
} from '@heroicons/react/24/outline';

export default function Dashboard() {
  return (
    <MainLayout title="Dashboard">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary-light/10 rounded-lg">
              <FireIcon className="h-6 w-6 text-primary-main" />
            </div>
            <div>
              <p className="text-neutral-text-secondary">Daily Streak</p>
              <h3 className="text-2xl font-semibold text-neutral-text-primary">7 Days</h3>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-secondary-light/10 rounded-lg">
              <AcademicCapIcon className="h-6 w-6 text-secondary-main" />
            </div>
            <div>
              <p className="text-neutral-text-secondary">Courses Completed</p>
              <h3 className="text-2xl font-semibold text-neutral-text-primary">12</h3>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-accent-yellow/10 rounded-lg">
              <ClockIcon className="h-6 w-6 text-accent-yellow" />
            </div>
            <div>
              <p className="text-neutral-text-secondary">Study Time</p>
              <h3 className="text-2xl font-semibold text-neutral-text-primary">24h</h3>
            </div>
          </div>
        </Card>
      </div>

      {/* Current Progress */}
      <Card className="p-6 mb-8">
        <h2 className="font-display text-xl font-semibold mb-4">Current Progress</h2>
        <ProgressBar value={65} />
        <p className="mt-2 text-neutral-text-secondary">You're 65% through your current course</p>
      </Card>

      {/* Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="font-display text-xl font-semibold mb-4">Recent Activities</h2>
          <div className="space-y-4">
            {/* Activity items */}
            <div className="flex items-center gap-4 p-3 bg-neutral-background rounded-lg">
              <div className="p-2 bg-primary-light/10 rounded-md">
                <AcademicCapIcon className="h-5 w-5 text-primary-main" />
              </div>
              <div>
                <p className="font-medium text-neutral-text-primary">Completed Math Quiz</p>
                <p className="text-sm text-neutral-text-secondary">2 hours ago</p>
              </div>
            </div>
            {/* Add more activity items */}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="font-display text-xl font-semibold mb-4">Recommended</h2>
          <div className="space-y-4">
            {/* Recommended courses */}
            <div className="flex items-center gap-4 p-3 bg-neutral-background rounded-lg">
              <div className="p-2 bg-secondary-light/10 rounded-md">
                <AcademicCapIcon className="h-5 w-5 text-secondary-main" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-neutral-text-primary">Advanced Mathematics</p>
                <p className="text-sm text-neutral-text-secondary">Next recommended course</p>
              </div>
              <Button size="sm">Start</Button>
            </div>
            {/* Add more recommendations */}
          </div>
        </Card>
      </div>
    </MainLayout>
  );
} 