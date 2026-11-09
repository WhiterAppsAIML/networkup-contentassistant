import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GeminiService } from '../ai/gemini.service';
import { PromptBuilderService, AnglePromptInput, HookPromptInput, ContentPromptInput, ImprovePromptInput } from '../ai/prompt-builder.service';
import { QualityCheckService } from '../quality-check/quality-check.service';
import { CreateContentDto, SelectAngleDto, SelectHookDto, ImproveContentDto, ContentQueryDto } from './dto/content.dto';

const IMPROVABLE_STATUSES = ['CONTENT_GENERATED', 'IMPROVED'];
const POSTABLE_STATUSES = ['CONTENT_GENERATED', 'IMPROVED'];

@Injectable()
export class ContentService {
  constructor(
    private prisma: PrismaService,
    private gemini: GeminiService,
    private prompts: PromptBuilderService,
    private qualityCheck: QualityCheckService,
  ) {}

  async createDraft(userId: string, dto: CreateContentDto) {
    return this.prisma.content.create({
      data: { userId, ...dto, status: 'DRAFT' },
    });
  }

  async getDraftOrThrow(contentId: string, userId: string) {
    const content = await this.prisma.content.findFirst({
      where: { id: BigInt(contentId), userId },
      include: { angles: true, generated: true, hooks: true },
    });
    if (!content) throw new NotFoundException('Content not found');
    return content;
  }

  async listContent(userId: string, query: ContentQueryDto) {
    const { status, page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;
    const where = { userId, ...(status ? { status } : {}) };

    const [items, total] = await Promise.all([
      this.prisma.content.findMany({
        where,
        orderBy: { updatedAt: 'desc' },
        skip,
        take: limit,
        include: { generated: true, hooks: true },
      }),
      this.prisma.content.count({ where }),
    ]);

    return {
      items,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
    };
  }

  async generateAngles(contentId: string, userId: string) {
    const content = await this.getDraftOrThrow(contentId, userId);

    const { system, prompt, schema } = this.prompts.buildAnglePrompt({
      contentGoal: content.contentGoal,
      postType: content.postType,
      topic: content.topic,
      audience: content.audience,
      experienceNotes: content.experienceNotes,
      tone: content.tone,
    });

    const result = await this.gemini.generateJSON<{ angles: any[] }>({ system, prompt, schema });

    if (!Array.isArray(result.angles) || result.angles.length !== 5) {
      throw new BadRequestException('AI did not return 5 angles as expected');
    }

    await this.prisma.$transaction([
      this.prisma.contentAngle.deleteMany({ where: { contentId: BigInt(contentId) } }),
      this.prisma.contentAngle.createMany({
        data: result.angles.map((a, i) => ({
          contentId: BigInt(contentId),
          type: a.type,
          label: a.label,
          text: a.text,
          sortOrder: i,
        })),
      }),
      this.prisma.content.update({
        where: { id: BigInt(contentId) },
        data: { status: 'ANGLES_GENERATED', selectedAngleId: null },
      }),
    ]);

    return this.getDraftOrThrow(contentId, userId);
  }

  async selectAngle(contentId: string, userId: string, dto: SelectAngleDto) {
    const content = await this.getDraftOrThrow(contentId, userId);

    const angle = content.angles.find(a => a.id.toString() === dto.angleId);
    if (!angle) throw new NotFoundException('Angle not found on this draft');

    await this.prisma.content.update({
      where: { id: BigInt(contentId) },
      data: { selectedAngleId: angle.id },
    });

    return this.getDraftOrThrow(contentId, userId);
  }

  async generateHooks(contentId: string, userId: string) {
    const content = await this.getDraftOrThrow(contentId, userId);

    if (!content.selectedAngleId) {
      throw new BadRequestException('Select an angle before generating hooks');
    }

    const selectedAngle = content.angles.find(a => a.id === content.selectedAngleId);
    if (!selectedAngle) throw new NotFoundException('Selected angle could not be found');

    const { system, prompt, schema } = this.prompts.buildHookPrompt({
      selectedAngleText: selectedAngle.text,
      experienceNotes: content.experienceNotes,
      tone: content.tone,
      topic: content.topic,
    });

    const result = await this.gemini.generateJSON<{ hooks: any[] }>({ system, prompt, schema });

    if (!Array.isArray(result.hooks) || result.hooks.length !== 4) {
      throw new BadRequestException('AI did not return 4 hooks as expected');
    }

    const hooks = await this.prisma.hook.createMany({
      data: result.hooks.map(h => ({
        contentId: BigInt(contentId),
        userId,
        category: h.category,
        text: h.text,
      })),
    });

    await this.prisma.content.update({
      where: { id: BigInt(contentId) },
      data: { status: 'HOOKS_GENERATED' },
    });

    return this.getDraftOrThrow(contentId, userId);
  }

  async selectHook(contentId: string, userId: string, dto: SelectHookDto) {
    const content = await this.getDraftOrThrow(contentId, userId);

    const hook = await this.prisma.hook.findFirst({
      where: { id: BigInt(dto.hookId), contentId: BigInt(contentId) },
    });
    if (!hook) throw new NotFoundException('Hook not found on this draft');

    await this.prisma.content.update({
      where: { id: BigInt(contentId) },
      data: { selectedHookId: hook.id, status: 'HOOK_SELECTED' },
    });

    return this.getDraftOrThrow(contentId, userId);
  }

  async generateContent(contentId: string, userId: string) {
    const content = await this.getDraftOrThrow(contentId, userId);

    if (!content.selectedAngleId) {
      throw new BadRequestException('Select an angle before generating content');
    }
    if (!content.selectedHookId) {
      throw new BadRequestException('Select a hook before generating content');
    }

    const selectedAngle = content.angles.find(a => a.id === content.selectedAngleId);
    const hook = await this.prisma.hook.findFirst({
      where: { id: content.selectedHookId, contentId: BigInt(contentId) },
    });

    if (!selectedAngle || !hook) {
      throw new BadRequestException('Selected angle or hook could not be found');
    }

    const { system, prompt, schema } = this.prompts.buildContentPrompt({
      selectedHookText: hook.text,
      selectedAngleText: selectedAngle.text,
      experienceNotes: content.experienceNotes,
      topic: content.topic,
      audience: content.audience,
      tone: content.tone,
      postType: content.postType,
      cta: content.cta,
    });

    const result = await this.gemini.generateJSON<{
      hook: string; problem: string; experience: string;
      insight: string; takeaway: string; cta: string; fullText: string;
    }>({ system, prompt, schema, maxTokens: 1800, temperature: 0.75 });

    await this.prisma.$transaction([
      this.prisma.contentGenerated.upsert({
        where: { contentId: BigInt(contentId) },
        create: { contentId: BigInt(contentId), ...result },
        update: { ...result },
      }),
      this.prisma.content.update({
        where: { id: BigInt(contentId) },
        data: { status: 'CONTENT_GENERATED' },
      }),
      this.prisma.hook.update({
        where: { id: hook.id },
        data: { timesUsed: { increment: 1 } },
      }),
    ]);

    // Auto-trigger quality check (Module 5)
    try {
      await this.qualityCheck.checkContentQuality(contentId, userId);
    } catch (error) {
      // Log error but don't fail the content generation
      console.error('Quality check failed:', error);
    }

    return this.getDraftOrThrow(contentId, userId);
  }

  async improveContent(contentId: string, userId: string, dto: ImproveContentDto) {
    const content = await this.getDraftOrThrow(contentId, userId);

    if (!IMPROVABLE_STATUSES.includes(content.status)) {
      throw new BadRequestException('Generate content (Module 4) before requesting an improvement');
    }
    if (!content.generated) {
      throw new BadRequestException('No generated content to improve');
    }

    const { system, prompt, schema } = this.prompts.buildImprovePrompt({
      action: dto.action,
      currentContent: {
        hook: content.generated.hook || '',
        problem: content.generated.problem || '',
        experience: content.generated.experience || '',
        insight: content.generated.insight || '',
        takeaway: content.generated.takeaway || '',
        cta: content.generated.cta || '',
        fullText: content.generated.fullText || '',
      },
      experienceNotes: content.experienceNotes,
      tone: content.tone,
      audience: content.audience,
    });

    const result = await this.gemini.generateJSON<{
      hook: string; problem: string; experience: string;
      insight: string; takeaway: string; cta: string; fullText: string;
    }>({ system, prompt, schema, maxTokens: 1800, temperature: 0.7 });

    await this.prisma.$transaction([
      this.prisma.contentGenerated.update({
        where: { contentId: BigInt(contentId) },
        data: { ...result },
      }),
      this.prisma.contentImprovement.create({
        data: { contentId: BigInt(contentId), action: dto.action },
      }),
      this.prisma.content.update({
        where: { id: BigInt(contentId) },
        data: { status: 'IMPROVED' },
      }),
    ]);

    return this.getDraftOrThrow(contentId, userId);
  }

  async archiveContent(contentId: string, userId: string) {
    const content = await this.prisma.content.findFirst({ where: { id: BigInt(contentId), userId } });
    if (!content) throw new NotFoundException('Content not found');

    return this.prisma.content.update({
      where: { id: BigInt(contentId) },
      data: { status: 'ARCHIVED' },
    });
  }

  async deleteContent(contentId: string, userId: string) {
    const content = await this.prisma.content.findFirst({ where: { id: BigInt(contentId), userId } });
    if (!content) throw new NotFoundException('Content not found');

    await this.prisma.$transaction([
      this.prisma.hook.deleteMany({ where: { contentId: BigInt(contentId) } }),
      this.prisma.content.delete({ where: { id: BigInt(contentId) } }),
    ]);

    return { message: 'Content deleted' };
  }

  async canSchedule(contentId: string, userId: string): Promise<boolean> {
    const content = await this.getDraftOrThrow(contentId, userId);
    return POSTABLE_STATUSES.includes(content.status);
  }
}