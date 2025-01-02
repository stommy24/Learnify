import { OpenAI } from 'openai';
import { prisma } from '@/lib/db';
import { logger } from '@/lib/monitoring';
import { profanityFilter } from '@/lib/utils/profanityFilter';
import { biasDetector } from '@/lib/utils/biasDetector';
import { sensitivityAnalyzer } from '@/lib/utils/sensitivityAnalyzer';

interface SafetyMetrics {
  safetyScore: number;
  culturalSensitivityScore: number;
  inclusivenessScore: number;
  flags: string[];
  warnings: string[];
}

interface ContentCheck {
  type: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  description: string;
}

export class ContentSafetyChecker {
  private openai: OpenAI;
  private readonly SAFETY_THRESHOLD = 0.95;
  private readonly SENSITIVITY_THRESHOLD = 0.90;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  async analyze(content: string): Promise<SafetyMetrics> {
    try {
      const [
        basicSafetyCheck,
        aiSafetyCheck,
        culturalCheck,
        inclusivityCheck
      ] = await Promise.all([
        this.performBasicSafetyCheck(content),
        this.performAISafetyCheck(content),
        this.checkCulturalSensitivity(content),
        this.checkInclusiveness(content)
      ]);

      const flags = [...basicSafetyCheck.flags, ...aiSafetyCheck.flags];
      const warnings = [...basicSafetyCheck.warnings, ...aiSafetyCheck.warnings];

      const safetyScore = this.calculateSafetyScore(
        basicSafetyCheck.checks,
        aiSafetyCheck.checks
      );

      await this.logSafetyCheck(content, {
        safetyScore,
        culturalSensitivityScore: culturalCheck.score,
        inclusivenessScore: inclusivityCheck.score,
        flags,
        warnings
      });

      return {
        safetyScore,
        culturalSensitivityScore: culturalCheck.score,
        inclusivenessScore: inclusivityCheck.score,
        flags,
        warnings
      };
    } catch (error) {
      logger.error('Content safety check failed', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }

  private async performBasicSafetyCheck(content: string) {
    const checks: ContentCheck[] = [];
    const flags: string[] = [];
    const warnings: string[] = [];

    // Profanity Check
    const profanityResult = profanityFilter.check(content);
    if (profanityResult.matches.length > 0) {
      checks.push({
        type: 'PROFANITY',
        severity: 'HIGH',
        description: 'Inappropriate language detected'
      });
      flags.push('CONTAINS_PROFANITY');
    }

    // Personal Information Check
    if (this.containsPersonalInfo(content)) {
      checks.push({
        type: 'PERSONAL_INFO',
        severity: 'HIGH',
        description: 'Potential personal information detected'
      });
      flags.push('CONTAINS_PERSONAL_INFO');
    }

    // External Links Check
    if (this.containsExternalLinks(content)) {
      checks.push({
        type: 'EXTERNAL_LINKS',
        severity: 'MEDIUM',
        description: 'Contains external links'
      });
      warnings.push('CONTAINS_EXTERNAL_LINKS');
    }

    return { checks, flags, warnings };
  }

  private async performAISafetyCheck(content: string) {
    const response = await this.openai.moderations.create({
      input: content
    });

    const flags: string[] = [];
    const warnings: string[] = [];
    const checks: ContentCheck[] = [];

    if (response.results[0].flagged) {
      const categories = response.results[0].categories;
      Object.entries(categories).forEach(([category, flagged]) => {
        if (flagged) {
          checks.push({
            type: 'AI_SAFETY',
            severity: 'HIGH',
            description: `AI flagged content for ${category}`
          });
          flags.push(`AI_FLAGGED_${category.toUpperCase()}`);
        }
      });
    }

    return { checks, flags, warnings };
  }

  private async checkCulturalSensitivity(content: string) {
    const biasResult = await biasDetector.analyze(content);
    const sensitivityResult = await sensitivityAnalyzer.analyze(content);

    return {
      score: (biasResult.score + sensitivityResult.score) / 2,
      issues: [...biasResult.issues, ...sensitivityResult.issues]
    };
  }

  private async checkInclusiveness(content: string) {
    // Implementation of inclusiveness checking
    return { score: 1 };
  }

  private calculateSafetyScore(
    basicChecks: ContentCheck[],
    aiChecks: ContentCheck[]
  ): number {
    const allChecks = [...basicChecks, ...aiChecks];
    if (allChecks.some(check => check.severity === 'HIGH')) {
      return 0;
    }

    const severityWeights = {
      LOW: 0.9,
      MEDIUM: 0.7,
      HIGH: 0
    };

    const baseScore = 1;
    const deductions = allChecks.reduce(
      (total, check) => total + (1 - severityWeights[check.severity]),
      0
    );

    return Math.max(0, baseScore - (deductions / allChecks.length));
  }

  private containsPersonalInfo(content: string): boolean {
    const patterns = [
      /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/, // Phone numbers
      /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i, // Email addresses
      /\b\d{3}[-]?\d{2}[-]?\d{4}\b/, // SSN
      /\b(?:\d[ -]*?){13,16}\b/ // Credit card numbers
    ];

    return patterns.some(pattern => pattern.test(content));
  }

  private containsExternalLinks(content: string): boolean {
    const urlPattern = /https?:\/\/[^\s]+/;
    return urlPattern.test(content);
  }

  private async logSafetyCheck(content: string, metrics: SafetyMetrics): Promise<void> {
    await prisma.safetyCheck.create({
      data: {
        content: content.substring(0, 1000), // Truncate for storage
        metrics,
        timestamp: new Date()
      }
    });
  }
} 