import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { FrameworkService } from './framework.service';
import { FrameworkController } from './framework.controller';

@Module({
  imports: [PrismaModule],
  controllers: [FrameworkController],
  providers: [FrameworkService],
  exports: [FrameworkService],
})
export class FrameworkModule {}