"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RagService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const embedding_service_1 = require("../ai/embedding.service");
const qdrant_service_1 = require("../vector/qdrant.service");
const MAX_CHUNK_SIZE = 1000;
const CHUNK_OVERLAP = 100;
let RagService = class RagService {
    constructor(prisma, embedding, qdrant) {
        this.prisma = prisma;
        this.embedding = embedding;
        this.qdrant = qdrant;
    }
    chunkText(text, maxSize = MAX_CHUNK_SIZE, overlap = CHUNK_OVERLAP) {
        const chunks = [];
        let start = 0;
        while (start < text.length) {
            const end = Math.min(start + maxSize, text.length);
            chunks.push(text.slice(start, end));
            start += maxSize - overlap;
        }
        return chunks;
    }
    async addDocument(userId, dto) {
        const chunks = this.chunkText(dto.content);
        const embeddings = await this.embedding.embedBatch(chunks);
        const documents = [];
        for (let i = 0; i < chunks.length; i++) {
            const qdrantId = `${userId}-${dto.sourceId}-${(dto.chunkIndex || 0) + i}-${Date.now()}`;
            await this.qdrant.upsert([{
                    id: qdrantId,
                    vector: embeddings[i],
                    payload: {
                        userId,
                        sourceId: dto.sourceId,
                        sourceType: dto.sourceType,
                        title: dto.title,
                        chunkIndex: (dto.chunkIndex || 0) + i,
                        text: chunks[i],
                        metadata: dto.metadata || {},
                    },
                }]);
            const doc = await this.prisma.ragDocument.create({
                data: {
                    userId,
                    sourceId: dto.sourceId,
                    sourceType: dto.sourceType,
                    title: dto.title,
                    chunkIndex: (dto.chunkIndex || 0) + i,
                    text: chunks[i],
                    metadata: dto.metadata,
                },
            });
            documents.push(doc);
        }
        return documents;
    }
    async addDocumentsBatch(userId, dto) {
        const allResults = [];
        for (const doc of dto.documents) {
            const results = await this.addDocument(userId, doc);
            allResults.push(...results);
        }
        return allResults;
    }
    async search(userId, dto) {
        const queryEmbedding = await this.embedding.embed(dto.query);
        const filter = { userId };
        if (dto.sourceId)
            filter.sourceId = dto.sourceId;
        const results = await this.qdrant.search({
            vector: queryEmbedding,
            filter,
            limit: dto.topK,
        });
        return results
            .filter(r => r.score >= (dto.minScore || 0.7))
            .map(r => ({
            id: r.id,
            score: r.score,
            sourceId: r.payload.sourceId,
            sourceType: r.payload.sourceType,
            title: r.payload.title,
            content: r.payload.text,
            metadata: r.payload.metadata,
            chunkIndex: r.payload.chunkIndex,
        }));
    }
    async list(userId, query) {
        const { page = 1, limit = 20, sourceId } = query;
        const skip = (page - 1) * limit;
        const where = { userId, ...(sourceId ? { sourceId } : {}) };
        const [items, total] = await Promise.all([
            this.prisma.ragDocument.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
                select: { id: true, sourceId: true, sourceType: true, title: true, chunkIndex: true, metadata: true, createdAt: true },
            }),
            this.prisma.ragDocument.count({ where }),
        ]);
        return { items, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 } };
    }
    async removeBySource(userId, sourceId) {
        await this.qdrant.delete({ userId, sourceId });
        return this.prisma.ragDocument.deleteMany({ where: { userId, sourceId } });
    }
    async removeById(userId, id) {
        const doc = await this.prisma.ragDocument.findFirst({ where: { id: BigInt(id), userId } });
        if (!doc)
            throw new common_1.NotFoundException('Document not found');
        await this.qdrant.deleteByIds([`${userId}-${doc.sourceId}-${doc.chunkIndex}-*`]);
        await this.prisma.ragDocument.delete({ where: { id: BigInt(id) } });
        return { message: 'Document deleted' };
    }
};
exports.RagService = RagService;
exports.RagService = RagService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        embedding_service_1.EmbeddingService,
        qdrant_service_1.QdrantService])
], RagService);
//# sourceMappingURL=rag.service.js.map