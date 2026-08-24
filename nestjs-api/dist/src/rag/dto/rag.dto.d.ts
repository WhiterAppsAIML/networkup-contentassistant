export declare class AddDocumentDto {
    sourceId: string;
    sourceType: string;
    title: string;
    content: string;
    metadata?: Record<string, any>;
    chunkIndex?: number;
}
export declare class AddDocumentsBatchDto {
    documents: AddDocumentDto[];
}
export declare class SearchRagDto {
    query: string;
    topK?: number;
    sourceId?: string;
    minScore?: number;
}
export declare class RagListQueryDto {
    page?: number;
    limit?: number;
    sourceId?: string;
}
