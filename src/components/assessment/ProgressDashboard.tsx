import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { ProgressTracker } from '@/lib/assessment/progressTracking';
import { LineChart, BarChart } from '@/components/ui/charts';

export function ProgressDashboard({ studentId }: { studentId: string }) {
  const [metrics, setMetrics] = useState<any>(null);
  const [timeframe, setTimeframe] = useState<'day' | 'week' | 'month'>('week');
  const progressTracker = new ProgressTracker();

  useEffect(() => {
    const loadMetrics = async () => {
      const data = await progressTracker.calculateStudentProgress(
        studentId,
        'math', // or 'english'
        timeframe
      );
      setMetrics(data);
    };
    loadMetrics();
  }, [studentId, timeframe]);

  if (!metrics) return <div>Loading...</div>;

  return (
    <div className="space-y-6 p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Accuracy</h3>
          <Progress value={metrics.accuracy * 100} />
          <p className="text-sm text-muted-foreground mt-2">
            {(metrics.accuracy * 100).toFixed(1)}% correct
          </p>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Speed</h3>
          <Progress value={metrics.speed * 100} />
          <p className="text-sm text-muted-foreground mt-2">
            {metrics.speed.toFixed(1)}x target speed
          </p>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Mastery</h3>
          <Progress value={metrics.masteryLevel * 100} />
          <p className="text-sm text-muted-foreground mt-2">
            Level {metrics.masteryLevel}
          </p>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Progress Over Time</h3>
          <LineChart data={metrics.progressData} />
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Topic Performance</h3>
          <BarChart data={metrics.topicData} />
        </Card>
      </div>
    </div>
  );
} 


