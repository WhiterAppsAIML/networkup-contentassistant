import { Controller, Post, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { RequireTier, UserTier } from '../common/decorators/require-tier.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { QualityCheckService } from './quality-check.service';

@ApiTags('Quality Check (Module 5)')
@Controller('content')
@ApiBearerAuth()
export class QualityCheckController {
  constructor(private qualityCheckService: QualityCheckService) {}

  @Post(':id/quality-check')
  @RequireTier(UserTier.STARTER)
  @ApiOperation({ summary: 'Run quality check on generated content (Module 5)' })
  async runQualityCheck(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.qualityCheckService.checkContentQuality(id, userId);
  }

  @Get(':id/quality-check')
  @RequireTier(UserTier.STARTER)
  @ApiOperation({ summary: 'Get quality check results' })
  async getQualityCheck(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.qualityCheckService.getQualityCheck(id, userId);
  }

  @Get('quality-history')
  @RequireTier(UserTier.STARTER)
  @ApiOperation({ summary: 'Get paginated quality check history for user' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 20)' })
  async getQualityHistory(
    @CurrentUser('id') userId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.qualityCheckService.getQualityHistory(userId, page || 1, limit || 20);
  }

  @Get('quality-trends')
  @RequireTier(UserTier.STARTER)
  @ApiOperation({ summary: 'Get quality check trends and averages for user' })
  async getQualityTrends(@CurrentUser('id') userId: string) {
    return this.qualityCheckService.getQualityTrends(userId);
  }
}