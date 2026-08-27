import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AiModule } from '../ai/ai.module';
import { QualityCheckService } from './quality-check.service';
import { QualityCheckController } from './quality-check.controller';

@Module({
  imports: [PrismaModule, AiModule],
  controllers: [QualityCheckController],
  providers: [QualityCheckService],
  exports: [QualityCheckService],
})
export class QualityCheckModule {}