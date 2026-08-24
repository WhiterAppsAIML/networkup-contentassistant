import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ContentListQueryDto, HooksListQueryDto, ContentStatusEnum, HookCategoryEnum } from './dto/library.dto';

@Injectable()
export class LibraryService {
  constructor(private prisma: PrismaService) {}

  async listContent(userId: string, query: ContentListQueryDto) {
    const { status, page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;
    const where = { userId, ...(status ? { status } : {}) };

    const [items, total] = await Promise.all([
      this.prisma.content.findMany({
        where,
        orderBy: { updatedAt: 'desc' },
        skip,
        take: limit,
        include: { generated: true },
      }),
      this.prisma.content.count({ where }),
    ]);

    return { items, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 } };
  }

  async archiveContent(contentId: string, userId: string) {
    const content = await this.prisma.content.findFirst({ where: { id: BigInt(contentId), userId } });
    if (!content) throw new NotFoundException('Content not found');

    return this.prisma.content.update({
      where: { id: BigInt(contentId) },
      data: { status: 'ARCHIVED' },
    });
  }

  async deleteContent(contentId: string, userId: string) {
    const content = await this.prisma.content.findFirst({ where: { id: BigInt(contentId), userId } });
    if (!content) throw new NotFoundException('Content not found');

    await this.prisma.$transaction([
      this.prisma.hook.deleteMany({ where: { contentId: BigInt(contentId) } }),
      this.prisma.content.delete({ where: { id: BigInt(contentId) } }),
    ]);

    return { message: 'Content deleted' };
  }

  async listHooks(userId: string, query: HooksListQueryDto) {
    const { category, page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;
    const where = { userId, ...(category ? { category } : {}) };

    const [items, total] = await Promise.all([
      this.prisma.hook.findMany({
        where,
        orderBy: [{ timesUsed: 'desc' }, { createdAt: 'desc' }],
        skip,
        take: limit,
      }),
      this.prisma.hook.count({ where }),
    ]);

    return { items, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 } };
  }
}