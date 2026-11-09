import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PrismaHealthIndicator } from './prisma-health.indicator';
import { RedisHealthIndicator } from './redis-health.indicator';
import { QdrantHealthIndicator } from './qdrant-health.indicator';

interface HealthCheckResult {
  status: 'ok' | 'error';
  timestamp: string;
  checks?: Record<string, { status: 'up' | 'down'; details?: any; error?: string }>;
}

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(
    private prisma: PrismaHealthIndicator,
    private redis: RedisHealthIndicator,
    private qdrant: QdrantHealthIndicator,
  ) {}

  @Get('live')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Liveness probe - checks if app is running' })
  @ApiResponse({ status: 200, description: 'Application is alive' })
  async liveness(): Promise<HealthCheckResult> {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('ready')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Readiness probe - checks if app can serve requests' })
  @ApiResponse({ status: 200, description: 'Application is ready' })
  @ApiResponse({ status: 503, description: 'Application is not ready' })
  async readiness(): Promise<HealthCheckResult> {
    const checks: Record<string, { status: 'up' | 'down'; details?: any; error?: string }> = {};

    try {
      const dbResult = await this.prisma.isHealthy();
      checks.database = { status: dbResult.healthy ? 'up' : 'down', details: dbResult.details };
    } catch (error) {
      checks.database = { status: 'down', error: error instanceof Error ? error.message : 'Unknown error' };
    }

    try {
      const redisResult = await this.redis.isHealthy();
      checks.redis = { status: redisResult.healthy ? 'up' : 'down', details: redisResult.details };
    } catch (error) {
      checks.redis = { status: 'down', error: error instanceof Error ? error.message : 'Unknown error' };
    }

    try {
      const qdrantResult = await this.qdrant.isHealthy();
      checks.qdrant = { status: qdrantResult.healthy ? 'up' : 'down', details: qdrantResult.details };
    } catch (error) {
      checks.qdrant = { status: 'down', error: error instanceof Error ? error.message : 'Unknown error' };
    }

    const allHealthy = Object.values(checks).every(c => c.status === 'up');

    return {
      status: allHealthy ? 'ok' : 'error',
      timestamp: new Date().toISOString(),
      checks,
    };
  }
}