import { ContentStatus } from '@prisma/client';
export declare class CreateContentDto {
    contentGoal: string;
    postType: string;
    topic: string;
    audience: string;
    experienceNotes: string;
    tone: string;
    cta: string;
}
export declare class SelectAngleDto {
    angleId: string;
}
export declare class SelectHookDto {
    hookId: string;
}
export declare class ImproveContentDto {
    action: string;
}
export declare class ContentQueryDto {
    status?: ContentStatus;
    page?: number;
    limit?: number;
}
export declare class AngleResponseDto {
    id: string;
    type: string;
    label: string;
    text: string;
    sortOrder: number;
}
export declare class HookResponseDto {
    id: string;
    category: string;
    text: string;
}
export declare class GeneratedContentDto {
    hook: string;
    problem: string;
    experience: string;
    insight: string;
    takeaway: string;
    cta: string;
    fullText: string;
}
