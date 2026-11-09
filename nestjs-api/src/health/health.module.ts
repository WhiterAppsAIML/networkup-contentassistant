import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { PrismaHealthIndicator } from './prisma-health.indicator';
import { RedisHealthIndicator } from './redis-health.indicator';
import { QdrantHealthIndicator } from './qdrant-health.indicator';

@Module({
  controllers: [HealthController],
  providers: [PrismaHealthIndicator, RedisHealthIndicator, QdrantHealthIndicator],
})
export class HealthModule {}