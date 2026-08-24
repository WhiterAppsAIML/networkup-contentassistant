import { FrameworkService } from './framework.service';
import { CreateFrameworkDto, UpdateFrameworkDto } from './dto/framework.dto';
export declare class FrameworkController {
    private frameworkService;
    constructor(frameworkService: FrameworkService);
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
    get(userId: string, id: string): Promise<{
        userId: string;
        id: bigint;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        structure: import("@prisma/client/runtime/library").JsonValue;
    }>;
    update(userId: string, id: string, dto: UpdateFrameworkDto): Promise<{
        userId: string;
        id: bigint;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        structure: import("@prisma/client/runtime/library").JsonValue;
    }>;
    remove(userId: string, id: string): Promise<{
        message: string;
    }>;
}
