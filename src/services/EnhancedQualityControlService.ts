import { prisma } from '@/lib/db';
import { logger } from '@/lib/monitoring';
import { LanguageComplexityAnalyzer } from '@/lib/analysis/LanguageComplexityAnalyzer';
import { AgeAppropriatenessChecker } from '@/lib/analysis/AgeAppropriatenessChecker';
import { ContentSafetyChecker } from '@/lib/analysis/ContentSafetyChecker';

interface EnhancedQualityMetrics {
  // Core Metrics
  clarity: number;
  difficulty: number;
  relevance: number;
  effectiveness: number;

  // Language Metrics
  readabilityScore: number;
  vocabularyLevel: number;
  sentenceComplexity: number;
  instructionClarity: number;

  // Educational Metrics
  conceptAlignment: number;
  scaffoldingLevel: number;
  learningObjectiveMatch: number;
  prerequisiteAlignment: number;

  // Child-Specific Metrics
  ageAppropriateness: number;
  engagementLevel: number;
  frustrationPotential: number;
  supportiveness: number;

  // Safety Metrics
  contentSafety: number;
  culturalSensitivity: number;
  inclusiveness: number;
}

interface QuestionReviewResult {
  approved: boolean;
  score: number;
  flags: string[];
  recommendations: string[];
}

export class EnhancedQualityControlService {
  private readonly languageAnalyzer: LanguageComplexityAnalyzer;
  private readonly ageChecker: AgeAppropriatenessChecker;
  private readonly safetyChecker: ContentSafetyChecker;

  private readonly THRESHOLDS = {
    MINIMUM_OVERALL_SCORE: 0.85,
    MINIMUM_SAFETY_SCORE: 0.95,
    MINIMUM_AGE_APPROPRIATENESS: 0.90,
    MINIMUM_CLARITY: 0.85,
    MAXIMUM_FRUSTRATION: 0.3
  };

  constructor() {
    this.languageAnalyzer = new LanguageComplexityAnalyzer();
    this.ageChecker = new AgeAppropriatenessChecker();
    this.safetyChecker = new ContentSafetyChecker();
  }

  async reviewQuestion(
    questionId: string,
    content: string,
    targetAge: number,
    conceptId: string
  ): Promise<QuestionReviewResult> {
    try {
      const metrics = await this.calculateDetailedMetrics(
        content,
        targetAge,
        conceptId
      );

      const flags: string[] = [];
      const recommendations: string[] = [];

      // Core Quality Checks
      if (metrics.clarity < this.THRESHOLDS.MINIMUM_CLARITY) {
        flags.push('CLARITY_ISSUES');
        recommendations.push('Simplify language and instructions');
      }

      // Language Complexity Checks
      if (metrics.readabilityScore < this.getMinReadabilityScore(targetAge)) {
        flags.push('READABILITY_ISSUES');
        recommendations.push('Adjust vocabulary to age level');
      }

      // Safety and Appropriateness Checks
      if (metrics.contentSafety < this.THRESHOLDS.MINIMUM_SAFETY_SCORE) {
        flags.push('SAFETY_CONCERNS');
        recommendations.push('Review content for potentially inappropriate material');
      }

      if (metrics.ageAppropriateness < this.THRESHOLDS.MINIMUM_AGE_APPROPRIATENESS) {
        flags.push('AGE_INAPPROPRIATE');
        recommendations.push('Adjust content to be more age-appropriate');
      }

      // Frustration and Engagement Checks
      if (metrics.frustrationPotential > this.THRESHOLDS.MAXIMUM_FRUSTRATION) {
        flags.push('HIGH_FRUSTRATION_RISK');
        recommendations.push('Reduce complexity or add more supportive elements');
      }

      const overallScore = this.calculateWeightedScore(metrics);
      const approved = this.isApproved(metrics, flags);

      await this.saveReviewResults(questionId, {
        metrics,
        flags,
        recommendations,
        approved,
        overallScore
      });

      return {
        approved,
        score: overallScore,
        flags,
        recommendations
      };
    } catch (error) {
      logger.error('Failed to review question', {
        questionId,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }

  private async calculateDetailedMetrics(
    content: string,
    targetAge: number,
    conceptId: string
  ): Promise<EnhancedQualityMetrics> {
    const [
      languageMetrics,
      ageMetrics,
      safetyMetrics,
      educationalMetrics
    ] = await Promise.all([
      this.languageAnalyzer.analyze(content, targetAge),
      this.ageChecker.checkAppropriateness(content, targetAge),
      this.safetyChecker.analyze(content),
      this.analyzeEducationalValue(content, conceptId)
    ]);

    return {
      // Core Metrics
      clarity: languageMetrics.clarity,
      difficulty: this.calculateDifficulty(languageMetrics, ageMetrics),
      relevance: educationalMetrics.relevance,
      effectiveness: educationalMetrics.effectiveness,

      // Language Metrics
      readabilityScore: languageMetrics.readabilityScore,
      vocabularyLevel: languageMetrics.vocabularyLevel,
      sentenceComplexity: languageMetrics.sentenceComplexity,
      instructionClarity: languageMetrics.instructionClarity,

      // Educational Metrics
      conceptAlignment: educationalMetrics.conceptAlignment,
      scaffoldingLevel: educationalMetrics.scaffoldingLevel,
      learningObjectiveMatch: educationalMetrics.objectiveMatch,
      prerequisiteAlignment: educationalMetrics.prerequisiteMatch,

      // Child-Specific Metrics
      ageAppropriateness: ageMetrics.appropriatenessScore,
      engagementLevel: ageMetrics.engagementScore,
      frustrationPotential: this.calculateFrustrationPotential(languageMetrics, ageMetrics),
      supportiveness: educationalMetrics.supportiveness,

      // Safety Metrics
      contentSafety: safetyMetrics.safetyScore,
      culturalSensitivity: safetyMetrics.culturalSensitivityScore,
      inclusiveness: safetyMetrics.inclusivenessScore
    };
  }

  private calculateWeightedScore(metrics: EnhancedQualityMetrics): number {
    const weights = {
      clarity: 0.15,
      safety: 0.20,
      ageAppropriateness: 0.15,
      effectiveness: 0.10,
      engagementLevel: 0.10,
      conceptAlignment: 0.15,
      supportiveness: 0.15
    };

    return (
      metrics.clarity * weights.clarity +
      metrics.contentSafety * weights.safety +
      metrics.ageAppropriateness * weights.ageAppropriateness +
      metrics.effectiveness * weights.effectiveness +
      metrics.engagementLevel * weights.engagementLevel +
      metrics.conceptAlignment * weights.conceptAlignment +
      metrics.supportiveness * weights.supportiveness
    );
  }

  private isApproved(metrics: EnhancedQualityMetrics, flags: string[]): boolean {
    return (
      flags.length === 0 &&
      metrics.contentSafety >= this.THRESHOLDS.MINIMUM_SAFETY_SCORE &&
      metrics.ageAppropriateness >= this.THRESHOLDS.MINIMUM_AGE_APPROPRIATENESS &&
      metrics.clarity >= this.THRESHOLDS.MINIMUM_CLARITY &&
      metrics.frustrationPotential <= this.THRESHOLDS.MAXIMUM_FRUSTRATION
    );
  }

  private getMinReadabilityScore(targetAge: number): number {
    // Adjust based on age group
    return Math.max(0.7, 0.5 + (targetAge - 7) * 0.05);
  }

  private calculateFrustrationPotential(
    languageMetrics: any,
    ageMetrics: any
  ): number {
    // Complex calculation considering multiple factors
    return 0;
  }

  private async analyzeEducationalValue(
    content: string,
    conceptId: string
  ): Promise<any> {
    // Implementation
    return {};
  }

  private async saveReviewResults(
    questionId: string,
    results: any
  ): Promise<void> {
    await prisma.questionReview.create({
      data: {
        questionId,
        metrics: results.metrics,
        flags: results.flags,
        recommendations: results.recommendations,
        approved: results.approved,
        score: results.overallScore,
        reviewedAt: new Date()
      }
    });
  }
} 