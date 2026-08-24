import { ScheduleService } from './schedule.service';
import { CreateScheduleDto, ScheduleQueryDto } from './dto/schedule.dto';
export declare class ScheduleController {
    private scheduleService;
    constructor(scheduleService: ScheduleService);
    create(userId: string, dto: CreateScheduleDto): Promise<{
        content: {
            status: import("@prisma/client").$Enums.ContentStatus;
            topic: string;
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
        };
    } & {
        userId: string;
        id: bigint;
        status: import("@prisma/client").$Enums.ScheduleStatus;
        createdAt: Date;
        updatedAt: Date;
        contentId: bigint;
        scheduledFor: Date;
    }>;
    list(userId: string, query: ScheduleQueryDto): Promise<{
        items: ({
            content: {
                status: import("@prisma/client").$Enums.ContentStatus;
                topic: string;
                generated: {
                    fullText: string | null;
                } | null;
            };
        } & {
            userId: string;
            id: bigint;
            status: import("@prisma/client").$Enums.ScheduleStatus;
            createdAt: Date;
            updatedAt: Date;
            contentId: bigint;
            scheduledFor: Date;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    cancel(userId: string, id: string): Promise<{
        userId: string;
        id: bigint;
        status: import("@prisma/client").$Enums.ScheduleStatus;
        createdAt: Date;
        updatedAt: Date;
        contentId: bigint;
        scheduledFor: Date;
    }>;
}
