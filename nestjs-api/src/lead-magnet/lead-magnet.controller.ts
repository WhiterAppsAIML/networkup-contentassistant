import { Controller, Post, Get, Param, Query, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RequireTier, UserTier } from '../common/decorators/require-tier.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { LeadMagnetService } from './lead-magnet.service';
import { CreateLeadMagnetDto, LeadMagnetQueryDto } from './dto/lead-magnet.dto';

@ApiTags('Lead Magnets')
@Controller('lead-magnets')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class LeadMagnetController {
  constructor(private leadMagnetService: LeadMagnetService) {}

  @Post()
  @RequireTier(UserTier.FREE)
  @ApiOperation({ summary: 'Create and generate lead magnet' })
  async create(@CurrentUser('id') userId: string, @Body() dto: CreateLeadMagnetDto) {
    return this.leadMagnetService.createAndGenerate(userId, dto);
  }

  @Get()
  @RequireTier(UserTier.FREE)
  @ApiOperation({ summary: 'List lead magnets' })
  async list(@CurrentUser('id') userId: string, @Query() query: LeadMagnetQueryDto) {
    return this.leadMagnetService.list(userId, query);
  }

  @Get(':id')
  @RequireTier(UserTier.FREE)
  @ApiOperation({ summary: 'Get lead magnet by ID' })
  async get(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.leadMagnetService.getOrThrow(id, userId);
  }
}