import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AiModule } from '../ai/ai.module';
import { QualityCheckModule } from '../quality-check/quality-check.module';
import { ContentService } from './content.service';
import { ContentController } from './content.controller';

@Module({
  imports: [PrismaModule, AiModule, QualityCheckModule],
  controllers: [ContentController],
  providers: [ContentService],
  exports: [ContentService],
})
export class ContentModule {}