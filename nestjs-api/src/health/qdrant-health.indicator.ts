import { Injectable } from '@nestjs/common';
import { QdrantService } from '../vector/qdrant.service';

export interface HealthResult {
  healthy: boolean;
  details?: any;
  error?: string;
}

@Injectable()
export class QdrantHealthIndicator {
  constructor(private qdrant: QdrantService) {}

  async isHealthy(): Promise<HealthResult> {
    try {
      const collections = await this.qdrant['client'].getCollections();
      return {
        healthy: true,
        details: { collections: collections.collections.length },
      };
    } catch (error) {
      return {
        healthy: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}