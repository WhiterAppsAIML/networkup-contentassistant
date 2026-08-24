import { CtaService } from './cta.service';
import { CreateCtaDto, UpdateCtaDto } from './dto/cta.dto';
export declare class CtaController {
    private ctaService;
    constructor(ctaService: CtaService);
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
    get(userId: string, id: string): Promise<{
        userId: string;
        text: string;
        id: bigint;
        type: string;
        createdAt: Date;
        updatedAt: Date;
        timesUsed: number;
        avgEngagement: number | null;
    }>;
    update(userId: string, id: string, dto: UpdateCtaDto): Promise<{
        userId: string;
        text: string;
        id: bigint;
        type: string;
        createdAt: Date;
        updatedAt: Date;
        timesUsed: number;
        avgEngagement: number | null;
    }>;
    remove(userId: string, id: string): Promise<{
        message: string;
    }>;
}
