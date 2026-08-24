import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AiModule } from '../ai/ai.module';
import { LeadMagnetService } from './lead-magnet.service';
import { LeadMagnetController } from './lead-magnet.controller';

@Module({
  imports: [PrismaModule, AiModule],
  controllers: [LeadMagnetController],
  providers: [LeadMagnetService],
  exports: [LeadMagnetService],
})
export class LeadMagnetModule {}