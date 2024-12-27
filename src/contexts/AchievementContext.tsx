'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import AchievementNotification from '@/components/achievements/AchievementNotification';

interface Achievement {
  name: string;
  description: string;
  xpReward: number;
}

interface AchievementContextType {
  showAchievement: (achievement: Achievement) => void;
}

const AchievementContext = createContext<AchievementContextType | null>(null);

export function AchievementProvider({ children }: { children: ReactNode }) {
  const [currentAchievement, setCurrentAchievement] = useState<Achievement | null>(null);

  const showAchievement = (achievement: Achievement) => {
    setCurrentAchievement(achievement);
  };

  return (
    <AchievementContext.Provider value={{ showAchievement }}>
      {children}
      <AchievementNotification
        achievement={currentAchievement}
        onClose={() => setCurrentAchievement(null)}
      />
    </AchievementContext.Provider>
  );
}

export function useAchievement() {
  const context = useContext(AchievementContext);
  if (!context) {
    throw new Error('useAchievement must be used within an AchievementProvider');
  }
  return context;
} 
