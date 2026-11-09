import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { GeminiService } from '../ai/gemini.service';
import { QualityCheckPromptService, UserTier, TIER_QUALITY_THRESHOLDS } from '../ai/quality-check-prompt.service';
import { UserService } from '../user/user.service';

@Injectable()
export class QualityCheckService {
  constructor(
    private prisma: PrismaService,
    private gemini: GeminiService,
    private qualityCheckPrompt: QualityCheckPromptService,
    private userService: UserService,
  ) {}

  async checkContentQuality(contentId: string, userId: string) {
    const content = await this.prisma.content.findFirst({
      where: { id: BigInt(contentId), userId },
      include: { generated: true },
    });

    if (!content) {
      throw new NotFoundException('Content not found');
    }

    if (!content.generated?.fullText) {
      throw new BadRequestException('Generate content before running the quality check');
    }

    const user = await this.userService.getProfile(userId);
    const tier: UserTier = user.tier as UserTier;

    const { system, prompt, schema } = this.qualityCheckPrompt.buildQualityCheckPrompt({
      generatedContent: {
        hook: content.generated.hook || '',
        problem: content.generated.problem || '',
        experience: content.generated.experience || '',
        insight: content.generated.insight || '',
        takeaway: content.generated.takeaway || '',
        cta: content.generated.cta || '',
        fullText: content.generated.fullText || '',
      },
      experienceNotes: content.experienceNotes,
      audience: content.audience,
      tone: content.tone,
    });

    const result = await this.gemini.generateJSON<Record<string, { score: number; issue: string }>>({
      system,
      prompt,
      schema,
      maxTokens: 1000,
    });

    this.qualityCheckPrompt.validateScores(result);

    const overall = this.qualityCheckPrompt.calculateOverall(result);
    const weakDimensions = this.qualityCheckPrompt.getWeakDimensions(result, tier);

    await this.prisma.content.update({
      where: { id: BigInt(contentId) },
      data: {
        qualityScores: result,
        qualityOverall: overall,
        qualityWeakDimensions: weakDimensions,
        qualityCheckedAt: new Date(),
      },
    });

    return {
      scores: result,
      overall,
      weakDimensions,
      needsImprovement: weakDimensions.length > 0,
      tier,
      threshold: TIER_QUALITY_THRESHOLDS[tier],
    };
  }

  async getQualityCheck(contentId: string, userId: string) {
    const content = await this.prisma.content.findFirst({
      where: { id: BigInt(contentId), userId },
      select: {
        qualityScores: true,
        qualityOverall: true,
        qualityWeakDimensions: true,
        qualityCheckedAt: true,
      },
    });

    if (!content) {
      throw new NotFoundException('Content not found');
    }

    if (!content.qualityScores) {
      throw new BadRequestException('Quality check not run yet');
    }

    const weakDimensions = (content.qualityWeakDimensions as string[]) || [];

    return {
      scores: content.qualityScores,
      overall: content.qualityOverall,
      weakDimensions,
      needsImprovement: weakDimensions.length > 0,
      checkedAt: content.qualityCheckedAt,
    };
  }

  async getQualityHistory(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const notNullFilter = { not: Prisma.DbNull };

    const [items, total] = await Promise.all([
      this.prisma.content.findMany({
        where: {
          userId,
          qualityScores: notNullFilter,
        },
        orderBy: { qualityCheckedAt: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          topic: true,
          qualityScores: true,
          qualityOverall: true,
          qualityWeakDimensions: true,
          qualityCheckedAt: true,
          status: true,
        },
      }),
      this.prisma.content.count({
        where: {
          userId,
          qualityScores: notNullFilter,
        },
      }),
    ]);

    const formattedItems = items.map(item => ({
      contentId: item.id.toString(),
      topic: item.topic,
      scores: item.qualityScores,
      overall: item.qualityOverall,
      weakDimensions: (item.qualityWeakDimensions as string[]) || [],
      status: item.status,
      checkedAt: item.qualityCheckedAt,
    }));

    return {
      items: formattedItems,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
    };
  }

  async getQualityTrends(userId: string) {
    const qualityChecks = await this.prisma.content.findMany({
      where: {
        userId,
        qualityScores: { not: Prisma.DbNull },
      },
      orderBy: { qualityCheckedAt: 'asc' },
      select: {
        qualityScores: true,
        qualityOverall: true,
        qualityWeakDimensions: true,
        qualityCheckedAt: true,
      },
    });

    if (qualityChecks.length === 0) {
      return {
        averageOverall: 0,
        totalChecks: 0,
        trends: [],
        dimensionAverages: {},
        weakDimensionFrequency: {},
      };
    }

    const dimensionNames = [
      'hookStrength', 'specificity', 'humanVoice', 'credibility',
      'practicalValue', 'readability', 'promotionalRisk',
    ];

    const dimensionSums: Record<string, number> = {};
    const dimensionCounts: Record<string, number> = {};
    const weakDimensionFrequency: Record<string, number> = {};

    for (const check of qualityChecks) {
      const scores = check.qualityScores as Record<string, { score: number; issue: string }>;
      const weakDims = (check.qualityWeakDimensions as string[]) || [];

      for (const dim of dimensionNames) {
        if (scores[dim]?.score !== undefined) {
          dimensionSums[dim] = (dimensionSums[dim] || 0) + scores[dim].score;
          dimensionCounts[dim] = (dimensionCounts[dim] || 0) + 1;
        }
      }

      for (const dim of weakDims) {
        weakDimensionFrequency[dim] = (weakDimensionFrequency[dim] || 0) + 1;
      }
    }

    const dimensionAverages: Record<string, number> = {};
    for (const dim of dimensionNames) {
      if (dimensionCounts[dim]) {
        dimensionAverages[dim] = Number((dimensionSums[dim] / dimensionCounts[dim]).toFixed(1));
      }
    }

    const averageOverall = Number(
      (qualityChecks.reduce((sum, c) => sum + (c.qualityOverall || 0), 0) / qualityChecks.length).toFixed(1)
    );

    const trends = qualityChecks.map(check => ({
      checkedAt: check.qualityCheckedAt,
      overall: check.qualityOverall,
      weakCount: ((check.qualityWeakDimensions as string[]) || []).length,
    }));

    return {
      averageOverall,
      totalChecks: qualityChecks.length,
      trends,
      dimensionAverages,
      weakDimensionFrequency,
    };
  }
}