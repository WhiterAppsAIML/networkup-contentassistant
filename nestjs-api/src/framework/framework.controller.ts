import { Controller, Post, Get, Put, Delete, Param, Query, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequireTier, UserTier } from '../common/decorators/require-tier.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { FrameworkService } from './framework.service';
import { CreateFrameworkDto, UpdateFrameworkDto } from './dto/framework.dto';

@ApiTags('Frameworks (Templates)')
@Controller('frameworks')
@ApiBearerAuth()
export class FrameworkController {
  constructor(private frameworkService: FrameworkService) {}

  @Post()
  @RequireTier(UserTier.STARTER)
  @ApiOperation({ summary: 'Create a new framework/template' })
  async create(@CurrentUser('id') userId: string, @Body() dto: CreateFrameworkDto) {
    return this.frameworkService.create(userId, dto);
  }

  @Get()
  @RequireTier(UserTier.STARTER)
  @ApiOperation({ summary: 'List frameworks' })
  async list(@CurrentUser('id') userId: string, @Query('page') page = 1, @Query('limit') limit = 20) {
    return this.frameworkService.list(userId, Number(page), Number(limit));
  }

  @Get(':id')
  @RequireTier(UserTier.STARTER)
  @ApiOperation({ summary: 'Get framework by ID' })
  async get(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.frameworkService.getById(id, userId);
  }

  @Put(':id')
  @RequireTier(UserTier.STARTER)
  @ApiOperation({ summary: 'Update framework' })
  async update(@CurrentUser('id') userId: string, @Param('id') id: string, @Body() dto: UpdateFrameworkDto) {
    return this.frameworkService.update(id, userId, dto);
  }

  @Delete(':id')
  @RequireTier(UserTier.STARTER)
  @ApiOperation({ summary: 'Delete framework' })
  async remove(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.frameworkService.remove(id, userId);
  }
}