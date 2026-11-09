import { Controller, Get, Patch, Delete, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequireTier, UserTier } from '../common/decorators/require-tier.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { LibraryService } from './library.service';
import { ContentListQueryDto, HooksListQueryDto } from './dto/library.dto';

@ApiTags('Library')
@Controller()
@ApiBearerAuth()
export class LibraryController {
  constructor(private libraryService: LibraryService) {}

  @Get('content')
  @RequireTier(UserTier.STARTER)
  @ApiOperation({ summary: 'List saved content drafts' })
  async listContent(@CurrentUser('id') userId: string, @Query() query: ContentListQueryDto) {
    return this.libraryService.listContent(userId, query);
  }

  @Patch('content/:id/archive')
  @RequireTier(UserTier.STARTER)
  @ApiOperation({ summary: 'Archive content' })
  async archiveContent(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.libraryService.archiveContent(id, userId);
  }

  @Delete('content/:id')
  @RequireTier(UserTier.STARTER)
  @ApiOperation({ summary: 'Delete content and hooks' })
  async deleteContent(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.libraryService.deleteContent(id, userId);
  }

  @Get('hooks')
  @RequireTier(UserTier.STARTER)
  @ApiOperation({ summary: 'List saved hooks' })
  async listHooks(@CurrentUser('id') userId: string, @Query() query: HooksListQueryDto) {
    return this.libraryService.listHooks(userId, query);
  }
}