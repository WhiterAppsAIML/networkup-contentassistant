import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AiModule } from '../ai/ai.module';
import { VectorModule } from '../vector/vector.module';
import { RagService } from './rag.service';
import { RagController } from './rag.controller';

@Module({
  imports: [PrismaModule, AiModule, VectorModule],
  controllers: [RagController],
  providers: [RagService],
  exports: [RagService],
})
export class RagModule {}