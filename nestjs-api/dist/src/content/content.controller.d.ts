import { ContentService } from './content.service';
import { CreateContentDto, SelectAngleDto, SelectHookDto, ImproveContentDto, ContentQueryDto } from './dto/content.dto';
export declare class ContentController {
    private contentService;
    constructor(contentService: ContentService);
    create(userId: string, dto: CreateContentDto): Promise<{
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
    list(userId: string, query: ContentQueryDto): Promise<{
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
    get(userId: string, id: string): Promise<{
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
    generateAngles(userId: string, id: string): Promise<{
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
    selectAngle(userId: string, id: string, dto: SelectAngleDto): Promise<{
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
    generateHooks(userId: string, id: string): Promise<{
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
    selectHook(userId: string, id: string, dto: SelectHookDto): Promise<{
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
    generateContent(userId: string, id: string): Promise<{
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
    improve(userId: string, id: string, dto: ImproveContentDto): Promise<{
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
    archive(userId: string, id: string): Promise<{
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
    delete(userId: string, id: string): Promise<{
        message: string;
    }>;
}
