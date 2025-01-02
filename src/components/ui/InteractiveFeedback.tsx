'use client';

import { motion } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface FeedbackProps {
  type: 'success' | 'error' | 'info';
  message: string;
  onDismiss?: () => void;
}

export default function InteractiveFeedback({
  type,
  message,
  onDismiss
}: FeedbackProps) {
  const icons = {
    success: CheckCircle,
    error: XCircle,
    info: AlertCircle
  };

  const colors = {
    success: 'bg-green-50 text-green-800 border-green-200',
    error: 'bg-red-50 text-red-800 border-red-200',
    info: 'bg-blue-50 text-blue-800 border-blue-200'
  };

  const Icon = icons[type];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`
        p-4 rounded-lg border
        flex items-center space-x-3
        ${colors[type]}
      `}
    >
      <Icon className="w-5 h-5" />
      <p className="flex-1">{message}</p>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-gray-500 hover:text-gray-700"
        >
          Dismiss
        </button>
      )}
    </motion.div>
  );
} 