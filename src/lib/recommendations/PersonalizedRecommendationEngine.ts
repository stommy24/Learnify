interface LearningItem {
  id: string;
  type: 'topic' | 'exercise' | 'project' | 'assessment';
  subject: string;
  difficulty: number;
  prerequisites: string[];
  tags: string[];
  estimatedTime: number;
  metadata: {
    format: string;
    interactivityLevel: number;
    visualElements: number;
    practicalApplication: number;
  };
}

interface UserProfile {
  learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'reading/writing';
  preferredDifficulty: number;
  interests: string[];
  strengths: string[];
  weaknesses: string[];
  completedItems: string[];
  averageSessionDuration: number;
  preferredTimes: string[];
  engagementMetrics: {
    formatPreferences: Record<string, number>;
    completionRates: Record<string, number>;
    timeSpentDistribution: Record<string, number>;
  };
}

export class PersonalizedRecommendationEngine {
  private static instance: PersonalizedRecommendationEngine;
  private readonly SIMILARITY_THRESHOLD = 0.7;
  private readonly MAX_RECOMMENDATIONS = 10;

  private constructor() {}

  static getInstance(): PersonalizedRecommendationEngine {
    if (!PersonalizedRecommendationEngine.instance) {
      PersonalizedRecommendationEngine.instance = new PersonalizedRecommendationEngine();
    }
    return PersonalizedRecommendationEngine.instance;
  }

  async getRecommendations(
    userId: string,
    userProfile: UserProfile,
    availableItems: LearningItem[]
  ): Promise<{
    recommendations: LearningItem[];
    explanations: Record<string, string>;
    confidence: Record<string, number>;
  }> {
    // Filter out completed items
    const eligibleItems = availableItems.filter(
      item => !userProfile.completedItems.includes(item.id)
    );

    // Calculate scores for each item
    const scoredItems = eligibleItems.map(item => ({
      item,
      score: this.calculateRecommendationScore(item, userProfile),
      explanation: this.generateExplanation(item, userProfile)
    }));

    // Sort by score and take top recommendations
    const topRecommendations = scoredItems
      .sort((a, b) => b.score - a.score)
      .slice(0, this.MAX_RECOMMENDATIONS);

    return {
      recommendations: topRecommendations.map(r => r.item),
      explanations: topRecommendations.reduce((acc, r) => ({
        ...acc,
        [r.item.id]: r.explanation
      }), {}),
      confidence: topRecommendations.reduce((acc, r) => ({
        ...acc,
        [r.item.id]: r.score
      }), {})
    };
  }

  private calculateRecommendationScore(
    item: LearningItem,
    profile: UserProfile
  ): number {
    let score = 0;
    const weights = {
      learningStyle: 0.25,
      difficulty: 0.2,
      interests: 0.15,
      prerequisites: 0.15,
      engagement: 0.15,
      timeAlignment: 0.1
    };

    // Learning style alignment
    score += weights.learningStyle * this.calculateLearningStyleScore(
      item,
      profile.learningStyle
    );

    // Difficulty alignment
    score += weights.difficulty * this.calculateDifficultyScore(
      item.difficulty,
      profile.preferredDifficulty
    );

    // Interest alignment
    score += weights.interests * this.calculateInterestScore(
      item.tags,
      profile.interests
    );

    // Prerequisites and knowledge gaps
    score += weights.prerequisites * this.calculatePrerequisiteScore(
      item,
      profile
    );

    // Engagement potential
    score += weights.engagement * this.calculateEngagementScore(
      item,
      profile.engagementMetrics
    );

    // Time alignment
    score += weights.timeAlignment * this.calculateTimeAlignmentScore(
      item.estimatedTime,
      profile.averageSessionDuration
    );

    return score;
  }

  private calculateLearningStyleScore(
    item: LearningItem,
    learningStyle: UserProfile['learningStyle']
  ): number {
    const styleScores = {
      visual: item.metadata.visualElements / 10,
      auditory: item.metadata.format === 'audio' ? 1 : 0,
      kinesthetic: item.metadata.interactivityLevel / 10,
      'reading/writing': item.metadata.format === 'text' ? 1 : 0
    };

    return styleScores[learningStyle] || 0;
  }

  private calculateDifficultyScore(
    itemDifficulty: number,
    preferredDifficulty: number
  ): number {
    const diff = Math.abs(itemDifficulty - preferredDifficulty);
    return Math.max(0, 1 - diff / 5);
  }

  private calculateInterestScore(
    itemTags: string[],
    userInterests: string[]
  ): number {
    const matchingTags = itemTags.filter(tag => 
      userInterests.includes(tag)
    ).length;
    return matchingTags / Math.max(itemTags.length, userInterests.length);
  }

  private calculatePrerequisiteScore(
    item: LearningItem,
    profile: UserProfile
  ): number {
    const prerequisitesMet = item.prerequisites.every(
      prereq => profile.completedItems.includes(prereq)
    );
    
    if (!prerequisitesMet) return 0;

    const strengthAlignment = item.tags.some(
      tag => profile.weaknesses.includes(tag)
    ) ? 1 : 0.5;

    return strengthAlignment;
  }

  private calculateEngagementScore(
    item: LearningItem,
    engagementMetrics: UserProfile['engagementMetrics']
  ): number {
    const formatScore = engagementMetrics.formatPreferences[item.metadata.format] || 0;
    const completionScore = engagementMetrics.completionRates[item.type] || 0;
    
    return (formatScore + completionScore) / 2;
  }

  private calculateTimeAlignmentScore(
    itemDuration: number,
    averageSessionDuration: number
  ): number {
    const durationRatio = itemDuration / averageSessionDuration;
    return durationRatio <= 1.2 ? 1 : Math.max(0, 1.5 - durationRatio);
  }

  private generateExplanation(
    item: LearningItem,
    profile: UserProfile
  ): string {
    const reasons: string[] = [];

    // Learning style alignment
    if (this.calculateLearningStyleScore(item, profile.learningStyle) > 0.7) {
      reasons.push(`Matches your ${profile.learningStyle} learning style`);
    }

    // Difficulty
    const diffScore = this.calculateDifficultyScore(
      item.difficulty,
      profile.preferredDifficulty
    );
    if (diffScore > 0.8) {
      reasons.push('Aligned with your skill level');
    }

    // Interests
    const interestScore = this.calculateInterestScore(item.tags, profile.interests);
    if (interestScore > 0.5) {
      reasons.push('Related to your interests');
    }

    // Knowledge gaps
    if (item.tags.some(tag => profile.weaknesses.includes(tag))) {
      reasons.push('Helps strengthen areas for improvement');
    }

    return reasons.join(' • ');
  }
}

export const usePersonalizedRecommendations = () => {
  const engine = PersonalizedRecommendationEngine.getInstance();
  return {
    getRecommendations: engine.getRecommendations.bind(engine)
  };
}; 