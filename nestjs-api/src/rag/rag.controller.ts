import { Controller, Post, Get, Delete, Param, Query, Body, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RequireTier, UserTier } from '../common/decorators/require-tier.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { RagService } from './rag.service';
import { AddDocumentDto, AddDocumentsBatchDto, SearchRagDto, RagListQueryDto } from './dto/rag.dto';

@ApiTags('RAG (Knowledge Base)')
@Controller('rag')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RagController {
  constructor(private ragService: RagService) {}

  @Post()
  @RequireTier(UserTier.FREE)
  @ApiOperation({ summary: 'Add a document to knowledge base (auto-chunked & embedded)' })
  async addDocument(@CurrentUser('id') userId: string, @Body() dto: AddDocumentDto) {
    return this.ragService.addDocument(userId, dto);
  }

  @Post('batch')
  @RequireTier(UserTier.PRO)
  @ApiOperation({ summary: 'Add multiple documents to knowledge base' })
  async addDocumentsBatch(@CurrentUser('id') userId: string, @Body() dto: AddDocumentsBatchDto) {
    return this.ragService.addDocumentsBatch(userId, dto);
  }

  @Get('search')
  @RequireTier(UserTier.FREE)
  @ApiOperation({ summary: 'Search knowledge base with vector similarity' })
  async search(@CurrentUser('id') userId: string, @Query() dto: SearchRagDto) {
    return this.ragService.search(userId, dto);
  }

  @Get()
  @RequireTier(UserTier.FREE)
  @ApiOperation({ summary: 'List ingested documents' })
  async list(@CurrentUser('id') userId: string, @Query() query: RagListQueryDto) {
    return this.ragService.list(userId, query);
  }

  @Delete('source/:sourceId')
  @RequireTier(UserTier.FREE)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete all chunks for a source' })
  async removeBySource(@CurrentUser('id') userId: string, @Param('sourceId') sourceId: string) {
    return this.ragService.removeBySource(userId, sourceId);
  }

  @Delete(':id')
  @RequireTier(UserTier.FREE)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete single document chunk' })
  async removeById(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.ragService.removeById(userId, id);
  }
}