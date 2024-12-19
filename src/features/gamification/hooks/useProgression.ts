import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { addExperience, updateStreak } from '../progressionSlice';

export const useProgression = () => {
  const dispatch = useAppDispatch();
  const progression = useAppSelector(state => state.progression);

  const handleExperienceGain = (amount: number, source: string) => {
    // Log the experience gain for analytics
    console.log(`Experience gained: ${amount} from ${source}`);
    
    // Update the progression
    dispatch(addExperience(amount));
  };

  const checkDailyStreak = () => {
    dispatch(updateStreak(new Date().toISOString()));
  };

  const getLevel = () => progression.levels.current;
  const getExperience = () => progression.levels.experience;
  const getNextLevelProgress = () => {
    return (progression.levels.experience / progression.levels.nextLevelThreshold) * 100;
  };

  return {
    handleExperienceGain,
    checkDailyStreak,
    getLevel,
    getExperience,
    getNextLevelProgress,
    currentStreak: progression.streaks.current,
    bestStreak: progression.streaks.best,
    multiplier: progression.streaks.multiplier
  };
}; 