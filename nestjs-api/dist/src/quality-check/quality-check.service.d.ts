import { PrismaService } from '../prisma/prisma.service';
import { GeminiService } from '../ai/gemini.service';
import { QualityCheckPromptService } from '../ai/quality-check-prompt.service';
export declare class QualityCheckService {
    private prisma;
    private gemini;
    private qualityCheckPrompt;
    constructor(prisma: PrismaService, gemini: GeminiService, qualityCheckPrompt: QualityCheckPromptService);
    checkContentQuality(contentId: string, userId: string): Promise<{
        scores: Record<string, {
            score: number;
            issue: string;
        }>;
        overall: number;
        weakDimensions: string[];
        needsImprovement: boolean;
    }>;
    getQualityCheck(contentId: string, userId: string): Promise<{
        scores: string | number | true | import("@prisma/client/runtime/library").JsonObject | import("@prisma/client/runtime/library").JsonArray;
        overall: number | null;
        weakDimensions: string[];
        needsImprovement: boolean;
        checkedAt: Date | null;
    }>;
}
