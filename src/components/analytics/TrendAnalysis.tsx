import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { format, subDays, subMonths } from 'date-fns';

interface TrendAnalysisProps {
  trends: {
    date: string;
    average: number;
  }[];
  timeRange: 'week' | 'month' | 'term' | 'year';
}

export const TrendAnalysis: React.FC<TrendAnalysisProps> = ({
  trends,
  timeRange
}) => {
  const formatDate = (date: string) => {
    switch (timeRange) {
      case 'week':
        return format(new Date(date), 'EEE');
      case 'month':
        return format(new Date(date), 'd MMM');
      case 'term':
      case 'year':
        return format(new Date(date), 'MMM yyyy');
      default:
        return date;
    }
  };

  const getGradientColors = () => {
    const trend = trends[trends.length - 1]?.average - trends[0]?.average;
    return trend >= 0 
      ? ['#10B981', '#34D399'] // green gradient for positive trend
      : ['#EF4444', '#F87171']; // red gradient for negative trend
  };

  const [startColor, endColor] = getGradientColors();

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-6">Performance Trends</h2>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trends}>
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={startColor} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={endColor} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tickFormatter={formatDate}
              interval="preserveStartEnd"
            />
            <YAxis domain={[0, 100]} />
            <Tooltip
              labelFormatter={value => formatDate(value as string)}
              formatter={value => [`${value}%`, 'Average Score']}
            />
            <Line
              type="monotone"
              dataKey="average"
              stroke={startColor}
              strokeWidth={2}
              dot={{ r: 4, fill: startColor }}
              activeDot={{ r: 6 }}
              fillOpacity={1}
              fill="url(#colorGradient)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between text-sm">
          <div className="text-gray-600">
            Period Average:
            <span className="ml-2 font-medium">
              {Math.round(
                trends.reduce((acc, curr) => acc + curr.average, 0) / trends.length
              )}%
            </span>
          </div>
          <div className="text-gray-600">
            Trend:
            <span className={`ml-2 font-medium ${
              trends[trends.length - 1]?.average - trends[0]?.average >= 0
                ? 'text-green-600'
                : 'text-red-600'
            }`}>
              {(trends[trends.length - 1]?.average - trends[0]?.average).toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}; 
