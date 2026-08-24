import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { CtaService } from './cta.service';
import { CtaController } from './cta.controller';

@Module({
  imports: [PrismaModule],
  controllers: [CtaController],
  providers: [CtaService],
  exports: [CtaService],
})
export class CtaModule {}