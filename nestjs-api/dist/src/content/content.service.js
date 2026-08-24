"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const gemini_service_1 = require("../ai/gemini.service");
const prompt_builder_service_1 = require("../ai/prompt-builder.service");
const IMPROVABLE_STATUSES = ['CONTENT_GENERATED', 'IMPROVED'];
const POSTABLE_STATUSES = ['CONTENT_GENERATED', 'IMPROVED'];
let ContentService = class ContentService {
    constructor(prisma, gemini, prompts) {
        this.prisma = prisma;
        this.gemini = gemini;
        this.prompts = prompts;
    }
    async createDraft(userId, dto) {
        return this.prisma.content.create({
            data: { userId, ...dto, status: 'DRAFT' },
        });
    }
    async getDraftOrThrow(contentId, userId) {
        const content = await this.prisma.content.findFirst({
            where: { id: BigInt(contentId), userId },
            include: { angles: true, generated: true, hooks: true },
        });
        if (!content)
            throw new common_1.NotFoundException('Content not found');
        return content;
    }
    async listContent(userId, query) {
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
    async generateAngles(contentId, userId) {
        const content = await this.getDraftOrThrow(contentId, userId);
        const { system, prompt, schema } = this.prompts.buildAnglePrompt({
            contentGoal: content.contentGoal,
            postType: content.postType,
            topic: content.topic,
            audience: content.audience,
            experienceNotes: content.experienceNotes,
            tone: content.tone,
        });
        const result = await this.gemini.generateJSON({ system, prompt, schema });
        if (!Array.isArray(result.angles) || result.angles.length !== 5) {
            throw new common_1.BadRequestException('AI did not return 5 angles as expected');
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
    async selectAngle(contentId, userId, dto) {
        const content = await this.getDraftOrThrow(contentId, userId);
        const angle = content.angles.find(a => a.id.toString() === dto.angleId);
        if (!angle)
            throw new common_1.NotFoundException('Angle not found on this draft');
        await this.prisma.content.update({
            where: { id: BigInt(contentId) },
            data: { selectedAngleId: angle.id },
        });
        return this.getDraftOrThrow(contentId, userId);
    }
    async generateHooks(contentId, userId) {
        const content = await this.getDraftOrThrow(contentId, userId);
        if (!content.selectedAngleId) {
            throw new common_1.BadRequestException('Select an angle before generating hooks');
        }
        const selectedAngle = content.angles.find(a => a.id === content.selectedAngleId);
        if (!selectedAngle)
            throw new common_1.NotFoundException('Selected angle could not be found');
        const { system, prompt, schema } = this.prompts.buildHookPrompt({
            selectedAngleText: selectedAngle.text,
            experienceNotes: content.experienceNotes,
            tone: content.tone,
            topic: content.topic,
        });
        const result = await this.gemini.generateJSON({ system, prompt, schema });
        if (!Array.isArray(result.hooks) || result.hooks.length !== 4) {
            throw new common_1.BadRequestException('AI did not return 4 hooks as expected');
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
    async selectHook(contentId, userId, dto) {
        const content = await this.getDraftOrThrow(contentId, userId);
        const hook = await this.prisma.hook.findFirst({
            where: { id: BigInt(dto.hookId), contentId: BigInt(contentId) },
        });
        if (!hook)
            throw new common_1.NotFoundException('Hook not found on this draft');
        await this.prisma.content.update({
            where: { id: BigInt(contentId) },
            data: { selectedHookId: hook.id, status: 'HOOK_SELECTED' },
        });
        return this.getDraftOrThrow(contentId, userId);
    }
    async generateContent(contentId, userId) {
        const content = await this.getDraftOrThrow(contentId, userId);
        if (!content.selectedAngleId) {
            throw new common_1.BadRequestException('Select an angle before generating content');
        }
        if (!content.selectedHookId) {
            throw new common_1.BadRequestException('Select a hook before generating content');
        }
        const selectedAngle = content.angles.find(a => a.id === content.selectedAngleId);
        const hook = await this.prisma.hook.findFirst({
            where: { id: content.selectedHookId, contentId: BigInt(contentId) },
        });
        if (!selectedAngle || !hook) {
            throw new common_1.BadRequestException('Selected angle or hook could not be found');
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
        const result = await this.gemini.generateJSON({ system, prompt, schema, maxTokens: 1800, temperature: 0.75 });
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
        return this.getDraftOrThrow(contentId, userId);
    }
    async improveContent(contentId, userId, dto) {
        const content = await this.getDraftOrThrow(contentId, userId);
        if (!IMPROVABLE_STATUSES.includes(content.status)) {
            throw new common_1.BadRequestException('Generate content (Module 4) before requesting an improvement');
        }
        if (!content.generated) {
            throw new common_1.BadRequestException('No generated content to improve');
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
        const result = await this.gemini.generateJSON({ system, prompt, schema, maxTokens: 1800, temperature: 0.7 });
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
    async archiveContent(contentId, userId) {
        const content = await this.prisma.content.findFirst({ where: { id: BigInt(contentId), userId } });
        if (!content)
            throw new common_1.NotFoundException('Content not found');
        return this.prisma.content.update({
            where: { id: BigInt(contentId) },
            data: { status: 'ARCHIVED' },
        });
    }
    async deleteContent(contentId, userId) {
        const content = await this.prisma.content.findFirst({ where: { id: BigInt(contentId), userId } });
        if (!content)
            throw new common_1.NotFoundException('Content not found');
        await this.prisma.$transaction([
            this.prisma.hook.deleteMany({ where: { contentId: BigInt(contentId) } }),
            this.prisma.content.delete({ where: { id: BigInt(contentId) } }),
        ]);
        return { message: 'Content deleted' };
    }
    async canSchedule(contentId, userId) {
        const content = await this.getDraftOrThrow(contentId, userId);
        return POSTABLE_STATUSES.includes(content.status);
    }
};
exports.ContentService = ContentService;
exports.ContentService = ContentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        gemini_service_1.GeminiService,
        prompt_builder_service_1.PromptBuilderService])
], ContentService);
//# sourceMappingURL=content.service.js.map