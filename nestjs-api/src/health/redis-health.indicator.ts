import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';

export interface HealthResult {
  healthy: boolean;
  details?: any;
  error?: string;
}

@Injectable()
export class RedisHealthIndicator {
  constructor(private redis: RedisService) {}

  async isHealthy(): Promise<HealthResult> {
    try {
      const healthy = await this.redis.healthCheck();
      if (healthy) {
        return { healthy: true, details: { ping: 'PONG' } };
      }
      return { healthy: false, error: 'Redis ping failed' };
    } catch (error) {
      return {
        healthy: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}