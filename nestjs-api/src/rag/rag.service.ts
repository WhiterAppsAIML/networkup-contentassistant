import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmbeddingService } from '../ai/embedding.service';
import { QdrantService } from '../vector/qdrant.service';
import { AddDocumentDto, AddDocumentsBatchDto, SearchRagDto, RagListQueryDto } from './dto/rag.dto';

const MAX_CHUNK_SIZE = 1000;
const CHUNK_OVERLAP = 100;

@Injectable()
export class RagService {
  constructor(
    private prisma: PrismaService,
    private embedding: EmbeddingService,
    private qdrant: QdrantService,
  ) {}

  private chunkText(text: string, maxSize = MAX_CHUNK_SIZE, overlap = CHUNK_OVERLAP): string[] {
    const chunks: string[] = [];
    let start = 0;
    while (start < text.length) {
      const end = Math.min(start + maxSize, text.length);
      chunks.push(text.slice(start, end));
      start += maxSize - overlap;
    }
    return chunks;
  }

  async addDocument(userId: string, dto: AddDocumentDto) {
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
          sourceType: dto.sourceType as any,
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

  async addDocumentsBatch(userId: string, dto: AddDocumentsBatchDto) {
    const allResults = [];
    for (const doc of dto.documents) {
      const results = await this.addDocument(userId, doc);
      allResults.push(...results);
    }
    return allResults;
  }

  async search(userId: string, dto: SearchRagDto) {
    const queryEmbedding = await this.embedding.embed(dto.query);

    const filter: Record<string, any> = { userId };
    if (dto.sourceId) filter.sourceId = dto.sourceId;

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

  async list(userId: string, query: RagListQueryDto) {
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

  async removeBySource(userId: string, sourceId: string) {
    await this.qdrant.delete({ userId, sourceId });
    return this.prisma.ragDocument.deleteMany({ where: { userId, sourceId } });
  }

  async removeById(userId: string, id: string) {
    const doc = await this.prisma.ragDocument.findFirst({ where: { id: BigInt(id), userId } });
    if (!doc) throw new NotFoundException('Document not found');

    await this.qdrant.deleteByIds([`${userId}-${doc.sourceId}-${doc.chunkIndex}-*`]);
    await this.prisma.ragDocument.delete({ where: { id: BigInt(id) } });
    return { message: 'Document deleted' };
  }
}