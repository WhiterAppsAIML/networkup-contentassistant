import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ContentService } from '../content/content.service';
import { CreateScheduleDto, ScheduleQueryDto } from './dto/schedule.dto';

const POSTABLE_STATUSES = ['CONTENT_GENERATED', 'IMPROVED'];

@Injectable()
export class ScheduleService {
  constructor(
    private prisma: PrismaService,
    private contentService: ContentService,
  ) {}

  async createSchedule(userId: string, dto: CreateScheduleDto) {
    const canSchedule = await this.contentService.canSchedule(dto.contentId, userId);
    if (!canSchedule) {
      throw new BadRequestException('Generate content (Module 4) before it can be scheduled');
    }

    return this.prisma.scheduledPost.create({
      data: {
        contentId: BigInt(dto.contentId),
        userId,
        scheduledFor: new Date(dto.scheduledFor),
      },
      include: {
        content: { select: { topic: true, generated: true, status: true } },
      },
    });
  }

  async list(userId: string, query: ScheduleQueryDto) {
    const { startDate, endDate, page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    const where: any = { userId };
    if (startDate || endDate) {
      where.scheduledFor = {};
      if (startDate) where.scheduledFor.gte = new Date(startDate);
      if (endDate) where.scheduledFor.lte = new Date(endDate);
    }

    const [items, total] = await Promise.all([
      this.prisma.scheduledPost.findMany({
        where,
        orderBy: { scheduledFor: 'asc' },
        skip,
        take: limit,
        include: { content: { select: { topic: true, generated: { select: { fullText: true } }, status: true } } },
      }),
      this.prisma.scheduledPost.count({ where }),
    ]);

    return { items, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 } };
  }

  async cancel(id: string, userId: string) {
    const scheduled = await this.prisma.scheduledPost.findFirst({
      where: { id: BigInt(id), userId, status: 'SCHEDULED' },
    });
    if (!scheduled) throw new NotFoundException('Scheduled post not found or already resolved');

    return this.prisma.scheduledPost.update({
      where: { id: BigInt(id) },
      data: { status: 'CANCELLED' },
    });
  }
}