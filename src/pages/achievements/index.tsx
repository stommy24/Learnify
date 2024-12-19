import { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { AchievementGrid } from '@/components/gamification/AchievementGrid';
import { LeaderboardTable } from '@/components/gamification/LeaderboardTable';
import { ProgressBadges } from '@/components/gamification/ProgressBadges';
import { ChallengesSection } from '@/components/gamification/ChallengesSection';

export default function Achievements() {
  const [achievements, setAchievements] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [activeChallenges, setActiveChallenges] = useState([]);

  useEffect(() => {
    const fetchGamificationData = async () => {
      try {
        const [achievementsRes, leaderboardRes, challengesRes] = await Promise.all([
          fetch('/api/achievements'),
          fetch('/api/leaderboard'),
          fetch('/api/challenges/active')
        ]);

        setAchievements(await achievementsRes.json());
        setLeaderboard(await leaderboardRes.json());
        setActiveChallenges(await challengesRes.json());
      } catch (error) {
        console.error('Error fetching gamification data:', error);
      }
    };

    fetchGamificationData();
  }, []);

  return (
    <MainLayout>
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Achievements & Challenges</h1>

        <ProgressBadges achievements={achievements} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <AchievementGrid achievements={achievements} />
          </div>
          <div>
            <LeaderboardTable data={leaderboard} />
          </div>
        </div>

        <ChallengesSection 
          challenges={activeChallenges}
          onJoinChallenge={async (challengeId) => {
            // Join challenge logic
          }}
        />
      </div>
    </MainLayout>
  );
} 