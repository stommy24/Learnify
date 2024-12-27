import { AssessmentResult } from '@/lib/types/assessment';
import { LearningProgress } from '@/types/progress';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface Props {
  progress: LearningProgress;
}

export function ProgressChart({ progress }: Props) {
  const chartData = progress.results.map((result: AssessmentResult) => ({
    date: result.timestamp ? new Date(result.timestamp).toLocaleDateString() : new Date().toLocaleDateString(),
    score: result.score,
    topic: result.question.topic
  }));

  return (
    <LineChart width={600} height={300} data={chartData}>
      <Line type="monotone" dataKey="score" stroke="#8884d8" />
      <CartesianGrid stroke="#ccc" />
      <XAxis dataKey="date" />
      <YAxis />
      <Tooltip />
    </LineChart>
  );
} 
