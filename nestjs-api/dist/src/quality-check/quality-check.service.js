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
exports.QualityCheckService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const gemini_service_1 = require("../ai/gemini.service");
const quality_check_prompt_service_1 = require("../ai/quality-check-prompt.service");
const WEAK_SCORE_THRESHOLD = 6;
let QualityCheckService = class QualityCheckService {
    constructor(prisma, gemini, qualityCheckPrompt) {
        this.prisma = prisma;
        this.gemini = gemini;
        this.qualityCheckPrompt = qualityCheckPrompt;
    }
    async checkContentQuality(contentId, userId) {
        const content = await this.prisma.content.findFirst({
            where: { id: BigInt(contentId), userId },
            include: { generated: true },
        });
        if (!content) {
            throw new common_1.NotFoundException('Content not found');
        }
        if (!content.generated?.fullText) {
            throw new common_1.BadRequestException('Generate content before running the quality check');
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
        const result = await this.gemini.generateJSON({
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
    async getQualityCheck(contentId, userId) {
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
            throw new common_1.NotFoundException('Content not found');
        }
        if (!content.qualityScores) {
            throw new common_1.BadRequestException('Quality check not run yet');
        }
        const weakDimensions = content.qualityWeakDimensions || [];
        return {
            scores: content.qualityScores,
            overall: content.qualityOverall,
            weakDimensions,
            needsImprovement: weakDimensions.length > 0,
            checkedAt: content.qualityCheckedAt,
        };
    }
};
exports.QualityCheckService = QualityCheckService;
exports.QualityCheckService = QualityCheckService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        gemini_service_1.GeminiService,
        quality_check_prompt_service_1.QualityCheckPromptService])
], QualityCheckService);
//# sourceMappingURL=quality-check.service.js.map