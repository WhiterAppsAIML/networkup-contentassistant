import { Controller, Post, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RequireTier, UserTier } from '../common/decorators/require-tier.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { QualityCheckService } from './quality-check.service';

@ApiTags('Quality Check (Module 5)')
@Controller('content')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class QualityCheckController {
  constructor(private qualityCheckService: QualityCheckService) {}

  @Post(':id/quality-check')
  @RequireTier(UserTier.FREE)
  @ApiOperation({ summary: 'Run quality check on generated content (Module 5)' })
  async runQualityCheck(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.qualityCheckService.checkContentQuality(id, userId);
  }

  @Get(':id/quality-check')
  @RequireTier(UserTier.FREE)
  @ApiOperation({ summary: 'Get quality check results' })
  async getQualityCheck(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.qualityCheckService.getQualityCheck(id, userId);
  }
}