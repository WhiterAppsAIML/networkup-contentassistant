"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduleService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const content_service_1 = require("../content/content.service");
const POSTABLE_STATUSES = ['CONTENT_GENERATED', 'IMPROVED'];
let ScheduleService = class ScheduleService {
    constructor(prisma, contentService) {
        this.prisma = prisma;
        this.contentService = contentService;
    }
    async createSchedule(userId, dto) {
        const canSchedule = await this.contentService.canSchedule(dto.contentId, userId);
        if (!canSchedule) {
            throw new common_1.BadRequestException('Generate content (Module 4) before it can be scheduled');
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
    async list(userId, query) {
        const { startDate, endDate, page = 1, limit = 20 } = query;
        const skip = (page - 1) * limit;
        const where = { userId };
        if (startDate || endDate) {
            where.scheduledFor = {};
            if (startDate)
                where.scheduledFor.gte = new Date(startDate);
            if (endDate)
                where.scheduledFor.lte = new Date(endDate);
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
    async cancel(id, userId) {
        const scheduled = await this.prisma.scheduledPost.findFirst({
            where: { id: BigInt(id), userId, status: 'SCHEDULED' },
        });
        if (!scheduled)
            throw new common_1.NotFoundException('Scheduled post not found or already resolved');
        return this.prisma.scheduledPost.update({
            where: { id: BigInt(id) },
            data: { status: 'CANCELLED' },
        });
    }
};
exports.ScheduleService = ScheduleService;
exports.ScheduleService = ScheduleService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        content_service_1.ContentService])
], ScheduleService);
//# sourceMappingURL=schedule.service.js.map