'use client';

import { motion } from 'framer-motion';
import { 
  Award, 
  BookOpen, 
  Clock, 
  Target, 
  Zap, 
  Users, 
  Star, 
  Trophy 
} from 'lucide-react';

const CATEGORY_ICONS = {
  LEARNING: BookOpen,
  DEDICATION: Clock,
  SOCIAL: Users,
  MILESTONES: Trophy,
  SPEED: Zap,
  ACHIEVEMENT: Award,
  MASTERY: Star,
  DEFAULT: Target
} as const;

interface AchievementIconProps {
  category: string;
  isUnlocked: boolean;
  size?: number;
}

export default function AchievementIcon({ 
  category, 
  isUnlocked, 
  size = 24 
}: AchievementIconProps) {
  const Icon = CATEGORY_ICONS[category as keyof typeof CATEGORY_ICONS] || CATEGORY_ICONS.DEFAULT;

  return (
    <motion.div
      initial={{ scale: 0.8 }}
      animate={{ scale: 1 }}
      className={`rounded-full p-2 ${
        isUnlocked 
          ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-white shadow-lg' 
          : 'bg-gray-100 text-gray-400'
      }`}
    >
      <Icon size={size} />
    </motion.div>
  );
} 
