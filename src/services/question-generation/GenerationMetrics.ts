import type { GenerationMetrics } from '@/types';
import { prisma } from '@/lib/prisma';

export class GenerationMetricsService {
  async getMetrics(): Promise<GenerationMetrics> {
    const metrics = await prisma.generationMetrics.findFirst();
    return {
      totalGenerations: metrics?.totalGenerations ?? 0,
      averageGenerationTime: metrics?.averageGenerationTime ?? 0,
      averageValidationScore: metrics?.averageValidationScore ?? 0,
      totalTokenUsage: metrics?.totalTokenUsage ?? 0
    };
  }

  async updateMetrics(metrics: Partial<GenerationMetrics>) {
    await prisma.generationMetrics.upsert({
      where: { id: 1 },
      create: metrics,
      update: metrics
    });
  }
} 