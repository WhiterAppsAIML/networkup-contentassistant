import { Controller, Post, Get, Delete, Param, Query, Body, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RequireTier, UserTier } from '../common/decorators/require-tier.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ScheduleService } from './schedule.service';
import { CreateScheduleDto, ScheduleQueryDto } from './dto/schedule.dto';

@ApiTags('Schedule')
@Controller('schedule')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ScheduleController {
  constructor(private scheduleService: ScheduleService) {}

  @Post()
  @RequireTier(UserTier.FREE)
  @ApiOperation({ summary: 'Schedule a post for later' })
  async create(@CurrentUser('id') userId: string, @Body() dto: CreateScheduleDto) {
    return this.scheduleService.createSchedule(userId, dto);
  }

  @Get()
  @RequireTier(UserTier.FREE)
  @ApiOperation({ summary: 'List scheduled posts with optional date range' })
  async list(@CurrentUser('id') userId: string, @Query() query: ScheduleQueryDto) {
    return this.scheduleService.list(userId, query);
  }

  @Delete(':id')
  @RequireTier(UserTier.FREE)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cancel a scheduled post' })
  async cancel(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.scheduleService.cancel(id, userId);
  }
}