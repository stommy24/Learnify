import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { 
  addCurrency, 
  addPowerUp, 
  usePowerUp, 
  addInventoryItem 
} from '../rewardsSlice';
import { updateProgress } from '../achievementsSlice';
import { useProgression } from './useProgression';

export const useRewards = () => {
  const dispatch = useAppDispatch();
  const rewards = useAppSelector(state => state.rewards);
  const achievements = useAppSelector(state => state.achievements);
  const { handleExperienceGain } = useProgression();

  const grantReward = (reward: {
    experience?: number;
    currency?: { stars?: number; gems?: number };
    powerUps?: Array<{ id: string; type: string; quantity: number }>;
    items?: Array<{ type: 'avatars' | 'badges' | 'themes'; itemId: string }>;
  }) => {
    if (reward.experience) {
      handleExperienceGain(reward.experience, 'reward');
    }

    if (reward.currency) {
      dispatch(addCurrency(reward.currency));
    }

    if (reward.powerUps) {
      reward.powerUps.forEach(powerUp => {
        dispatch(addPowerUp(powerUp));
      });
    }

    if (reward.items) {
      reward.items.forEach(item => {
        dispatch(addInventoryItem(item));
      });
    }
  };

  const checkAchievement = (achievementId: string, progress: number) => {
    dispatch(updateProgress({ achievementId, progress }));
    
    const achievement = achievements.achievements[achievementId];
    if (achievement?.completed) {
      grantReward(achievement.rewards);
    }
  };

  return {
    currency: rewards.currency,
    powerUps: rewards.powerUps,
    inventory: rewards.inventory,
    grantReward,
    checkAchievement,
    usePowerUp: (powerUpId: string) => dispatch(usePowerUp(powerUpId))
  };
}; 