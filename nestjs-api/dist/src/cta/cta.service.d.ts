import { PrismaService } from '../prisma/prisma.service';
import { CreateCtaDto, UpdateCtaDto } from './dto/cta.dto';
export declare class CtaService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: string, dto: CreateCtaDto): Promise<{
        userId: string;
        text: string;
        id: bigint;
        type: string;
        createdAt: Date;
        updatedAt: Date;
        timesUsed: number;
        avgEngagement: number | null;
    }>;
    list(userId: string, page?: number, limit?: number): Promise<{
        items: {
            userId: string;
            text: string;
            id: bigint;
            type: string;
            createdAt: Date;
            updatedAt: Date;
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
    getById(id: string, userId: string): Promise<{
        userId: string;
        text: string;
        id: bigint;
        type: string;
        createdAt: Date;
        updatedAt: Date;
        timesUsed: number;
        avgEngagement: number | null;
    }>;
    update(id: string, userId: string, dto: UpdateCtaDto): Promise<{
        userId: string;
        text: string;
        id: bigint;
        type: string;
        createdAt: Date;
        updatedAt: Date;
        timesUsed: number;
        avgEngagement: number | null;
    }>;
    remove(id: string, userId: string): Promise<{
        message: string;
    }>;
}
