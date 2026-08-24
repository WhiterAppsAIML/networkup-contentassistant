import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
export declare class QdrantService implements OnModuleInit {
    private configService;
    private readonly logger;
    private client;
    constructor(configService: ConfigService);
    onModuleInit(): Promise<void>;
    private ensureCollection;
    upsert(points: Array<{
        id: string;
        vector: number[];
        payload: Record<string, any>;
    }>): Promise<void>;
    search(options: {
        vector: number[];
        filter?: Record<string, any>;
        limit?: number;
        offset?: number;
    }): Promise<Array<{
        id: string;
        score: number;
        payload: Record<string, any>;
    }>>;
    delete(filter: Record<string, any>): Promise<void>;
    deleteByIds(ids: string[]): Promise<void>;
    private buildFilter;
}
