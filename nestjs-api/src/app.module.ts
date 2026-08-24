import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

import { PrismaModule } from './prisma/prisma.module';
import { VectorModule } from './vector/vector.module';
import { AiModule } from './ai/ai.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ContentModule } from './content/content.module';
import { LeadMagnetModule } from './lead-magnet/lead-magnet.module';
import { LibraryModule } from './library/library.module';
import { ScheduleModule } from './schedule/schedule.module';
import { FrameworkModule } from './framework/framework.module';
import { CtaModule } from './cta/cta.module';
import { RagModule } from './rag/rag.module';

import { TierRateLimitGuard } from './common/guards/tier-rate-limit.guard';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      cache: true,
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 100,
        },
      ],
    }),
    PrismaModule,
    VectorModule,
    AiModule,
    AuthModule,
    UserModule,
    ContentModule,
    LeadMagnetModule,
    LibraryModule,
    ScheduleModule,
    FrameworkModule,
    CtaModule,
    RagModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: TierRateLimitGuard,
    },
  ],
})
export class AppModule {}