import { Controller, Post, Get, Patch, Delete, Body, Param, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RequireTier, UserTier } from '../common/decorators/require-tier.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ContentService } from './content.service';
import { CreateContentDto, SelectAngleDto, SelectHookDto, ImproveContentDto, ContentQueryDto } from './dto/content.dto';

@ApiTags('Content')
@Controller('content')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ContentController {
  constructor(private contentService: ContentService) {}

  @Post()
  @RequireTier(UserTier.FREE)
  @ApiOperation({ summary: 'Create new content draft' })
  async create(@CurrentUser('id') userId: string, @Body() dto: CreateContentDto) {
    return this.contentService.createDraft(userId, dto);
  }

  @Get()
  @RequireTier(UserTier.FREE)
  @ApiOperation({ summary: 'List content drafts' })
  async list(@CurrentUser('id') userId: string, @Query() query: ContentQueryDto) {
    return this.contentService.listContent(userId, query);
  }

  @Get(':id')
  @RequireTier(UserTier.FREE)
  @ApiOperation({ summary: 'Get content draft with angles, hooks, generated content' })
  async get(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.contentService.getDraftOrThrow(id, userId);
  }

  @Post(':id/angles')
  @RequireTier(UserTier.FREE)
  @ApiOperation({ summary: 'Generate 5 angles for content' })
  async generateAngles(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.contentService.generateAngles(id, userId);
  }

  @Post(':id/angles/select')
  @RequireTier(UserTier.FREE)
  @ApiOperation({ summary: 'Select an angle' })
  async selectAngle(@CurrentUser('id') userId: string, @Param('id') id: string, @Body() dto: SelectAngleDto) {
    return this.contentService.selectAngle(id, userId, dto);
  }

  @Post(':id/hooks')
  @RequireTier(UserTier.FREE)
  @ApiOperation({ summary: 'Generate 4 hooks for selected angle' })
  async generateHooks(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.contentService.generateHooks(id, userId);
  }

  @Post(':id/hooks/select')
  @RequireTier(UserTier.FREE)
  @ApiOperation({ summary: 'Select a hook' })
  async selectHook(@CurrentUser('id') userId: string, @Param('id') id: string, @Body() dto: SelectHookDto) {
    return this.contentService.selectHook(id, userId, dto);
  }

  @Post(':id/generate')
  @RequireTier(UserTier.FREE)
  @ApiOperation({ summary: 'Generate full post content' })
  async generateContent(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.contentService.generateContent(id, userId);
  }

  @Post(':id/improve')
  @RequireTier(UserTier.FREE)
  @ApiOperation({ summary: 'Apply improvement action to content' })
  async improve(@CurrentUser('id') userId: string, @Param('id') id: string, @Body() dto: ImproveContentDto) {
    return this.contentService.improveContent(id, userId, dto);
  }

  @Patch(':id/archive')
  @RequireTier(UserTier.FREE)
  @ApiOperation({ summary: 'Archive content' })
  async archive(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.contentService.archiveContent(id, userId);
  }

  @Delete(':id')
  @RequireTier(UserTier.FREE)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete content and associated hooks' })
  async delete(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.contentService.deleteContent(id, userId);
  }
}