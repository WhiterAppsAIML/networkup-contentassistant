import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface HealthResult {
  healthy: boolean;
  details?: any;
  error?: string;
}

@Injectable()
export class PrismaHealthIndicator {
  constructor(private prisma: PrismaService) {}

  async isHealthy(): Promise<HealthResult> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return { healthy: true, details: { connection: 'ok' } };
    } catch (error) {
      return {
        healthy: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}