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
exports.LeadMagnetService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const gemini_service_1 = require("../ai/gemini.service");
const prompt_builder_service_1 = require("../ai/prompt-builder.service");
let LeadMagnetService = class LeadMagnetService {
    constructor(prisma, gemini, prompts) {
        this.prisma = prisma;
        this.gemini = gemini;
        this.prompts = prompts;
    }
    async createAndGenerate(userId, dto) {
        const { system, prompt, schema } = this.prompts.buildLeadMagnetPrompt(dto);
        const result = await this.gemini.generateJSON({ system, prompt, schema, maxTokens: 2200, temperature: 0.75 });
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
    async getOrThrow(id, userId) {
        const lm = await this.prisma.leadMagnet.findFirst({
            where: { id: BigInt(id), userId },
        });
        if (!lm)
            throw new common_1.NotFoundException('Lead magnet not found');
        return lm;
    }
    async list(userId, query) {
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
};
exports.LeadMagnetService = LeadMagnetService;
exports.LeadMagnetService = LeadMagnetService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        gemini_service_1.GeminiService,
        prompt_builder_service_1.PromptBuilderService])
], LeadMagnetService);
//# sourceMappingURL=lead-magnet.service.js.map