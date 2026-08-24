import { UserService } from './user.service';
export declare class UserController {
    private userService;
    constructor(userService: UserService);
    profile(userId: string): Promise<{
        id: string;
        email: string;
        tier: import("@prisma/client").$Enums.UserTier;
        createdAt: Date;
    }>;
    usage(userId: string): Promise<{
        content: number;
        hooks: number;
        leadMagnets: number;
        frameworks: number;
        ctas: number;
        scheduledPosts: number;
        ragDocuments: number;
    }>;
    upgrade(userId: string, tier: 'PRO' | 'ENTERPRISE'): Promise<{
        id: string;
        email: string;
        tier: import("@prisma/client").$Enums.UserTier;
    }>;
}
