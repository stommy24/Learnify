import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { 
  setDailyChallenges, 
  updateChallengeProgress 
} from '../challengesSlice';
import { ChallengeGenerator } from '../../../services/challengeGenerator';
import { useRewards } from './useRewards';

export const useChallenges = (yearGroup: number) => {
  const dispatch = useAppDispatch();
  const challenges = useAppSelector(state => state.challenges);
  const { grantReward } = useRewards();

  useEffect(() => {
    checkAndRefreshChallenges();
  }, []);

  const checkAndRefreshChallenges = () => {
    const now = new Date();
    const lastDaily = challenges.lastRefresh.daily ? 
      new Date(challenges.lastRefresh.daily) : null;

    if (!lastDaily || !isSameDay(now, lastDaily)) {
      const newDailyChallenges = ChallengeGenerator.generateDailyChallenges(
        yearGroup,
        ['mathematics', 'english', 'general']
      );
      dispatch(setDailyChallenges(newDailyChallenges));
    }
  };

  const updateProgress = (challengeId: string, progress: number) => {
    dispatch(updateChallengeProgress({ challengeId, progress }));

    // Check if challenge was completed and grant rewards
    const challenge = [...challenges.dailyChallenges, 
                      ...challenges.weeklyChallenges, 
                      ...challenges.specialChallenges]
                      .find(c => c.id === challengeId);

    if (challenge?.completed) {
      grantReward({
        currency: {
          stars: challenge.rewards.stars,
          gems: challenge.rewards.gems
        },
        experience: challenge.rewards.experience,
        powerUps: challenge.rewards.powerUp ? [{
          id: challenge.rewards.powerUp,
          type: challenge.rewards.powerUp,
          quantity: 1
        }] : undefined
      });
    }
  };

  return {
    dailyChallenges: challenges.dailyChallenges,
    weeklyChallenges: challenges.weeklyChallenges,
    specialChallenges: challenges.specialChallenges,
    updateProgress
  };
};

const isSameDay = (date1: Date, date2: Date) => {
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate();
}; 