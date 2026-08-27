import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GeminiService } from '../ai/gemini.service';
import { QualityCheckPromptService } from '../ai/quality-check-prompt.service';

const WEAK_SCORE_THRESHOLD = 6;

@Injectable()
export class QualityCheckService {
  constructor(
    private prisma: PrismaService,
    private gemini: GeminiService,
    private qualityCheckPrompt: QualityCheckPromptService,
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
    const weakDimensions = this.qualityCheckPrompt.getWeakDimensions(result, WEAK_SCORE_THRESHOLD);

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
}