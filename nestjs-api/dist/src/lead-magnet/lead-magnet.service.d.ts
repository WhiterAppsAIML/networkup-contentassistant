import { PrismaService } from '../prisma/prisma.service';
import { GeminiService } from '../ai/gemini.service';
import { PromptBuilderService } from '../ai/prompt-builder.service';
import { CreateLeadMagnetDto, LeadMagnetQueryDto } from './dto/lead-magnet.dto';
export declare class LeadMagnetService {
    private prisma;
    private gemini;
    private prompts;
    constructor(prisma: PrismaService, gemini: GeminiService, prompts: PromptBuilderService);
    createAndGenerate(userId: string, dto: CreateLeadMagnetDto): Promise<{
        userId: string;
        id: bigint;
        status: import("@prisma/client").$Enums.LMStatus;
        problem: string;
        cta: string | null;
        title: string | null;
        outline: import("@prisma/client/runtime/library").JsonValue;
        landingPageCopy: string | null;
        emailSequence: import("@prisma/client/runtime/library").JsonValue;
        createdAt: Date;
        updatedAt: Date;
        audience: string;
        topic: string;
        outcome: string;
        assetType: string;
        ctaGoal: string;
        linkedinPromoPost: string | null;
    }>;
    getOrThrow(id: string, userId: string): Promise<{
        userId: string;
        id: bigint;
        status: import("@prisma/client").$Enums.LMStatus;
        problem: string;
        cta: string | null;
        title: string | null;
        outline: import("@prisma/client/runtime/library").JsonValue;
        landingPageCopy: string | null;
        emailSequence: import("@prisma/client/runtime/library").JsonValue;
        createdAt: Date;
        updatedAt: Date;
        audience: string;
        topic: string;
        outcome: string;
        assetType: string;
        ctaGoal: string;
        linkedinPromoPost: string | null;
    }>;
    list(userId: string, query: LeadMagnetQueryDto): Promise<{
        items: {
            userId: string;
            id: bigint;
            status: import("@prisma/client").$Enums.LMStatus;
            problem: string;
            cta: string | null;
            title: string | null;
            outline: import("@prisma/client/runtime/library").JsonValue;
            landingPageCopy: string | null;
            emailSequence: import("@prisma/client/runtime/library").JsonValue;
            createdAt: Date;
            updatedAt: Date;
            audience: string;
            topic: string;
            outcome: string;
            assetType: string;
            ctaGoal: string;
            linkedinPromoPost: string | null;
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
}
