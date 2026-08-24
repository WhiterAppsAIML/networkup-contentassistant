import { RagService } from './rag.service';
import { AddDocumentDto, AddDocumentsBatchDto, SearchRagDto, RagListQueryDto } from './dto/rag.dto';
export declare class RagController {
    private ragService;
    constructor(ragService: RagService);
    addDocument(userId: string, dto: AddDocumentDto): Promise<{
        userId: string;
        text: string;
        sourceId: string;
        sourceType: string;
        id: bigint;
        title: string;
        createdAt: Date;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        chunkIndex: number;
    }[]>;
    addDocumentsBatch(userId: string, dto: AddDocumentsBatchDto): Promise<{
        userId: string;
        text: string;
        sourceId: string;
        sourceType: string;
        id: bigint;
        title: string;
        createdAt: Date;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        chunkIndex: number;
    }[]>;
    search(userId: string, dto: SearchRagDto): Promise<{
        id: string;
        score: number;
        sourceId: any;
        sourceType: any;
        title: any;
        content: any;
        metadata: any;
        chunkIndex: any;
    }[]>;
    list(userId: string, query: RagListQueryDto): Promise<{
        items: {
            sourceId: string;
            sourceType: string;
            id: bigint;
            title: string;
            createdAt: Date;
            metadata: import("@prisma/client/runtime/library").JsonValue;
            chunkIndex: number;
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    removeBySource(userId: string, sourceId: string): Promise<import("@prisma/client").Prisma.BatchPayload>;
    removeById(userId: string, id: string): Promise<{
        message: string;
    }>;
}
