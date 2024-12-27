import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../common/Card';

interface FeedbackItem {
  type: 'success' | 'warning' | 'info' | 'error';
  message: string;
  detail?: string;
  actionable?: {
    text: string;
    action: () => void;
  };
}

interface PerformanceMetrics {
  accuracy: number;
  speed: number;
  consistency: number;
  difficultyHandling: number;
}

export const PerformanceFeedback: React.FC<{
  metrics: PerformanceMetrics;
  feedback: FeedbackItem[];
  onActionTaken?: (actionType: string) => void;
}> = ({ metrics, feedback, onActionTaken }) => {
  const getFeedbackColor = (type: FeedbackItem['type']) => {
    switch (type) {
      case 'success': return 'bg-green-50 border-green-200 text-green-700';
      case 'warning': return 'bg-yellow-50 border-yellow-200 text-yellow-700';
      case 'info': return 'bg-blue-50 border-blue-200 text-blue-700';
      case 'error': return 'bg-red-50 border-red-200 text-red-700';
    }
  };

  const getMetricColor = (value: number) => {
    if (value >= 80) return 'text-green-600';
    if (value >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Performance Metrics */}
      <Card>
        <h3 className="text-lg font-medium mb-4">Performance Overview</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(metrics).map(([key, value]) => (
            <div key={key} className="text-center">
              <div className="text-sm text-gray-500 mb-1">
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </div>
              <div className={`text-2xl font-bold ${getMetricColor(value)}`}>
                {Math.round(value)}%
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Detailed Feedback */}
      <div className="space-y-4">
        {feedback.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`${getFeedbackColor(item.type)} border`}>
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{item.message}</p>
                  {item.detail && (
                    <p className="text-sm mt-1 opacity-80">{item.detail}</p>
                  )}
                </div>
                {item.actionable && (
                  <button
                    onClick={() => {
                      item.actionable?.action();
                      onActionTaken?.(item.message);
                    }}
                    className="text-sm font-medium underline hover:opacity-80"
                  >
                    {item.actionable.text}
                  </button>
                )}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}; 
