import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { QdrantClient } from '@qdrant/qdrant-js';

const COLLECTION_NAME = 'rag_documents';
const VECTOR_SIZE = 768;

@Injectable()
export class QdrantService implements OnModuleInit {
  private readonly logger = new Logger(QdrantService.name);
  private client: QdrantClient;

  constructor(private configService: ConfigService) {
    const url = this.configService.get<string>('QDRANT_URL') || 'http://localhost:6333';
    const apiKey = this.configService.get<string>('QDRANT_API_KEY');
    this.client = new QdrantClient({ url, apiKey });
  }

  async onModuleInit() {
    await this.ensureCollection();
  }

  private async ensureCollection() {
    try {
      const collections = await this.client.getCollections();
      const exists = collections.collections.some(c => c.name === COLLECTION_NAME);
      if (!exists) {
        await this.client.createCollection(COLLECTION_NAME, {
          vectors: { size: VECTOR_SIZE, distance: 'Cosine' },
        });
        await this.client.createPayloadIndex(COLLECTION_NAME, {
          field_name: 'userId',
          field_schema: 'keyword',
        });
        await this.client.createPayloadIndex(COLLECTION_NAME, {
          field_name: 'sourceId',
          field_schema: 'keyword',
        });
        await this.client.createPayloadIndex(COLLECTION_NAME, {
          field_name: 'sourceType',
          field_schema: 'keyword',
        });
        this.logger.log(`Created Qdrant collection: ${COLLECTION_NAME}`);
      }
    } catch (error) {
      const err = error as Error;
      this.logger.error('Failed to ensure Qdrant collection:', err.message);
    }
  }

  async upsert(points: Array<{
    id: string;
    vector: number[];
    payload: Record<string, any>;
  }>): Promise<void> {
    await this.client.upsert(COLLECTION_NAME, { wait: true, points });
  }

  async search(options: {
    vector: number[];
    filter?: Record<string, any>;
    limit?: number;
    offset?: number;
  }): Promise<Array<{ id: string; score: number; payload: Record<string, any> }>> {
    const { vector, filter, limit = 5, offset = 0 } = options;
    const result = await this.client.query(COLLECTION_NAME, {
      query: vector,
      filter: filter ? this.buildFilter(filter) : undefined,
      limit,
      offset,
      with_payload: true,
    });
    return result.points.map((p: any) => ({ id: p.id, score: p.score, payload: p.payload }));
  }

  async delete(filter: Record<string, any>): Promise<void> {
    await this.client.delete(COLLECTION_NAME, { filter: this.buildFilter(filter) });
  }

  async deleteByIds(ids: string[]): Promise<void> {
    await this.client.delete(COLLECTION_NAME, { points: ids });
  }

  private buildFilter(filter: Record<string, any>): any {
    const must = Object.entries(filter).map(([key, value]) => ({
      key,
      match: { value },
    }));
    return { must };
  }
}