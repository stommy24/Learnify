interface AchievementTier {
  level: number;
  requirements: {
    type: string;
    value: number;
  }[];
  rewards: {
    type: string;
    value: any;
  }[];
}

interface ProgressionTrack {
  id: string;
  name: string;
  description: string;
  tiers: AchievementTier[];
  currentProgress: number;
  currentTier: number;
}

export class AchievementProgressionSystem {
  private static instance: AchievementProgressionSystem;
  private tracks: Map<string, ProgressionTrack> = new Map();
  private userProgress: Map<string, Map<string, number>> = new Map();

  private constructor() {
    this.initializeProgressionTracks();
  }

  static getInstance(): AchievementProgressionSystem {
    if (!AchievementProgressionSystem.instance) {
      AchievementProgressionSystem.instance = new AchievementProgressionSystem();
    }
    return AchievementProgressionSystem.instance;
  }

  private initializeProgressionTracks() {
    const defaultTracks: ProgressionTrack[] = [
      {
        id: 'learning_mastery',
        name: 'Learning Mastery',
        description: 'Master various subjects and topics',
        tiers: [
          {
            level: 1,
            requirements: [{ type: 'topics_completed', value: 5 }],
            rewards: [{ type: 'badge', value: 'novice_learner' }]
          },
          {
            level: 2,
            requirements: [{ type: 'topics_completed', value: 15 }],
            rewards: [{ type: 'badge', value: 'intermediate_learner' }]
          },
          // Add more tiers...
        ],
        currentProgress: 0,
        currentTier: 0
      },
      // Add more tracks...
    ];

    defaultTracks.forEach(track => {
      this.tracks.set(track.id, track);
    });
  }

  async updateProgress(
    userId: string,
    trackId: string,
    progress: number
  ): Promise<{
    newTier?: AchievementTier;
    rewards?: any[];
    nextMilestone?: number;
  }> {
    const track = this.tracks.get(trackId);
    if (!track) throw new Error('Invalid progression track');

    const userTrackProgress = this.getUserProgress(userId, trackId);
    const updatedProgress = userTrackProgress + progress;
    
    // Update progress
    if (!this.userProgress.has(userId)) {
      this.userProgress.set(userId, new Map());
    }
    this.userProgress.get(userId)!.set(trackId, updatedProgress);

    // Check for tier advancement
    const currentTier = track.tiers[track.currentTier];
    const nextTier = track.tiers[track.currentTier + 1];
    
    if (nextTier && this.meetsRequirements(updatedProgress, nextTier.requirements)) {
      track.currentTier++;
      track.currentProgress = updatedProgress;
      
      // Grant rewards
      const rewards = await this.grantRewards(userId, nextTier.rewards);
      
      return {
        newTier: nextTier,
        rewards,
        nextMilestone: this.getNextMilestone(track, updatedProgress)
      };
    }

    return {
      nextMilestone: this.getNextMilestone(track, updatedProgress)
    };
  }

  private getUserProgress(userId: string, trackId: string): number {
    return this.userProgress.get(userId)?.get(trackId) || 0;
  }

  private meetsRequirements(
    progress: number,
    requirements: AchievementTier['requirements']
  ): boolean {
    return requirements.every(req => progress >= req.value);
  }

  private async grantRewards(
    userId: string,
    rewards: AchievementTier['rewards']
  ): Promise<any[]> {
    // Implement reward granting logic
    return rewards;
  }

  private getNextMilestone(track: ProgressionTrack, currentProgress: number): number {
    const nextTier = track.tiers[track.currentTier + 1];
    if (!nextTier) return currentProgress;

    const nextRequirement = nextTier.requirements[0];
    return nextRequirement.value;
  }

  async getProgressionStatus(
    userId: string,
    trackId: string
  ): Promise<{
    track: ProgressionTrack;
    progress: number;
    nextMilestone: number;
    percentage: number;
  }> {
    const track = this.tracks.get(trackId);
    if (!track) throw new Error('Invalid progression track');

    const progress = this.getUserProgress(userId, trackId);
    const nextMilestone = this.getNextMilestone(track, progress);
    
    return {
      track,
      progress,
      nextMilestone,
      percentage: (progress / nextMilestone) * 100
    };
  }
}

export const useAchievementProgression = () => {
  const progression = AchievementProgressionSystem.getInstance();
  return {
    updateProgress: progression.updateProgress.bind(progression),
    getProgressionStatus: progression.getProgressionStatus.bind(progression)
  };
}; 