import { Controller, Post, Get, Put, Delete, Param, Query, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RequireTier, UserTier } from '../common/decorators/require-tier.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CtaService } from './cta.service';
import { CreateCtaDto, UpdateCtaDto } from './dto/cta.dto';

@ApiTags('CTAs')
@Controller('ctas')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CtaController {
  constructor(private ctaService: CtaService) {}

  @Post()
  @RequireTier(UserTier.FREE)
  @ApiOperation({ summary: 'Create a new CTA' })
  async create(@CurrentUser('id') userId: string, @Body() dto: CreateCtaDto) {
    return this.ctaService.create(userId, dto);
  }

  @Get()
  @RequireTier(UserTier.FREE)
  @ApiOperation({ summary: 'List CTAs' })
  async list(@CurrentUser('id') userId: string, @Query('page') page = 1, @Query('limit') limit = 20) {
    return this.ctaService.list(userId, Number(page), Number(limit));
  }

  @Get(':id')
  @RequireTier(UserTier.FREE)
  @ApiOperation({ summary: 'Get CTA by ID' })
  async get(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.ctaService.getById(id, userId);
  }

  @Put(':id')
  @RequireTier(UserTier.FREE)
  @ApiOperation({ summary: 'Update CTA' })
  async update(@CurrentUser('id') userId: string, @Param('id') id: string, @Body() dto: UpdateCtaDto) {
    return this.ctaService.update(id, userId, dto);
  }

  @Delete(':id')
  @RequireTier(UserTier.FREE)
  @ApiOperation({ summary: 'Delete CTA' })
  async remove(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.ctaService.remove(id, userId);
  }
}