import { DifficultyLevel, AgeGroup } from '@/types/rbac';

interface LearningPattern {
  preferredSubjects: string[];
  completedTopics: string[];
  averagePerformance: number;
  learningPace: 'fast' | 'medium' | 'slow';
  strugglingTopics: string[];
  strengths: string[];
}

interface ContentItem {
  id: string;
  title: string;
  subject: string;
  topics: string[];
  difficulty: DifficultyLevel;
  ageGroups: AgeGroup[];
  prerequisites: string[];
  estimatedDuration: number;
  metadata: {
    format: 'video' | 'interactive' | 'text' | 'quiz';
    engagement: number;
    completionRate: number;
  };
}

export class ContentRecommender {
  private static instance: ContentRecommender;

  private constructor() {}

  static getInstance(): ContentRecommender {
    if (!ContentRecommender.instance) {
      ContentRecommender.instance = new ContentRecommender();
    }
    return ContentRecommender.instance;
  }

  async getRecommendations(
    userId: string,
    learningPattern: LearningPattern,
    currentContent: ContentItem[]
  ): Promise<ContentItem[]> {
    // Get personalized recommendations
    const recommendations = await this.generatePersonalizedRecommendations(
      learningPattern,
      currentContent
    );

    // Filter by difficulty progression
    const filteredRecommendations = this.filterByDifficultyProgression(
      recommendations,
      learningPattern
    );

    // Sort by relevance
    return this.sortByRelevance(filteredRecommendations, learningPattern);
  }

  private async generatePersonalizedRecommendations(
    pattern: LearningPattern,
    available: ContentItem[]
  ): Promise<ContentItem[]> {
    // Filter out completed content
    const newContent = available.filter(
      item => !pattern.completedTopics.includes(item.id)
    );

    // Prioritize struggling topics
    const strugglingContent = newContent.filter(
      item => pattern.strugglingTopics.some(topic => item.topics.includes(topic))
    );

    // Include content that builds on strengths
    const strengthContent = newContent.filter(
      item => pattern.strengths.some(topic => item.prerequisites.includes(topic))
    );

    return [...strugglingContent, ...strengthContent, ...newContent];
  }

  private filterByDifficultyProgression(
    content: ContentItem[],
    pattern: LearningPattern
  ): ContentItem[] {
    const performanceBasedDifficulty = Math.ceil(pattern.averagePerformance * 5);
    
    return content.filter(item => {
      const difficultyDiff = item.difficulty - performanceBasedDifficulty;
      return difficultyDiff >= -1 && difficultyDiff <= 1;
    });
  }

  private sortByRelevance(
    content: ContentItem[],
    pattern: LearningPattern
  ): ContentItem[] {
    return content.sort((a, b) => {
      // Calculate relevance scores
      const scoreA = this.calculateRelevanceScore(a, pattern);
      const scoreB = this.calculateRelevanceScore(b, pattern);
      return scoreB - scoreA;
    });
  }

  private calculateRelevanceScore(
    item: ContentItem,
    pattern: LearningPattern
  ): number {
    let score = 0;

    // Preferred subject bonus
    if (pattern.preferredSubjects.includes(item.subject)) {
      score += 2;
    }

    // Struggling topic priority
    if (pattern.strugglingTopics.some(topic => item.topics.includes(topic))) {
      score += 3;
    }

    // Learning pace alignment
    const paceAlignment = this.calculatePaceAlignment(item, pattern.learningPace);
    score += paceAlignment;

    // Engagement and completion rate bonus
    score += (item.metadata.engagement + item.metadata.completionRate) / 2;

    return score;
  }

  private calculatePaceAlignment(
    item: ContentItem,
    pace: 'fast' | 'medium' | 'slow'
  ): number {
    const paceFactors = {
      fast: 1.2,
      medium: 1.0,
      slow: 0.8
    };

    return item.estimatedDuration * paceFactors[pace];
  }
}

export const useContentRecommender = () => {
  const recommender = ContentRecommender.getInstance();
  return {
    getRecommendations: recommender.getRecommendations.bind(recommender)
  };
}; 