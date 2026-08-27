import { PrismaService } from '../prisma/prisma.service';
import { GeminiService } from '../ai/gemini.service';
import { PromptBuilderService } from '../ai/prompt-builder.service';
import { CreateContentDto, SelectAngleDto, SelectHookDto, ImproveContentDto, ContentQueryDto } from './dto/content.dto';
export declare class ContentService {
    private prisma;
    private gemini;
    private prompts;
    constructor(prisma: PrismaService, gemini: GeminiService, prompts: PromptBuilderService);
    createDraft(userId: string, dto: CreateContentDto): Promise<{
        userId: string;
        id: bigint;
        status: import("@prisma/client").$Enums.ContentStatus;
        cta: string;
        createdAt: Date;
        updatedAt: Date;
        audience: string;
        contentGoal: string;
        postType: string;
        topic: string;
        experienceNotes: string;
        tone: string;
        selectedAngleId: bigint | null;
        selectedHookId: bigint | null;
        qualityScores: import("@prisma/client/runtime/library").JsonValue | null;
        qualityOverall: number | null;
        qualityWeakDimensions: import("@prisma/client/runtime/library").JsonValue | null;
        qualityCheckedAt: Date | null;
    }>;
    getDraftOrThrow(contentId: string, userId: string): Promise<{
        angles: {
            text: string;
            id: bigint;
            type: string;
            label: string;
            contentId: bigint;
            sortOrder: number;
        }[];
        hooks: {
            userId: string;
            text: string;
            id: bigint;
            category: import("@prisma/client").$Enums.HookCategory;
            createdAt: Date;
            contentId: bigint;
            timesUsed: number;
            avgEngagement: number | null;
        }[];
        generated: {
            hook: string | null;
            problem: string | null;
            experience: string | null;
            insight: string | null;
            takeaway: string | null;
            cta: string | null;
            fullText: string | null;
            contentId: bigint;
        } | null;
    } & {
        userId: string;
        id: bigint;
        status: import("@prisma/client").$Enums.ContentStatus;
        cta: string;
        createdAt: Date;
        updatedAt: Date;
        audience: string;
        contentGoal: string;
        postType: string;
        topic: string;
        experienceNotes: string;
        tone: string;
        selectedAngleId: bigint | null;
        selectedHookId: bigint | null;
        qualityScores: import("@prisma/client/runtime/library").JsonValue | null;
        qualityOverall: number | null;
        qualityWeakDimensions: import("@prisma/client/runtime/library").JsonValue | null;
        qualityCheckedAt: Date | null;
    }>;
    listContent(userId: string, query: ContentQueryDto): Promise<{
        items: ({
            hooks: {
                userId: string;
                text: string;
                id: bigint;
                category: import("@prisma/client").$Enums.HookCategory;
                createdAt: Date;
                contentId: bigint;
                timesUsed: number;
                avgEngagement: number | null;
            }[];
            generated: {
                hook: string | null;
                problem: string | null;
                experience: string | null;
                insight: string | null;
                takeaway: string | null;
                cta: string | null;
                fullText: string | null;
                contentId: bigint;
            } | null;
        } & {
            userId: string;
            id: bigint;
            status: import("@prisma/client").$Enums.ContentStatus;
            cta: string;
            createdAt: Date;
            updatedAt: Date;
            audience: string;
            contentGoal: string;
            postType: string;
            topic: string;
            experienceNotes: string;
            tone: string;
            selectedAngleId: bigint | null;
            selectedHookId: bigint | null;
            qualityScores: import("@prisma/client/runtime/library").JsonValue | null;
            qualityOverall: number | null;
            qualityWeakDimensions: import("@prisma/client/runtime/library").JsonValue | null;
            qualityCheckedAt: Date | null;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    generateAngles(contentId: string, userId: string): Promise<{
        angles: {
            text: string;
            id: bigint;
            type: string;
            label: string;
            contentId: bigint;
            sortOrder: number;
        }[];
        hooks: {
            userId: string;
            text: string;
            id: bigint;
            category: import("@prisma/client").$Enums.HookCategory;
            createdAt: Date;
            contentId: bigint;
            timesUsed: number;
            avgEngagement: number | null;
        }[];
        generated: {
            hook: string | null;
            problem: string | null;
            experience: string | null;
            insight: string | null;
            takeaway: string | null;
            cta: string | null;
            fullText: string | null;
            contentId: bigint;
        } | null;
    } & {
        userId: string;
        id: bigint;
        status: import("@prisma/client").$Enums.ContentStatus;
        cta: string;
        createdAt: Date;
        updatedAt: Date;
        audience: string;
        contentGoal: string;
        postType: string;
        topic: string;
        experienceNotes: string;
        tone: string;
        selectedAngleId: bigint | null;
        selectedHookId: bigint | null;
        qualityScores: import("@prisma/client/runtime/library").JsonValue | null;
        qualityOverall: number | null;
        qualityWeakDimensions: import("@prisma/client/runtime/library").JsonValue | null;
        qualityCheckedAt: Date | null;
    }>;
    selectAngle(contentId: string, userId: string, dto: SelectAngleDto): Promise<{
        angles: {
            text: string;
            id: bigint;
            type: string;
            label: string;
            contentId: bigint;
            sortOrder: number;
        }[];
        hooks: {
            userId: string;
            text: string;
            id: bigint;
            category: import("@prisma/client").$Enums.HookCategory;
            createdAt: Date;
            contentId: bigint;
            timesUsed: number;
            avgEngagement: number | null;
        }[];
        generated: {
            hook: string | null;
            problem: string | null;
            experience: string | null;
            insight: string | null;
            takeaway: string | null;
            cta: string | null;
            fullText: string | null;
            contentId: bigint;
        } | null;
    } & {
        userId: string;
        id: bigint;
        status: import("@prisma/client").$Enums.ContentStatus;
        cta: string;
        createdAt: Date;
        updatedAt: Date;
        audience: string;
        contentGoal: string;
        postType: string;
        topic: string;
        experienceNotes: string;
        tone: string;
        selectedAngleId: bigint | null;
        selectedHookId: bigint | null;
        qualityScores: import("@prisma/client/runtime/library").JsonValue | null;
        qualityOverall: number | null;
        qualityWeakDimensions: import("@prisma/client/runtime/library").JsonValue | null;
        qualityCheckedAt: Date | null;
    }>;
    generateHooks(contentId: string, userId: string): Promise<{
        angles: {
            text: string;
            id: bigint;
            type: string;
            label: string;
            contentId: bigint;
            sortOrder: number;
        }[];
        hooks: {
            userId: string;
            text: string;
            id: bigint;
            category: import("@prisma/client").$Enums.HookCategory;
            createdAt: Date;
            contentId: bigint;
            timesUsed: number;
            avgEngagement: number | null;
        }[];
        generated: {
            hook: string | null;
            problem: string | null;
            experience: string | null;
            insight: string | null;
            takeaway: string | null;
            cta: string | null;
            fullText: string | null;
            contentId: bigint;
        } | null;
    } & {
        userId: string;
        id: bigint;
        status: import("@prisma/client").$Enums.ContentStatus;
        cta: string;
        createdAt: Date;
        updatedAt: Date;
        audience: string;
        contentGoal: string;
        postType: string;
        topic: string;
        experienceNotes: string;
        tone: string;
        selectedAngleId: bigint | null;
        selectedHookId: bigint | null;
        qualityScores: import("@prisma/client/runtime/library").JsonValue | null;
        qualityOverall: number | null;
        qualityWeakDimensions: import("@prisma/client/runtime/library").JsonValue | null;
        qualityCheckedAt: Date | null;
    }>;
    selectHook(contentId: string, userId: string, dto: SelectHookDto): Promise<{
        angles: {
            text: string;
            id: bigint;
            type: string;
            label: string;
            contentId: bigint;
            sortOrder: number;
        }[];
        hooks: {
            userId: string;
            text: string;
            id: bigint;
            category: import("@prisma/client").$Enums.HookCategory;
            createdAt: Date;
            contentId: bigint;
            timesUsed: number;
            avgEngagement: number | null;
        }[];
        generated: {
            hook: string | null;
            problem: string | null;
            experience: string | null;
            insight: string | null;
            takeaway: string | null;
            cta: string | null;
            fullText: string | null;
            contentId: bigint;
        } | null;
    } & {
        userId: string;
        id: bigint;
        status: import("@prisma/client").$Enums.ContentStatus;
        cta: string;
        createdAt: Date;
        updatedAt: Date;
        audience: string;
        contentGoal: string;
        postType: string;
        topic: string;
        experienceNotes: string;
        tone: string;
        selectedAngleId: bigint | null;
        selectedHookId: bigint | null;
        qualityScores: import("@prisma/client/runtime/library").JsonValue | null;
        qualityOverall: number | null;
        qualityWeakDimensions: import("@prisma/client/runtime/library").JsonValue | null;
        qualityCheckedAt: Date | null;
    }>;
    generateContent(contentId: string, userId: string): Promise<{
        angles: {
            text: string;
            id: bigint;
            type: string;
            label: string;
            contentId: bigint;
            sortOrder: number;
        }[];
        hooks: {
            userId: string;
            text: string;
            id: bigint;
            category: import("@prisma/client").$Enums.HookCategory;
            createdAt: Date;
            contentId: bigint;
            timesUsed: number;
            avgEngagement: number | null;
        }[];
        generated: {
            hook: string | null;
            problem: string | null;
            experience: string | null;
            insight: string | null;
            takeaway: string | null;
            cta: string | null;
            fullText: string | null;
            contentId: bigint;
        } | null;
    } & {
        userId: string;
        id: bigint;
        status: import("@prisma/client").$Enums.ContentStatus;
        cta: string;
        createdAt: Date;
        updatedAt: Date;
        audience: string;
        contentGoal: string;
        postType: string;
        topic: string;
        experienceNotes: string;
        tone: string;
        selectedAngleId: bigint | null;
        selectedHookId: bigint | null;
        qualityScores: import("@prisma/client/runtime/library").JsonValue | null;
        qualityOverall: number | null;
        qualityWeakDimensions: import("@prisma/client/runtime/library").JsonValue | null;
        qualityCheckedAt: Date | null;
    }>;
    improveContent(contentId: string, userId: string, dto: ImproveContentDto): Promise<{
        angles: {
            text: string;
            id: bigint;
            type: string;
            label: string;
            contentId: bigint;
            sortOrder: number;
        }[];
        hooks: {
            userId: string;
            text: string;
            id: bigint;
            category: import("@prisma/client").$Enums.HookCategory;
            createdAt: Date;
            contentId: bigint;
            timesUsed: number;
            avgEngagement: number | null;
        }[];
        generated: {
            hook: string | null;
            problem: string | null;
            experience: string | null;
            insight: string | null;
            takeaway: string | null;
            cta: string | null;
            fullText: string | null;
            contentId: bigint;
        } | null;
    } & {
        userId: string;
        id: bigint;
        status: import("@prisma/client").$Enums.ContentStatus;
        cta: string;
        createdAt: Date;
        updatedAt: Date;
        audience: string;
        contentGoal: string;
        postType: string;
        topic: string;
        experienceNotes: string;
        tone: string;
        selectedAngleId: bigint | null;
        selectedHookId: bigint | null;
        qualityScores: import("@prisma/client/runtime/library").JsonValue | null;
        qualityOverall: number | null;
        qualityWeakDimensions: import("@prisma/client/runtime/library").JsonValue | null;
        qualityCheckedAt: Date | null;
    }>;
    archiveContent(contentId: string, userId: string): Promise<{
        userId: string;
        id: bigint;
        status: import("@prisma/client").$Enums.ContentStatus;
        cta: string;
        createdAt: Date;
        updatedAt: Date;
        audience: string;
        contentGoal: string;
        postType: string;
        topic: string;
        experienceNotes: string;
        tone: string;
        selectedAngleId: bigint | null;
        selectedHookId: bigint | null;
        qualityScores: import("@prisma/client/runtime/library").JsonValue | null;
        qualityOverall: number | null;
        qualityWeakDimensions: import("@prisma/client/runtime/library").JsonValue | null;
        qualityCheckedAt: Date | null;
    }>;
    deleteContent(contentId: string, userId: string): Promise<{
        message: string;
    }>;
    canSchedule(contentId: string, userId: string): Promise<boolean>;
}
