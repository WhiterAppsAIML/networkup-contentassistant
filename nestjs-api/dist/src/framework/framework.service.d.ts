import { PrismaService } from '../prisma/prisma.service';
import { CreateFrameworkDto, UpdateFrameworkDto } from './dto/framework.dto';
export declare class FrameworkService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: string, dto: CreateFrameworkDto): Promise<{
        userId: string;
        id: bigint;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        structure: import("@prisma/client/runtime/library").JsonValue;
    }>;
    list(userId: string, page?: number, limit?: number): Promise<{
        items: {
            userId: string;
            id: bigint;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            structure: import("@prisma/client/runtime/library").JsonValue;
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
        id: bigint;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        structure: import("@prisma/client/runtime/library").JsonValue;
    }>;
    update(id: string, userId: string, dto: UpdateFrameworkDto): Promise<{
        userId: string;
        id: bigint;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        structure: import("@prisma/client/runtime/library").JsonValue;
    }>;
    remove(id: string, userId: string): Promise<{
        message: string;
    }>;
}
