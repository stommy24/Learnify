'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award } from 'lucide-react';

interface AchievementNotificationProps {
  achievement: {
    name: string;
    description: string;
    xpReward: number;
  } | null;
  onClose: () => void;
}

export default function AchievementNotification({ 
  achievement, 
  onClose 
}: AchievementNotificationProps) {
  useEffect(() => {
    if (achievement) {
      const timer = setTimeout(onClose, 5000);
      return () => clearTimeout(timer);
    }
  }, [achievement, onClose]);

  return (
    <AnimatePresence>
      {achievement && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 border border-blue-100 max-w-sm"
        >
          <div className="flex items-start gap-4">
            <div className="bg-blue-100 rounded-full p-2">
              <Award className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                Achievement Unlocked!
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {achievement.name}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {achievement.description}
              </p>
              <p className="text-sm font-medium text-blue-600 mt-2">
                +{achievement.xpReward} XP
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 
