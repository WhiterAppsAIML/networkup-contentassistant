import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GeminiService } from '../ai/gemini.service';
import { PromptBuilderService, LeadMagnetPromptInput } from '../ai/prompt-builder.service';
import { CreateLeadMagnetDto, LeadMagnetQueryDto } from './dto/lead-magnet.dto';

@Injectable()
export class LeadMagnetService {
  constructor(
    private prisma: PrismaService,
    private gemini: GeminiService,
    private prompts: PromptBuilderService,
  ) {}

  async createAndGenerate(userId: string, dto: CreateLeadMagnetDto) {
    const { system, prompt, schema } = this.prompts.buildLeadMagnetPrompt(dto);

    const result = await this.gemini.generateJSON<{
      title: string;
      outline: string[];
      landingPageCopy: string;
      emailSequence: { subject: string; body: string }[];
      linkedinPromotionPost: string;
      cta: string;
    }>({ system, prompt, schema, maxTokens: 2200, temperature: 0.75 });

    return this.prisma.leadMagnet.create({
      data: {
        userId,
        ...dto,
        title: result.title || '',
        outline: result.outline || [],
        landingPageCopy: result.landingPageCopy || '',
        emailSequence: result.emailSequence || [],
        linkedinPromoPost: result.linkedinPromotionPost || '',
        cta: result.cta || '',
        status: 'GENERATED',
      },
    });
  }

  async getOrThrow(id: string, userId: string) {
    const lm = await this.prisma.leadMagnet.findFirst({
      where: { id: BigInt(id), userId },
    });
    if (!lm) throw new NotFoundException('Lead magnet not found');
    return lm;
  }

  async list(userId: string, query: LeadMagnetQueryDto) {
    const { page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.prisma.leadMagnet.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.leadMagnet.count({ where: { userId } }),
    ]);

    return { items, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 } };
  }
}