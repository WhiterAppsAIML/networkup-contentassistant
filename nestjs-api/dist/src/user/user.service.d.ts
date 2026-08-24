import { PrismaService } from '../prisma/prisma.service';
export declare class UserService {
    private prisma;
    constructor(prisma: PrismaService);
    getProfile(userId: string): Promise<{
        id: string;
        email: string;
        tier: import("@prisma/client").$Enums.UserTier;
        createdAt: Date;
    }>;
    getUsageStats(userId: string): Promise<{
        content: number;
        hooks: number;
        leadMagnets: number;
        frameworks: number;
        ctas: number;
        scheduledPosts: number;
        ragDocuments: number;
    }>;
    upgradeTier(userId: string, tier: 'PRO' | 'ENTERPRISE'): Promise<{
        id: string;
        email: string;
        tier: import("@prisma/client").$Enums.UserTier;
    }>;
}
