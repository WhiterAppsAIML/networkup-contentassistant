import { PrismaService } from '../prisma/prisma.service';
import { ContentListQueryDto, HooksListQueryDto } from './dto/library.dto';
export declare class LibraryService {
    private prisma;
    constructor(prisma: PrismaService);
    listContent(userId: string, query: ContentListQueryDto): Promise<{
        items: ({
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
    listHooks(userId: string, query: HooksListQueryDto): Promise<{
        items: {
            userId: string;
            text: string;
            id: bigint;
            category: import("@prisma/client").$Enums.HookCategory;
            createdAt: Date;
            contentId: bigint;
            timesUsed: number;
            avgEngagement: number | null;
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
}
